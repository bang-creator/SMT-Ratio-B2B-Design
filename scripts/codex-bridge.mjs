#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const BRIDGE_DIR = path.join(WORKSPACE_ROOT, '.codex-bridge');
const BRIDGE_HTTP_HOST = '127.0.0.1';
const BRIDGE_HTTP_PORT = 4174;

const DIRS = {
  root: BRIDGE_DIR,
  tmp: path.join(BRIDGE_DIR, 'tmp'),
  inbox: path.join(BRIDGE_DIR, 'inbox'),
  active: path.join(BRIDGE_DIR, 'active'),
  ack: path.join(BRIDGE_DIR, 'ack'),
  history: path.join(BRIDGE_DIR, 'history'),
};

const LISTENER_FILE = path.join(BRIDGE_DIR, 'listener.json');
const CODEX_SESSIONS_DIR = path.join(os.homedir(), '.codex', 'sessions');
const CODEX_CURSOR_FILE = path.join(BRIDGE_DIR, 'codex-cursor.json');

const CORE_SOURCE_FILES = [
  { file: 'smt-ratio-prototype.html', role: 'prototype-markup' },
  { file: 'smt-ratio-workflows.js', role: 'workflow-logic' },
  { file: 'smt-ratio-workflows.css', role: 'workflow-styles' },
  { file: 'vanilla/base.css', role: 'design-system-css' },
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

let cachedSourceLines = null;

function getCoreSourceLines() {
  if (cachedSourceLines) return cachedSourceLines;
  const loaded = [];
  for (const entry of CORE_SOURCE_FILES) {
    const abs = path.join(WORKSPACE_ROOT, entry.file);
    if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) continue;
    try {
      const content = fs.readFileSync(abs, 'utf8');
      loaded.push({
        file: entry.file,
        role: entry.role,
        lines: content.split(/\r?\n/),
      });
    } catch {
      // Skip unreadable file
    }
  }
  cachedSourceLines = loaded;
  return cachedSourceLines;
}

function ensureBridgeDirs() {
  for (const dir of Object.values(DIRS)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function isPidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err?.code === 'EPERM';
  }
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function atomicWriteJson(targetPath, data) {
  ensureBridgeDirs();
  const baseName = path.basename(targetPath, '.json');
  const tmpName = `${baseName}.${process.pid}.${crypto.randomBytes(3).toString('hex')}.tmp`;
  const tmpPath = path.join(DIRS.tmp, tmpName);
  fs.writeFileSync(tmpPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  fs.renameSync(tmpPath, targetPath);
}

function generateBatchId() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const compact = [
    now.getUTCFullYear(),
    pad(now.getUTCMonth() + 1),
    pad(now.getUTCDate()),
    'T',
    pad(now.getUTCHours()),
    pad(now.getUTCMinutes()),
    pad(now.getUTCSeconds()),
    'Z',
  ].join('');
  const rand = crypto.randomBytes(2).toString('hex');
  return `batch-${compact}-${rand}`;
}

function parseFlags(argv) {
  const positionals = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      positionals.push(token);
      continue;
    }
    const stripped = token.slice(2);
    const eqIdx = stripped.indexOf('=');
    if (eqIdx !== -1) {
      const key = stripped.slice(0, eqIdx);
      const val = stripped.slice(eqIdx + 1);
      flags[key] = val;
    } else {
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        flags[stripped] = next;
        i += 1;
      } else {
        flags[stripped] = true;
      }
    }
  }
  return { positionals, flags };
}

function extractSelectorSignals(selector) {
  if (typeof selector !== 'string' || !selector.trim()) {
    return { inferredTag: 'element', ids: [], classes: [], attrs: {} };
  }
  const trimmed = selector.trim();
  const lastCompound = trimmed.split(/[\s>+~]+/).filter(Boolean).pop() || trimmed;
  const tagMatch = lastCompound.match(/^([a-zA-Z][a-zA-Z0-9-]*)/);
  const inferredTag = tagMatch ? tagMatch[1].toLowerCase() : 'element';

  const ids = [];
  const classes = [];
  const attrs = {};

  // Parse attribute selectors first so # or . inside attribute values don't confuse id/class parsing
  const withoutAttrs = lastCompound.replace(/\[([a-zA-Z0-9_:-]+)(?:[~|^$*]?=(?:"([^"]*)"|'([^']*)'|([^\]]*)))?\]/g, (_, key, dq, sq, uq) => {
    const val = dq ?? sq ?? uq ?? '';
    if (key) attrs[key] = val;
    return ' ';
  });

  let m;
  const idRegex = /#([a-zA-Z_-][a-zA-Z0-9_-]*)/g;
  while ((m = idRegex.exec(withoutAttrs)) !== null) ids.push(m[1]);

  const clsRegex = /\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g;
  while ((m = clsRegex.exec(withoutAttrs)) !== null) classes.push(m[1]);

  return { inferredTag, ids, classes, attrs };
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findLineMatches(lines, predicate, maxHits = 3) {
  const hits = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (predicate(lines[i], i)) {
      hits.push({ lineNumber: i + 1, text: lines[i].trim() });
      if (hits.length >= maxHits) break;
    }
  }
  return hits;
}

function autoResolveSourceMapping(domTarget) {
  const sources = getCoreSourceLines();
  const signals = extractSelectorSignals(domTarget?.selector || '');

  const candidateId = domTarget?.elementId || signals.ids[0] || null;
  const mergedAttrs = { ...signals.attrs, ...(domTarget?.attributes || {}) };

  const preferredAttrOrder = [
    'data-action',
    'data-nav-id',
    'data-case-id',
    'data-view',
    'data-tab',
    'data-modal',
    'aria-label',
    'placeholder',
    'name',
  ];
  const attrPairs = [];
  for (const key of preferredAttrOrder) {
    if (typeof mergedAttrs[key] === 'string' && mergedAttrs[key].trim()) {
      attrPairs.push([key, mergedAttrs[key].trim()]);
    }
  }
  for (const [key, val] of Object.entries(mergedAttrs)) {
    if (!preferredAttrOrder.includes(key) && key.startsWith('data-') && typeof val === 'string' && val.trim()) {
      attrPairs.push([key, val.trim()]);
    }
  }

  const rawText = typeof domTarget?.textSnippet === 'string' ? domTarget.textSnippet.trim() : '';
  const textSnippet = rawText.length >= 3 && rawText.length <= 80 ? rawText : '';

  const classSet = new Set([
    ...(Array.isArray(domTarget?.classList) ? domTarget.classList : []),
    ...signals.classes,
  ]);
  const genericSkip = new Set(['is-active', 'is-disabled', 'is-open', 'ds-flex', 'ds-row', 'ds-stack']);
  const orderedClasses = [...classSet]
    .filter((c) => c && !genericSkip.has(c))
    .sort((a, b) => b.length - a.length);

  const candidates = [];
  const seenKeys = new Set();
  const addHit = (source, lineNumber, excerpt, symbol, priority, specificity) => {
    const key = `${source.file}:${lineNumber}`;
    if (seenKeys.has(key)) return;
    seenKeys.add(key);
    candidates.push({
      file: source.file,
      role: source.role,
      lineStart: lineNumber,
      lineEnd: lineNumber,
      matchedSelectorOrSymbol: symbol,
      codeExcerpt: excerpt.slice(0, 220),
      priority,
      specificity,
    });
  };

  // 1. elementId lookup
  if (candidateId) {
    const idAttrDouble = `id="${candidateId}"`;
    const idAttrSingle = `id='${candidateId}'`;
    const getByIdSingle = `getElementById('${candidateId}')`;
    const getByIdDouble = `getElementById("${candidateId}")`;
    const cssIdRegex = new RegExp(`#${escapeRegExp(candidateId)}(?:[\\s.:,{[]|$)`);

    for (const src of sources) {
      const hits = findLineMatches(src.lines, (line) => (
        line.includes(idAttrDouble) ||
        line.includes(idAttrSingle) ||
        line.includes(getByIdSingle) ||
        line.includes(getByIdDouble) ||
        cssIdRegex.test(line)
      ), 2);
      for (const h of hits) {
        addHit(src, h.lineNumber, h.text, `#${candidateId}`, 1, 100 + candidateId.length);
      }
    }
  }

  // 2. Specific attribute lookup
  for (const [attrKey, attrVal] of attrPairs) {
    const needleDouble = `${attrKey}="${attrVal}"`;
    const needleSingle = `${attrKey}='${attrVal}'`;
    const datasetKey = attrKey.startsWith('data-')
      ? attrKey.slice(5).replace(/-([a-z])/g, (_, ch) => ch.toUpperCase())
      : null;

    for (const src of sources) {
      const hits = findLineMatches(src.lines, (line) => (
        line.includes(needleDouble) ||
        line.includes(needleSingle) ||
        (datasetKey && line.includes(datasetKey) && line.includes(attrVal))
      ), 3);
      for (const h of hits) {
        addHit(src, h.lineNumber, h.text, `[${needleDouble}]`, 2, 90 + attrVal.length);
      }
    }
  }

  // 3. Text snippet lookup in HTML / JS
  if (textSnippet) {
    const htmlEscaped = textSnippet.replace(/&/g, '&amp;');
    for (const src of sources) {
      if (src.file.endsWith('.css')) continue;
      const hits = findLineMatches(src.lines, (line) => (
        line.includes(textSnippet) || (htmlEscaped !== textSnippet && line.includes(htmlEscaped))
      ), 2);
      for (const h of hits) {
        addHit(src, h.lineNumber, h.text, textSnippet, 3, 70 + textSnippet.length);
      }
    }
  }

  // 4. CSS class lookup (styles + markup)
  for (const cls of orderedClasses.slice(0, 5)) {
    const cssRuleRegex = new RegExp(`\\.${escapeRegExp(cls)}(?:[\\s.:,{[>+~]|$)`);
    const htmlClassRegex = new RegExp(`["'\\s]${escapeRegExp(cls)}["'\\s]`);
    for (const src of sources) {
      const isCss = src.file.endsWith('.css');
      const hits = findLineMatches(src.lines, (line) => (
        isCss ? cssRuleRegex.test(line) : htmlClassRegex.test(line)
      ), isCss ? 2 : 1);
      for (const h of hits) {
        addHit(src, h.lineNumber, h.text, `.${cls}`, isCss ? 4 : 5, 40 + cls.length);
      }
    }
  }

  if (candidates.length === 0) {
    return {
      primaryFile: 'smt-ratio-prototype.html',
      lineStart: 1,
      lineEnd: 1,
      matchedSelectorOrSymbol: domTarget?.selector || '',
      codeExcerpt: '',
      relatedFiles: [],
    };
  }

  const fileOrder = new Map(CORE_SOURCE_FILES.map((item, idx) => [item.file, idx]));
  candidates.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    if (a.specificity !== b.specificity) return b.specificity - a.specificity;
    return (fileOrder.get(a.file) ?? 99) - (fileOrder.get(b.file) ?? 99);
  });

  const primary = candidates[0];
  const relatedFiles = candidates.slice(1, 6).map((c) => ({
    file: c.file,
    lineStart: c.lineStart,
    lineEnd: c.lineEnd,
    role: c.role,
  }));

  return {
    primaryFile: primary.file,
    lineStart: primary.lineStart,
    lineEnd: primary.lineEnd,
    matchedSelectorOrSymbol: primary.matchedSelectorOrSymbol,
    codeExcerpt: primary.codeExcerpt,
    relatedFiles,
  };
}

function tryNormalizeExistingWorkspaceFile(rawPath) {
  if (typeof rawPath !== 'string' || !rawPath.trim()) return null;
  let candidate = rawPath.trim();
  if (candidate.startsWith(WORKSPACE_ROOT + path.sep)) {
    candidate = candidate.slice(WORKSPACE_ROOT.length + 1);
  } else if (candidate.startsWith(WORKSPACE_ROOT + '/')) {
    candidate = candidate.slice(WORKSPACE_ROOT.length + 1);
  }
  candidate = candidate.replace(/^\.\//, '');

  const resolved = path.resolve(WORKSPACE_ROOT, candidate);
  if (resolved !== WORKSPACE_ROOT && !resolved.startsWith(WORKSPACE_ROOT + path.sep)) {
    return null;
  }
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    return null;
  }
  return path.relative(WORKSPACE_ROOT, resolved).split(path.sep).join('/');
}

function normalizeUiPanelChanges(rawChanges, fieldPath, errors) {
  if (rawChanges === undefined || rawChanges === null) {
    return [];
  }

  const cleanEntry = (entry) => {
    const out = { property: entry.property };
    if (entry.cssProperty !== undefined && entry.cssProperty !== null && String(entry.cssProperty).trim() !== '') {
      out.cssProperty = String(entry.cssProperty).trim();
    }
    if (entry.before !== undefined) out.before = entry.before;
    if (entry.after !== undefined) out.after = entry.after;
    if (entry.unit !== undefined && entry.unit !== null && String(entry.unit).trim() !== '') {
      out.unit = String(entry.unit).trim();
    }
    if (entry.note !== undefined && entry.note !== null && String(entry.note).trim() !== '') {
      out.note = String(entry.note).trim();
    }
    return out;
  };

  if (Array.isArray(rawChanges)) {
    const result = [];
    rawChanges.forEach((item, idx) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        errors.push(`${fieldPath}[${idx}]: must be an object`);
        return;
      }
      const prop = typeof item.property === 'string' && item.property.trim()
        ? item.property.trim()
        : (typeof item.cssProperty === 'string' && item.cssProperty.trim() ? item.cssProperty.trim() : '');
      if (!prop) {
        errors.push(`${fieldPath}[${idx}].property: required non-empty property name`);
        return;
      }
      result.push(cleanEntry({
        property: prop,
        cssProperty: item.cssProperty,
        before: item.before,
        after: item.after !== undefined ? item.after : item.value,
        unit: item.unit,
        note: item.note,
      }));
    });
    return result;
  }

  if (typeof rawChanges === 'object') {
    const result = [];
    for (const [key, val] of Object.entries(rawChanges)) {
      if (!key.trim()) continue;
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        result.push(cleanEntry({
          property: key.trim(),
          cssProperty: val.cssProperty,
          before: val.before,
          after: val.after !== undefined ? val.after : val.value,
          unit: val.unit,
          note: val.note,
        }));
      } else {
        result.push(cleanEntry({
          property: key.trim(),
          before: undefined,
          after: val,
        }));
      }
    }
    return result;
  }

  errors.push(`${fieldPath}: must be an array or key-value object`);
  return [];
}

function validateAndNormalizeBatch(raw) {
  const errors = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: ['root: payload must be a JSON object'] };
  }

  let batchId;
  if (raw.batchId !== undefined && raw.batchId !== null && String(raw.batchId).trim() !== '') {
    batchId = String(raw.batchId).trim();
    if (!/^[a-zA-Z0-9._-]+$/.test(batchId)) {
      errors.push('batchId: only letters, numbers, ".", "_", and "-" are permitted');
    }
  } else {
    batchId = generateBatchId();
  }

  const createdAt = typeof raw.createdAt === 'string' && raw.createdAt.trim()
    ? raw.createdAt.trim()
    : new Date().toISOString();

  const globalPrompt = typeof raw.globalPrompt === 'string' ? raw.globalPrompt.trim() : '';

  const rawPage = raw.pageContext && typeof raw.pageContext === 'object' && !Array.isArray(raw.pageContext)
    ? raw.pageContext
    : {};
  const pageUrl = typeof rawPage.url === 'string' && rawPage.url.trim()
    ? rawPage.url.trim()
    : 'http://localhost:4173/';
  const pageContext = {
    url: pageUrl,
    theme: rawPage.theme ?? null,
    viewport: rawPage.viewport ?? null,
    activeState: rawPage.activeState ?? null,
  };
  if (typeof rawPage.title === 'string' && rawPage.title.trim()) {
    pageContext.title = rawPage.title.trim();
  }

  const rawAnnotations = Array.isArray(raw.annotations) ? raw.annotations : [];
  if (raw.annotations !== undefined && !Array.isArray(raw.annotations)) {
    errors.push('annotations: must be an array');
  }
  if (rawAnnotations.length === 0 && !globalPrompt) {
    errors.push('annotations: required non-empty array when globalPrompt is empty');
  }

  const normalizedAnnotations = [];
  if (rawAnnotations.length > 0) {
    rawAnnotations.forEach((ann, idx) => {
      const prefix = `annotations[${idx}]`;
      if (!ann || typeof ann !== 'object' || Array.isArray(ann)) {
        errors.push(`${prefix}: must be an object`);
        return;
      }

      const index = ann.index !== undefined && Number.isInteger(Number(ann.index)) && Number(ann.index) >= 1
        ? Number(ann.index)
        : idx + 1;

      const label = typeof ann.label === 'string' && ann.label.trim() ? ann.label.trim() : `Annotation #${index}`;

      const rawComment = ann.comment ?? ann.note ?? ann.instruction ?? '';
      const comment = typeof rawComment === 'string' ? rawComment.trim() : '';

      const rawUiChanges = ann.uiPanelChanges ?? ann.uiChanges ?? ann.styles ?? ann.changes;
      const uiPanelChanges = normalizeUiPanelChanges(rawUiChanges, `${prefix}.uiPanelChanges`, errors);

      const computedStylesSnapshot = (ann.computedStylesSnapshot && typeof ann.computedStylesSnapshot === 'object' && !Array.isArray(ann.computedStylesSnapshot))
        ? ann.computedStylesSnapshot
        : null;

      // Support either ann.domTarget or shorthand top-level ann.selector
      const rawDom = ann.domTarget && typeof ann.domTarget === 'object' && !Array.isArray(ann.domTarget)
        ? ann.domTarget
        : {};
      const selector = typeof rawDom.selector === 'string' && rawDom.selector.trim()
        ? rawDom.selector.trim()
        : (typeof ann.selector === 'string' && ann.selector.trim() ? ann.selector.trim() : '');

      const signals = extractSelectorSignals(selector);
      const tagName = typeof rawDom.tagName === 'string' && rawDom.tagName.trim()
        ? rawDom.tagName.trim().toLowerCase()
        : signals.inferredTag;

      const elementId = typeof rawDom.elementId === 'string' && rawDom.elementId.trim()
        ? rawDom.elementId.trim()
        : (signals.ids[0] ?? null);

      const classList = Array.isArray(rawDom.classList)
        ? rawDom.classList.map((c) => String(c).trim()).filter(Boolean)
        : signals.classes;

      const attributes = (rawDom.attributes && typeof rawDom.attributes === 'object' && !Array.isArray(rawDom.attributes))
        ? { ...signals.attrs, ...rawDom.attributes }
        : signals.attrs;

      const textSnippet = typeof rawDom.textSnippet === 'string'
        ? rawDom.textSnippet
        : (typeof ann.textSnippet === 'string' ? ann.textSnippet : '');

      const occurrenceHint = typeof rawDom.occurrenceHint === 'string'
        ? rawDom.occurrenceHint
        : (typeof ann.occurrenceHint === 'string' ? ann.occurrenceHint : '');

      const boundingBox = (rawDom.boundingBox && typeof rawDom.boundingBox === 'object' && !Array.isArray(rawDom.boundingBox))
        ? rawDom.boundingBox
        : null;

      const hasDescriptiveTarget = Boolean(
        selector ||
        elementId ||
        textSnippet.trim() ||
        comment ||
        uiPanelChanges.length > 0 ||
        (typeof ann.label === 'string' && ann.label.trim())
      );

      if (!hasDescriptiveTarget) {
        errors.push(`${prefix}: provide domTarget.selector (or shorthand selector / descriptive target)`);
      }

      const normalizedDom = {
        selector: selector || (elementId ? `#${elementId}` : tagName),
        tagName,
        elementId,
        classList,
        attributes,
        textSnippet,
        occurrenceHint,
        boundingBox,
      };
      if (typeof rawDom.xpath === 'string' && rawDom.xpath.trim()) {
        normalizedDom.xpath = rawDom.xpath.trim();
      }
      if (typeof rawDom.ancestorPath === 'string' && rawDom.ancestorPath.trim()) {
        normalizedDom.ancestorPath = rawDom.ancestorPath.trim();
      }

      // Source mapping: use explicit valid path if supplied, else auto-resolve in <20ms
      const rawSrc = ann.sourceMapping && typeof ann.sourceMapping === 'object' && !Array.isArray(ann.sourceMapping)
        ? ann.sourceMapping
        : null;
      const explicitFile = rawSrc ? tryNormalizeExistingWorkspaceFile(rawSrc.primaryFile) : null;
      const autoResolved = (!explicitFile || !Number.isInteger(Number(rawSrc?.lineStart)) || Number(rawSrc?.lineStart) < 1)
        ? autoResolveSourceMapping(normalizedDom)
        : null;

      let normalizedSrc;
      if (explicitFile && Number.isInteger(Number(rawSrc.lineStart)) && Number(rawSrc.lineStart) >= 1) {
        const lineStart = Number(rawSrc.lineStart);
        const rawEnd = Number(rawSrc.lineEnd ?? lineStart);
        const lineEnd = Number.isInteger(rawEnd) && rawEnd >= lineStart ? rawEnd : lineStart;

        const relatedFiles = [];
        if (Array.isArray(rawSrc.relatedFiles)) {
          for (const relItem of rawSrc.relatedFiles) {
            if (typeof relItem === 'string') {
              const normRel = tryNormalizeExistingWorkspaceFile(relItem);
              if (normRel) relatedFiles.push({ file: normRel });
            } else if (relItem && typeof relItem === 'object' && !Array.isArray(relItem)) {
              const normRel = tryNormalizeExistingWorkspaceFile(relItem.file);
              if (normRel) {
                const entry = { file: normRel };
                if (relItem.lineStart !== undefined && Number.isInteger(Number(relItem.lineStart))) {
                  entry.lineStart = Number(relItem.lineStart);
                }
                if (relItem.lineEnd !== undefined && Number.isInteger(Number(relItem.lineEnd))) {
                  entry.lineEnd = Number(relItem.lineEnd);
                }
                if (typeof relItem.role === 'string' && relItem.role.trim()) entry.role = relItem.role.trim();
                if (typeof relItem.reason === 'string' && relItem.reason.trim()) entry.reason = relItem.reason.trim();
                relatedFiles.push(entry);
              }
            }
          }
        }

        normalizedSrc = {
          primaryFile: explicitFile,
          lineStart,
          lineEnd,
          matchedSelectorOrSymbol: typeof rawSrc.matchedSelectorOrSymbol === 'string' && rawSrc.matchedSelectorOrSymbol.trim()
            ? rawSrc.matchedSelectorOrSymbol.trim()
            : normalizedDom.selector,
          codeExcerpt: typeof rawSrc.codeExcerpt === 'string' ? rawSrc.codeExcerpt : '',
          relatedFiles,
        };
      } else {
        normalizedSrc = autoResolved;
      }

      normalizedAnnotations.push({
        index,
        label,
        comment,
        domTarget: normalizedDom,
        uiPanelChanges,
        computedStylesSnapshot,
        sourceMapping: normalizedSrc,
      });
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    payload: {
      schemaVersion: 1,
      batchId,
      createdAt,
      sourceAgent: typeof raw.sourceAgent === 'string' && raw.sourceAgent.trim() ? raw.sourceAgent.trim() : 'codex',
      targetAgent: typeof raw.targetAgent === 'string' && raw.targetAgent.trim() ? raw.targetAgent.trim() : 'antigravity',
      pageContext,
      globalPrompt,
      annotations: normalizedAnnotations,
    },
  };
}

function stripCodexAmbientBlocks(rawText) {
  if (typeof rawText !== 'string') return '';
  return rawText
    .replace(/<environment_context\b[^>]*>[\s\S]*?<\/environment_context>/gi, '')
    .replace(/<permissions\b[^>]*>[\s\S]*?<\/permissions[^>]*>/gi, '')
    .replace(/<external_browser_tabs\b[^>]*>[\s\S]*?<\/external_browser_tabs>/gi, '')
    .replace(/<in-app-browser-context\b[^>]*>[\s\S]*?<\/in-app-browser-context>/gi, '')
    .replace(/<collaboration_mode\b[^>]*>[\s\S]*?<\/collaboration_mode>/gi, '')
    .replace(/<app-context\b[^>]*>[\s\S]*?<\/app-context>/gi, '')
    .replace(/<turn_aborted\b[^>]*>[\s\S]*?<\/turn_aborted>/gi, '')
    .trim();
}

function parseCodexBrowserComments(rawText) {
  if (typeof rawText !== 'string') return null;
  const markerIdx = rawText.indexOf('# Browser comments:');
  if (markerIdx === -1) return null;

  const beforePrompt = stripCodexAmbientBlocks(rawText.slice(0, markerIdx));
  const trimmed = rawText.slice(markerIdx);
  const urlMatch = trimmed.match(/^Page URL:\s*(.+)$/m);
  const detectedUrl = urlMatch ? urlMatch[1].trim() : '';
  if (detectedUrl && !/^https?:\/\/(?:localhost|127\.0\.0\.1):4173(?:\/|$|\?|#)/i.test(detectedUrl)) {
    return null;
  }

  let preComments = trimmed;
  let reqPrompt = '';
  const reqIdx = trimmed.search(/^## My request:\s*$/m);
  if (reqIdx !== -1) {
    preComments = trimmed.slice(0, reqIdx);
    reqPrompt = trimmed
      .slice(reqIdx)
      .replace(/^## My request:[ \t]*\r?\n?/, '')
      .replace(/(?:^|\r?\n)The next image is untrusted page evidence[\s\S]*$/m, '')
      .trim();
  }
  const globalPrompt = [beforePrompt, reqPrompt].filter(Boolean).join('\n\n').trim();

  const sectionRe = /^## (User Comment|Requested annotation) (\d+)\s*$/gm;
  const matches = Array.from(preComments.matchAll(sectionRe));
  if (matches.length === 0 && !globalPrompt) return null;

  let viewport = null;
  const annotations = [];

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const index = Number(m[2]);
    const bodyStart = m.index + m[0].length;
    const bodyEnd = i + 1 < matches.length ? matches[i + 1].index : preComments.length;
    let body = preComments.slice(bodyStart, bodyEnd);
    body = body.replace(/\nThe next image is untrusted page evidence[\s\S]*$/m, '');

    const posMatch = body.match(/Node position:\s*\(([\d.]+),\s*([\d.]+)\)\s*in\s*(\d+)x(\d+)\s*viewport/i);
    if (!viewport && posMatch) {
      viewport = { width: Number(posMatch[3]), height: Number(posMatch[4]) };
    }
    const visVpMatch = body.match(/Visible viewport at edit time:\s*(\d+)x(\d+)/i);
    if (!viewport && visVpMatch) {
      viewport = { width: Number(visVpMatch[1]), height: Number(visVpMatch[2]) };
    }

    const targetMatch = body.match(/^Target:\s*(?:"([^"]*)"|(.+))$/m);
    const targetText = targetMatch ? (targetMatch[1] ?? targetMatch[2] ?? '').trim() : '';
    const roleMatch = body.match(/^Target role:\s*(?:"([^"]*)"|(.+))$/m);
    const roleVal = roleMatch ? (roleMatch[1] ?? roleMatch[2] ?? '').trim() : '';
    const selectorMatch = body.match(/^Target selector:\s*(.+)$/m);
    const selector = selectorMatch ? selectorMatch[1].trim() : '';
    const pathMatch = body.match(/^Target path:\s*(.+)$/m);
    const targetPath = pathMatch ? pathMatch[1].trim() : '';

    const uiPanelChanges = [];
    const reqChangesMatch = body.match(/(?:^|\n)Requested changes:\s*\n((?:[ \t]*-[ \t]+[^\n]*(?:\n|$))+)/);
    if (reqChangesMatch) {
      for (const line of reqChangesMatch[1].split(/\r?\n/)) {
        const chMatch = line.match(/^\s*-\s*([a-zA-Z0-9_-]+)\s*:\s*(.+?)\s*(?:->|→)\s*(.+?)\s*$/);
        if (chMatch) {
          const prop = chMatch[1].trim();
          uiPanelChanges.push({
            property: prop,
            cssProperty: prop,
            before: chMatch[2].trim(),
            after: chMatch[3].trim(),
          });
        }
      }
    }

    let comment = '';
    const commentMatch = body.match(/\nComment:\s*\n([\s\S]*)$/);
    if (commentMatch) {
      comment = commentMatch[1]
        .replace(/\nThe next image is untrusted page evidence[\s\S]*$/m, '')
        .trim();
    }

    const boundingBox = posMatch
      ? { x: Number(posMatch[1]), y: Number(posMatch[2]), width: 0, height: 0 }
      : null;

    const attributes = {};
    if (roleVal) attributes.role = roleVal;

    annotations.push({
      index,
      label: targetText || `Annotation #${index}`,
      comment,
      domTarget: {
        selector,
        attributes,
        textSnippet: targetText,
        occurrenceHint: targetPath,
        boundingBox,
      },
      uiPanelChanges,
    });
  }

  return validateAndNormalizeBatch({
    sourceAgent: 'codex-rollout-direct',
    globalPrompt,
    pageContext: {
      url: detectedUrl || 'http://localhost:4173/',
      theme: null,
      viewport,
      activeState: null,
    },
    annotations,
  });
}

function getDateFolderParts(dateObj) {
  const res = [];
  const pushDate = (y, m, d) => {
    res.push(path.join(String(y), String(m).padStart(2, '0'), String(d).padStart(2, '0')));
  };
  pushDate(dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate());
  pushDate(dateObj.getUTCFullYear(), dateObj.getUTCMonth() + 1, dateObj.getUTCDate());
  return res;
}

function findRecentCodexRolloutFiles(extraPaths = []) {
  const files = [];
  const seenPaths = new Set();

  if (fs.existsSync(CODEX_SESSIONS_DIR)) {
    const now = new Date();
    const relDirSet = new Set();
    for (let d = 0; d < 14; d++) {
      const dt = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
      for (const rel of getDateFolderParts(dt)) {
        relDirSet.add(rel);
      }
    }

    for (const rel of relDirSet) {
      const dirPath = path.join(CODEX_SESSIONS_DIR, rel);
      if (!fs.existsSync(dirPath)) continue;
      let entries;
      try {
        entries = fs.readdirSync(dirPath);
      } catch {
        continue;
      }
      for (const name of entries) {
        if (!name.endsWith('.jsonl')) continue;
        const fullPath = path.join(dirPath, name);
        if (seenPaths.has(fullPath)) continue;
        try {
          const st = fs.statSync(fullPath);
          if (st.isFile()) {
            seenPaths.add(fullPath);
            files.push({ fullPath, size: st.size, mtimeMs: st.mtimeMs });
          }
        } catch {
          // Ignore transient stat error
        }
      }
    }
  }

  if (Array.isArray(extraPaths)) {
    for (const fp of extraPaths) {
      if (typeof fp !== 'string' || !fp || seenPaths.has(fp) || !fs.existsSync(fp)) continue;
      try {
        const st = fs.statSync(fp);
        if (st.isFile()) {
          seenPaths.add(fp);
          files.push({ fullPath: fp, size: st.size, mtimeMs: st.mtimeMs });
        }
      } catch {
        // Ignore transient stat error
      }
    }
  }

  files.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return files;
}

function scanCodexRollouts({ seedOnly = false, dryRun = false } = {}) {
  ensureBridgeDirs();
  const cursor = readJsonIfExists(CODEX_CURSOR_FILE) || { seenHashes: [], fileStates: {} };
  const seenList = Array.isArray(cursor.seenHashes) ? [...cursor.seenHashes] : [];
  const seenSet = new Set(seenList);
  const fileStates = (cursor.fileStates && typeof cursor.fileStates === 'object') ? { ...cursor.fileStates } : {};

  const files = findRecentCodexRolloutFiles(Object.keys(fileStates));
  const results = [];
  let cursorDirty = false;

  for (const f of files) {
    const prev = fileStates[f.fullPath];
    if (!dryRun && !seedOnly && prev && prev.size === f.size && prev.mtimeMs === f.mtimeMs) {
      continue;
    }

    let content;
    try {
      content = fs.readFileSync(f.fullPath, 'utf8');
    } catch {
      continue;
    }

    const lines = content.split(/\r?\n/);
    let sessionCwd = '';
    for (const metaLine of lines) {
      if (!metaLine) continue;
      if (!metaLine.includes('session_meta')) break;
      try {
        const metaRow = JSON.parse(metaLine);
        if (metaRow?.type === 'session_meta') {
          sessionCwd = String(metaRow?.payload?.cwd || '');
        }
      } catch {
        // Ignore malformed session_meta line
      }
      break;
    }

    if (/duolingo/i.test(sessionCwd)) {
      if (!dryRun) {
        fileStates[f.fullPath] = { size: f.size, mtimeMs: f.mtimeMs };
        cursorDirty = true;
      }
      continue;
    }

    const isTarget4173Url = (u) => /^https?:\/\/(?:localhost|127\.0\.0\.1):4173(?:\/|$|\?|#)/i.test(String(u || ''))
      && !/rms2-admin-mockup-v2\.html/i.test(String(u || ''));
    const isWorkspaceSession = Boolean(sessionCwd) && path.resolve(sessionCwd) === WORKSPACE_ROOT;
    let lastCurrentUrl = '';

    for (const line of lines) {
      if (!line || !line.includes('response_item') || !line.includes('user')) continue;
      let row;
      try {
        row = JSON.parse(line);
      } catch {
        continue;
      }
      if (row?.type !== 'response_item' || row?.payload?.role !== 'user') continue;
      const items = Array.isArray(row.payload.content) ? row.payload.content : [];
      const texts = items
        .filter((c) => c && c.type === 'input_text' && typeof c.text === 'string')
        .map((c) => c.text)
        .join('\n');
      if (!texts.trim()) continue;

      const currentUrlMatch = texts.match(/-\s*Current URL:\s*(https?:\/\/[^\s<]+)/i);
      if (currentUrlMatch) {
        lastCurrentUrl = currentUrlMatch[1].trim();
      }

      const idx = texts.indexOf('# Browser comments:');
      let hash;
      let parsed;

      if (idx !== -1) {
        const beforeText = stripCodexAmbientBlocks(texts.slice(0, idx));
        const commentSection = texts.slice(idx).trim();
        const pageUrlMatch = commentSection.match(/^Page URL:\s*(https?:\/\/[^\s<]+)/im);
        if (pageUrlMatch && !isTarget4173Url(pageUrlMatch[1].trim())) continue;
        const normalizedBlock = beforeText ? `${beforeText}\n\n${commentSection}` : commentSection;
        hash = crypto.createHash('sha256').update(normalizedBlock).digest('hex');
        if (!dryRun && seenSet.has(hash)) continue;
        parsed = parseCodexBrowserComments(normalizedBlock);
      } else {
        const allowChat = isTarget4173Url(lastCurrentUrl)
          || (isWorkspaceSession && (!lastCurrentUrl || isTarget4173Url(lastCurrentUrl)));
        if (!allowChat) continue;
        const cleanedChat = stripCodexAmbientBlocks(texts);
        if (!cleanedChat) continue;
        if (/Read-Only DOM\/UI Inspector|Chỉ trả lời đúng chữ|Thay vì rep\s+["“]/i.test(cleanedChat)) {
          continue;
        }
        hash = crypto.createHash('sha256').update(`chat:${cleanedChat}`).digest('hex');
        if (!dryRun && seenSet.has(hash)) continue;
        parsed = validateAndNormalizeBatch({
          sourceAgent: 'codex-rollout-chat',
          globalPrompt: cleanedChat,
          pageContext: {
            url: isTarget4173Url(lastCurrentUrl) ? lastCurrentUrl : 'http://localhost:4173/',
            theme: null,
            viewport: null,
            activeState: null,
          },
          annotations: [],
        });
      }

      if (!parsed || !parsed.ok) continue;

      if (dryRun) {
        results.push({
          file: f.fullPath,
          hash,
          batchId: parsed.payload.batchId,
          annotationCount: parsed.payload.annotations.length,
          uiChangesCount: parsed.payload.annotations.reduce((acc, a) => acc + (a.uiPanelChanges?.length || 0), 0),
          payload: parsed.payload,
        });
        continue;
      }

      seenSet.add(hash);
      seenList.push(hash);
      cursorDirty = true;

      if (!seedOnly) {
        const inboxPath = path.join(DIRS.inbox, `${parsed.payload.batchId}.json`);
        atomicWriteJson(inboxPath, parsed.payload);
        results.push({
          file: f.fullPath,
          hash,
          batchId: parsed.payload.batchId,
          annotationCount: parsed.payload.annotations.length,
        });
      }
    }

    if (!dryRun) {
      fileStates[f.fullPath] = { size: f.size, mtimeMs: f.mtimeMs };
      cursorDirty = true;
    }
  }

  if (!dryRun && (cursorDirty || !fs.existsSync(CODEX_CURSOR_FILE))) {
    atomicWriteJson(CODEX_CURSOR_FILE, {
      seenHashes: seenList.slice(-500),
      fileStates,
      updatedAt: new Date().toISOString(),
    });
  }

  return results;
}

function getListenerStatus() {
  const info = readJsonIfExists(LISTENER_FILE);
  if (!info || !Number.isInteger(info.pid)) {
    return { alive: false, pid: null, startedAt: null, httpPort: null };
  }
  const alive = isPidAlive(info.pid);
  return {
    alive,
    pid: info.pid,
    startedAt: info.startedAt ?? null,
    httpPort: info.httpPort ?? null,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sendViaHttpFallback(payloadJsonString, host = BRIDGE_HTTP_HOST, port = BRIDGE_HTTP_PORT) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host,
        port,
        path: '/batch',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(payloadJsonString, 'utf8'),
        },
        timeout: 3000,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk.toString(); });
        res.on('end', () => {
          resolve({ statusCode: res.statusCode ?? 0, body });
        });
      }
    );
    req.on('timeout', () => {
      req.destroy(new Error('HTTP fallback timed out'));
    });
    req.on('error', reject);
    req.write(payloadJsonString, 'utf8');
    req.end();
  });
}

async function cmdSend(argv) {
  const { flags } = parseFlags(argv);
  const waitConfirm = Boolean(flags['wait-confirm']);
  const waitMsRaw = flags['wait-ms'] !== undefined ? Number(flags['wait-ms']) : 1500;
  const waitMs = Number.isFinite(waitMsRaw) && waitMsRaw >= 0 ? waitMsRaw : 1500;

  let rawInput = '';
  try {
    if (typeof flags.file === 'string' && flags.file.trim()) {
      const targetFile = path.resolve(process.cwd(), flags.file.trim());
      rawInput = fs.readFileSync(targetFile, 'utf8');
    } else {
      rawInput = fs.readFileSync(0, 'utf8');
    }
  } catch (err) {
    console.error(`Error reading payload input: ${err.message}`);
    process.exit(1);
  }

  if (!rawInput.trim()) {
    console.error('Error: empty JSON payload on stdin/--file');
    process.exit(1);
  }

  let parsed;
  try {
    parsed = JSON.parse(rawInput);
  } catch (err) {
    console.error(`Error parsing JSON payload: ${err.message}`);
    process.exit(1);
  }

  const validation = validateAndNormalizeBatch(parsed);
  if (!validation.ok) {
    console.error('Payload validation failed:');
    for (const err of validation.errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  const payload = validation.payload;
  const serialized = `${JSON.stringify(payload, null, 2)}\n`;

  try {
    ensureBridgeDirs();
    const listenerStatus = getListenerStatus();
    const listenerWasAlive = listenerStatus.alive;

    const tmpPath = path.join(DIRS.tmp, `${payload.batchId}.tmp`);
    const inboxPath = path.join(DIRS.inbox, `${payload.batchId}.json`);
    const ackPath = path.join(DIRS.ack, `${payload.batchId}.json`);

    fs.writeFileSync(tmpPath, serialized, 'utf8');
    fs.renameSync(tmpPath, inboxPath);

    const started = Date.now();
    let latestAck = null;

    while (Date.now() - started <= waitMs) {
      latestAck = readJsonIfExists(ackPath);
      if (latestAck) {
        if (latestAck.stage === 'confirmed_by_antigravity' || latestAck.stage === 'completed') {
          console.log(JSON.stringify({
            ok: true,
            status: waitConfirm ? 'CONFIRMED_BY_ANTIGRAVITY' : 'DELIVERED_TO_ANTIGRAVITY',
            batchId: payload.batchId,
            annotationCount: payload.annotations.length,
            ack: latestAck,
          }, null, 2));
          process.exit(0);
        }
        if (!waitConfirm && latestAck.stage === 'delivered_to_watcher') {
          console.log(JSON.stringify({
            ok: true,
            status: 'DELIVERED_TO_ANTIGRAVITY',
            batchId: payload.batchId,
            annotationCount: payload.annotations.length,
            ack: latestAck,
          }, null, 2));
          process.exit(0);
        }
      }

      if (!listenerWasAlive && Date.now() - started >= 350 && !latestAck) {
        console.log(JSON.stringify({
          ok: true,
          status: 'QUEUED_WAITING_FOR_LISTENER',
          batchId: payload.batchId,
          annotationCount: payload.annotations.length,
          inboxFile: path.relative(WORKSPACE_ROOT, inboxPath),
          note: 'Antigravity listener is not currently attached; batch is queued safely in inbox.',
        }, null, 2));
        process.exit(0);
      }

      await sleep(75);
    }

    latestAck = readJsonIfExists(ackPath);
    if (latestAck && (latestAck.stage === 'confirmed_by_antigravity' || latestAck.stage === 'completed')) {
      console.log(JSON.stringify({
        ok: true,
        status: waitConfirm ? 'CONFIRMED_BY_ANTIGRAVITY' : 'DELIVERED_TO_ANTIGRAVITY',
        batchId: payload.batchId,
        annotationCount: payload.annotations.length,
        ack: latestAck,
      }, null, 2));
      process.exit(0);
    }

    if (latestAck && latestAck.stage === 'delivered_to_watcher') {
      console.log(JSON.stringify({
        ok: true,
        status: 'DELIVERED_TO_ANTIGRAVITY',
        batchId: payload.batchId,
        annotationCount: payload.annotations.length,
        ack: latestAck,
      }, null, 2));
      process.exit(0);
    }

    console.log(JSON.stringify({
      ok: true,
      status: 'QUEUED_WAITING_FOR_LISTENER',
      batchId: payload.batchId,
      annotationCount: payload.annotations.length,
      inboxFile: path.relative(WORKSPACE_ROOT, inboxPath),
    }, null, 2));
    process.exit(0);
  } catch (err) {
    if (err?.code === 'EPERM' || err?.code === 'EACCES' || err?.code === 'EROFS') {
      try {
        const res = await sendViaHttpFallback(serialized);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(res.body.trim());
          process.exit(0);
        }
        console.error(`HTTP bridge fallback failed (${res.statusCode}): ${res.body}`);
        process.exit(1);
      } catch (httpErr) {
        console.error(`Sandbox write blocked (${err.code}) and HTTP fallback failed: ${httpErr.message}`);
        process.exit(1);
      }
    }
    throw err;
  }
}

async function cmdListenOnce(argv) {
  const { flags } = parseFlags(argv);
  const replace = Boolean(flags.replace);
  const codexWatch = !flags['no-codex-watch'];
  const timeoutMsRaw = flags['timeout-ms'] !== undefined ? Number(flags['timeout-ms']) : null;
  const timeoutMs = timeoutMsRaw !== null && Number.isFinite(timeoutMsRaw) && timeoutMsRaw > 0
    ? timeoutMsRaw
    : null;

  ensureBridgeDirs();

  if (codexWatch) {
    if (!fs.existsSync(CODEX_CURSOR_FILE)) {
      scanCodexRollouts({ seedOnly: true });
    } else {
      scanCodexRollouts();
    }
  }

  const existing = getListenerStatus();
  if (existing.alive && existing.pid !== process.pid) {
    if (!replace) {
      console.log(`ALREADY_LISTENING pid=${existing.pid}`);
      process.exit(0);
    }
    try {
      process.kill(existing.pid, 'SIGTERM');
    } catch {
      // Ignore if unable to signal
    }
  }

  let finished = false;
  let inFlightHttpCount = 0;
  let watcher = null;
  let pollTimer = null;
  let timeoutTimer = null;
  let httpServer = null;
  let boundHttpPort = null;

  const removeOwnListenerFile = () => {
    const cur = readJsonIfExists(LISTENER_FILE);
    if (cur && cur.pid === process.pid) {
      try {
        fs.unlinkSync(LISTENER_FILE);
      } catch {
        // Ignore cleanup failure
      }
    }
  };

  const cleanupTimersAndWatchers = () => {
    if (watcher) {
      try {
        watcher.close();
      } catch {
        // Ignore
      }
      watcher = null;
    }
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
      timeoutTimer = null;
    }
    if (httpServer) {
      try {
        httpServer.close();
      } catch {
        // Ignore
      }
      httpServer = null;
    }
  };

  const tryConsumeOldestInbox = () => {
    if (finished || inFlightHttpCount > 0) return false;
    let files;
    try {
      files = fs.readdirSync(DIRS.inbox)
        .filter((f) => f.endsWith('.json') && !f.startsWith('.'))
        .sort();
    } catch {
      return false;
    }
    if (files.length === 0) return false;

    const targetName = files[0];
    const inboxPath = path.join(DIRS.inbox, targetName);
    const activePath = path.join(DIRS.active, targetName);

    try {
      fs.renameSync(inboxPath, activePath);
    } catch {
      return false;
    }

    let payload;
    try {
      payload = JSON.parse(fs.readFileSync(activePath, 'utf8'));
    } catch (err) {
      console.error(`Failed to parse active batch ${targetName}: ${err.message}`);
      return false;
    }

    finished = true;
    cleanupTimersAndWatchers();
    removeOwnListenerFile();

    const batchId = payload.batchId || path.basename(targetName, '.json');
    const ackPath = path.join(DIRS.ack, `${batchId}.json`);
    const existingAck = readJsonIfExists(ackPath) || {};
    atomicWriteJson(ackPath, {
      ...existingAck,
      batchId,
      stage: 'delivered_to_watcher',
      watcherPid: process.pid,
      deliveredAt: new Date().toISOString(),
    });

    const lines = [
      `CODEX_BRIDGE_WAKEUP batchId=${batchId} annotations=${payload.annotations?.length ?? 0}`,
      '',
      'Antigravity Execution Checklist:',
      `1. Immediately confirm receipt to Codex: node scripts/codex-bridge.mjs ack ${batchId} --message "Antigravity da nhan batch va dang xu ly"`,
      '2. Send a concise Vietnamese confirmation to the user in chat.',
      '3. Apply every annotation in exact index order (#1..#N) using domTarget + uiPanelChanges + sourceMapping, translating raw values to canonical OpenAI Design System tokens (docs/design-system/tokens.json, vanilla/base.css, .ds-* classes, 400 font-weight rules).',
      '4. Verify edits: npm run tokens:build && npm run tokens:check && npm run build:vanilla && npm run ds:check',
      `5. Mark complete & immediately re-arm listener: node scripts/codex-bridge.mjs complete ${batchId} --summary "..." && re-arm listen-once (IsDaemon: false)`,
      '',
      '=== PAYLOAD START ===',
      JSON.stringify(payload, null, 2),
      '=== PAYLOAD END ===',
    ];
    console.log(lines.join('\n'));
    process.exit(0);
  };

  // Immediate check before binding server or sleeping on watcher
  if (tryConsumeOldestInbox()) return;

  // Bind lightweight HTTP fallback server on 127.0.0.1:4174 (ignore EADDRINUSE gracefully)
  boundHttpPort = await new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      if (req.method === 'GET' && (req.url === '/health' || req.url === '/status')) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ ok: true, watcherPid: process.pid, port: BRIDGE_HTTP_PORT }));
        return;
      }
      if (req.method === 'POST' && req.url === '/batch') {
        inFlightHttpCount += 1;
        let body = '';
        let tooLarge = false;
        req.on('data', (chunk) => {
          if (tooLarge) return;
          body += chunk.toString();
          if (body.length > 5 * 1024 * 1024) {
            tooLarge = true;
            res.statusCode = 413;
            res.end(JSON.stringify({ ok: false, error: 'Payload too large' }));
          }
        });
        req.on('end', () => {
          if (tooLarge) {
            inFlightHttpCount = Math.max(0, inFlightHttpCount - 1);
            return;
          }
          let parsed;
          try {
            parsed = JSON.parse(body);
          } catch (err) {
            inFlightHttpCount = Math.max(0, inFlightHttpCount - 1);
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ ok: false, error: `Invalid JSON: ${err.message}` }));
            return;
          }
          const validation = validateAndNormalizeBatch(parsed);
          if (!validation.ok) {
            inFlightHttpCount = Math.max(0, inFlightHttpCount - 1);
            res.statusCode = 422;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ ok: false, errors: validation.errors }));
            return;
          }

          const payload = validation.payload;
          const inboxPath = path.join(DIRS.inbox, `${payload.batchId}.json`);
          atomicWriteJson(inboxPath, payload);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.on('finish', () => {
            inFlightHttpCount = Math.max(0, inFlightHttpCount - 1);
            tryConsumeOldestInbox();
          });
          res.end(JSON.stringify({
            ok: true,
            status: 'DELIVERED_TO_ANTIGRAVITY',
            batchId: payload.batchId,
            annotationCount: payload.annotations.length,
            watcherPid: process.pid,
          }, null, 2));
        });
        req.on('close', () => {
          if (inFlightHttpCount > 0) {
            inFlightHttpCount = Math.max(0, inFlightHttpCount - 1);
          }
        });
        return;
      }
      res.statusCode = 404;
      res.end('Not found');
    });

    server.on('error', () => {
      resolve(null);
    });
    server.listen(BRIDGE_HTTP_PORT, BRIDGE_HTTP_HOST, () => {
      httpServer = server;
      resolve(BRIDGE_HTTP_PORT);
    });
  });

  atomicWriteJson(LISTENER_FILE, {
    pid: process.pid,
    startedAt: new Date().toISOString(),
    httpPort: boundHttpPort,
  });

  const handleSignal = () => {
    cleanupTimersAndWatchers();
    removeOwnListenerFile();
    process.exit(0);
  };
  process.on('SIGINT', handleSignal);
  process.on('SIGTERM', handleSignal);
  process.on('exit', removeOwnListenerFile);

  try {
    watcher = fs.watch(DIRS.inbox, () => {
      tryConsumeOldestInbox();
    });
    watcher.on('error', () => {
      // Polling interval remains active as fallback
    });
  } catch {
    // Polling interval handles detection
  }

  let pollTicks = 0;
  pollTimer = setInterval(() => {
    pollTicks += 1;
    if (codexWatch && pollTicks % 2 === 0 && !finished) {
      scanCodexRollouts();
    }
    tryConsumeOldestInbox();
  }, 150);
  tryConsumeOldestInbox();

  if (timeoutMs !== null) {
    timeoutTimer = setTimeout(() => {
      cleanupTimersAndWatchers();
      removeOwnListenerFile();
      console.error('LISTEN_TIMEOUT');
      process.exit(124);
    }, timeoutMs);
  }
}

function cmdAck(argv) {
  const { positionals, flags } = parseFlags(argv);
  const batchId = positionals[0];
  if (!batchId) {
    console.error('Usage: node scripts/codex-bridge.mjs ack <batchId> [--message "..."]');
    process.exit(1);
  }

  ensureBridgeDirs();
  const ackPath = path.join(DIRS.ack, `${batchId}.json`);
  const existing = readJsonIfExists(ackPath) || {};
  const message = typeof flags.message === 'string' && flags.message.trim()
    ? flags.message.trim()
    : 'Antigravity received batch and is executing edits';

  atomicWriteJson(ackPath, {
    ...existing,
    batchId,
    stage: 'confirmed_by_antigravity',
    confirmedAt: new Date().toISOString(),
    message,
  });

  console.log(`ACK_RECORDED ${batchId}`);
}

function cmdComplete(argv) {
  const { positionals, flags } = parseFlags(argv);
  const batchId = positionals[0];
  if (!batchId) {
    console.error('Usage: node scripts/codex-bridge.mjs complete <batchId> [--summary "..."]');
    process.exit(1);
  }

  ensureBridgeDirs();
  const activePath = path.join(DIRS.active, `${batchId}.json`);
  const historyPath = path.join(DIRS.history, `${batchId}.json`);
  if (fs.existsSync(activePath)) {
    fs.renameSync(activePath, historyPath);
  }

  const ackPath = path.join(DIRS.ack, `${batchId}.json`);
  const existing = readJsonIfExists(ackPath) || {};
  const summary = typeof flags.summary === 'string' && flags.summary.trim()
    ? flags.summary.trim()
    : 'Completed and verified';

  atomicWriteJson(ackPath, {
    ...existing,
    batchId,
    stage: 'completed',
    completedAt: new Date().toISOString(),
    summary,
  });

  console.log(`COMPLETED_RECORDED ${batchId}`);
}

function listJsonDir(dirPath, { descending = false, limit = null } = {}) {
  if (!fs.existsSync(dirPath)) return [];
  const items = fs.readdirSync(dirPath)
    .filter((f) => f.endsWith('.json') && !f.startsWith('.'))
    .sort();
  if (descending) items.reverse();
  return limit ? items.slice(0, limit) : items;
}

function cmdStatus() {
  ensureBridgeDirs();
  const listener = getListenerStatus();
  const inboxQueue = listJsonDir(DIRS.inbox);
  const activeBatches = listJsonDir(DIRS.active);
  const recentHistory = listJsonDir(DIRS.history, { descending: true, limit: 20 });

  console.log(JSON.stringify({
    listener,
    inboxQueue,
    activeBatches,
    recentHistory,
  }, null, 2));
}

function isPortListening(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host });
    const done = (result) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(500);
    socket.on('connect', () => done(true));
    socket.on('timeout', () => done(false));
    socket.on('error', () => done(false));
  });
}

async function cmdServe(argv) {
  const { flags } = parseFlags(argv);
  const portRaw = flags.port !== undefined ? Number(flags.port) : 4173;
  const port = Number.isInteger(portRaw) && portRaw > 0 && portRaw <= 65535 ? portRaw : 4173;

  if (await isPortListening(port, '127.0.0.1')) {
    console.log(`ALREADY_SERVING http://localhost:${port}/`);
    process.exit(0);
  }

  const server = http.createServer((req, res) => {
    let urlPath;
    try {
      urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    } catch {
      res.statusCode = 400;
      return res.end('Bad Request');
    }

    if (urlPath === '/__clear') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Clear-Site-Data', '"cache", "storage"');
      return res.end(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Clearing stale localhost cache...</title></head>
<body>
<script>
(async () => {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {}
  location.replace('/');
})();
</script>
</body>
</html>`);
    }

    if (urlPath === '/sw.js' || urlPath === '/service-worker.js' || urlPath === '/registerSW.js') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      return res.end(`self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) client.navigate(client.url);
  })());
});
`);
    }

    const rel = urlPath === '/' ? '/smt-ratio-prototype.html' : urlPath;
    const fp = path.resolve(WORKSPACE_ROOT, `.${rel}`);
    if (fp !== WORKSPACE_ROOT && !fp.startsWith(WORKSPACE_ROOT + path.sep)) {
      res.statusCode = 403;
      return res.end('Forbidden');
    }
    if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Clear-Site-Data', '"cache"');
      if ((req.headers.accept || '').includes('text/html')) {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      }
      res.statusCode = 404;
      return res.end('Not found');
    }
    res.setHeader('Content-Type', MIME_TYPES[path.extname(fp).toLowerCase()] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    fs.createReadStream(fp).pipe(res);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`ALREADY_SERVING http://localhost:${port}/`);
      process.exit(0);
    }
    console.error(`Server error: ${err.message}`);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`SMT Ratio Localhost Preview running at http://localhost:${port}/`);
  });
}

function spawnSelf(args, { input = null } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [__filename, ...args], {
      cwd: WORKSPACE_ROOT,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, stdout, stderr }));
    if (input !== null) {
      child.stdin.write(input);
    }
    child.stdin.end();
  });
}

async function cmdSelfTest() {
  ensureBridgeDirs();

  const existingListenerRaw = fs.existsSync(LISTENER_FILE)
    ? fs.readFileSync(LISTENER_FILE, 'utf8')
    : null;
  const existingListener = getListenerStatus();
  if (existingListener.alive) {
    console.error(`Cannot run self-test while live listener pid=${existingListener.pid} is active.`);
    process.exit(1);
  }
  if (fs.existsSync(LISTENER_FILE)) {
    fs.unlinkSync(LISTENER_FILE);
  }

  const testBatchId = `batch-selftest-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
  // Test 1 omits sourceMapping and tagName to exercise fast-path auto-resolution
  const fastPathPayload = {
    batchId: testBatchId,
    pageContext: {
      url: 'http://localhost:4173/',
      theme: 'dark',
      activeState: 'Home resource table',
    },
    annotations: [
      {
        selector: 'button.ds-button.ds-button--primary[data-action="create-case"]',
        uiPanelChanges: {
          'padding-inline': { before: '12px', after: '16px' },
        },
        comment: 'Self-test fast-path zero-sourceMapping check',
      },
    ],
  };

  try {
    const listenerChild = spawn(process.execPath, [__filename, 'listen-once', '--timeout-ms', '5000', '--no-codex-watch'], {
      cwd: WORKSPACE_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let listenerStdout = '';
    let listenerStderr = '';
    listenerChild.stdout.on('data', (d) => { listenerStdout += d.toString(); });
    listenerChild.stderr.on('data', (d) => { listenerStderr += d.toString(); });

    const listenerDone = new Promise((resolve, reject) => {
      listenerChild.on('error', reject);
      listenerChild.on('close', (code) => resolve({ code, stdout: listenerStdout, stderr: listenerStderr }));
    });

    // Wait until listenerChild finishes binding and writes listener.json (up to 3s)
    const waitReadyStart = Date.now();
    while (Date.now() - waitReadyStart < 3000) {
      const st = getListenerStatus();
      if (st.alive && st.pid === listenerChild.pid) break;
      await sleep(30);
    }

    const sendStarted = Date.now();
    const sendResult = await spawnSelf(['send'], {
      input: JSON.stringify(fastPathPayload),
    });
    const sendElapsed = Date.now() - sendStarted;

    if (sendResult.code !== 0) {
      throw new Error(`send failed (code ${sendResult.code}): ${sendResult.stderr}`);
    }
    const sendJson = JSON.parse(sendResult.stdout);
    if (sendJson.status !== 'DELIVERED_TO_ANTIGRAVITY') {
      throw new Error(`Expected send status DELIVERED_TO_ANTIGRAVITY, got ${sendJson.status}`);
    }
    if (sendElapsed >= 1500) {
      throw new Error(`Expected fast-path send < 1500ms, took ${sendElapsed}ms`);
    }

    const listenerResult = await listenerDone;
    if (listenerResult.code !== 0) {
      throw new Error(`listen-once failed (code ${listenerResult.code}): ${listenerResult.stderr || listenerResult.stdout}`);
    }
    const payloadStartMarker = '=== PAYLOAD START ===';
    const payloadEndMarker = '=== PAYLOAD END ===';
    const startIdx = listenerResult.stdout.indexOf(payloadStartMarker);
    const endIdx = listenerResult.stdout.indexOf(payloadEndMarker);
    if (startIdx === -1 || endIdx === -1) {
      throw new Error('listen-once stdout missing expected payload markers');
    }
    const deliveredPayload = JSON.parse(
      listenerResult.stdout.slice(startIdx + payloadStartMarker.length, endIdx).trim()
    );
    const resolvedSrc = deliveredPayload.annotations?.[0]?.sourceMapping;
    if (
      resolvedSrc?.primaryFile !== 'smt-ratio-prototype.html' ||
      !Number.isInteger(resolvedSrc?.lineStart) ||
      resolvedSrc.lineStart < 1 ||
      !String(resolvedSrc?.codeExcerpt || '').includes('create-case')
    ) {
      throw new Error(
        `Expected auto-resolved smt-ratio-prototype.html create-case line, got ${resolvedSrc?.primaryFile}:${resolvedSrc?.lineStart}`
      );
    }

    // Test 2: ack & complete round-trip
    const ackResult = await spawnSelf(['ack', testBatchId, '--message', 'Self-test ACK']);
    if (ackResult.code !== 0) {
      throw new Error(`ack failed: ${ackResult.stderr}`);
    }

    const completeResult = await spawnSelf(['complete', testBatchId, '--summary', 'Self-test complete']);
    if (completeResult.code !== 0) {
      throw new Error(`complete failed: ${completeResult.stderr}`);
    }

    const finalAck = readJsonIfExists(path.join(DIRS.ack, `${testBatchId}.json`));
    if (finalAck?.stage !== 'completed') {
      throw new Error(`Expected final ack stage 'completed', got ${finalAck?.stage}`);
    }

    console.log('SELF_TEST_OK');
  } finally {
    const cleanupPaths = [
      path.join(DIRS.inbox, `${testBatchId}.json`),
      path.join(DIRS.active, `${testBatchId}.json`),
      path.join(DIRS.ack, `${testBatchId}.json`),
      path.join(DIRS.history, `${testBatchId}.json`),
    ];
    for (const fp of cleanupPaths) {
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    if (existingListenerRaw !== null) {
      fs.writeFileSync(LISTENER_FILE, existingListenerRaw, 'utf8');
    } else if (fs.existsSync(LISTENER_FILE)) {
      fs.unlinkSync(LISTENER_FILE);
    }
  }
}

function cmdSyncCodex(argv) {
  const { flags } = parseFlags(argv);
  const dryRun = Boolean(flags['dry-run']);
  const seedOnly = Boolean(flags.seed);
  const items = scanCodexRollouts({ seedOnly, dryRun });
  if (dryRun) {
    const summary = items.map((item) => ({
      file: path.basename(item.file),
      batchId: item.batchId,
      annotations: item.annotationCount,
      uiPanelChanges: item.uiChangesCount,
      changedIndices: item.payload.annotations
        .filter((a) => (a.uiPanelChanges?.length || 0) > 0)
        .map((a) => ({ index: a.index, changes: a.uiPanelChanges })),
    }));
    console.log(JSON.stringify({ mode: 'dry-run', matched: summary.length, batches: summary }, null, 2));
    return;
  }
  if (seedOnly) {
    console.log('CODEX_CURSOR_SEEDED');
    return;
  }
  console.log(JSON.stringify({ mode: 'sync', enqueued: items.length, batches: items }, null, 2));
}

function printHelp() {
  console.log([
    'Codex <-> Antigravity Annotation Bridge (Fast-Path)',
    '',
    'Commands:',
    '  send [--file <path>] [--wait-ms 1500] [--wait-confirm]  Validate, auto-resolve source lines, queue batch, return on delivery',
    '  listen-once [--timeout-ms <ms>] [--replace] [--no-codex-watch]  Wait for next batch (FS + HTTP :4174 + Codex rollout), emit payload, exit 0',
    '  sync-codex [--dry-run] [--seed]                         Pull new browser comments directly from ~/.codex/sessions',
    '  ack <batchId> [--message "..."]                         Record Antigravity receipt confirmation',
    '  complete <batchId> [--summary "..."]                    Archive active batch to history and mark completed',
    '  status                                                  Inspect listener health and queue state',
    '  serve [--port 4173]                                     Serve workspace root if port is not already listening',
    '  self-test                                               Run fast-path auto-resolve & handshake verification',
  ].join('\n'));
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  switch (command) {
    case 'send':
      await cmdSend(rest);
      break;
    case 'listen-once':
      await cmdListenOnce(rest);
      break;
    case 'sync-codex':
      cmdSyncCodex(rest);
      break;
    case 'ack':
      cmdAck(rest);
      break;
    case 'complete':
      cmdComplete(rest);
      break;
    case 'status':
      cmdStatus();
      break;
    case 'serve':
      await cmdServe(rest);
      break;
    case 'self-test':
      await cmdSelfTest();
      break;
    case '--help':
    case '-h':
    case undefined:
      printHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err?.stack || err?.message || String(err));
  process.exit(1);
});
