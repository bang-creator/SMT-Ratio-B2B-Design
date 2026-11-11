#!/usr/bin/env python3
import json, os, subprocess, sys, time
from pathlib import Path
from urllib.parse import urlsplit, parse_qsl

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "captures" / "pages" / "e1"
OUT.mkdir(parents=True, exist_ok=True)
REA = os.environ.get("REA_BIN", "/Users/bangworkinghub/.npm/_npx/af752b90495482d7/node_modules/.bin/rea")
CDP = os.environ.get("REA_CDP_ENDPOINT", "http://127.0.0.1:9224")
TARGET = os.environ.get("REA_TARGET_ID", "262787898F637348ED82B6830DE0C313")
PAGES = [
    ("home", "https://platform.openai.com/home"),
    ("responses", "https://platform.openai.com/chat/edit?models=gpt-6-luna"),
    ("decisions", "https://platform.openai.com/decisions"),
    ("agents-vault", "https://platform.openai.com/agents?tab=vault"),
    ("audio-realtime", "https://platform.openai.com/audio/realtime/edit"),
    ("usage", "https://platform.openai.com/usage"),
    ("images", "https://platform.openai.com/playground/images"),
]
VIEWPORTS = [(1440, 900), (1280, 800), (768, 1024), (390, 844)]
SCHEMES = ["light", "dark"]

only = set(filter(None, os.environ.get("CAPTURE_ONLY", "").split(",")))
force = os.environ.get("CAPTURE_FORCE") == "1"
wait_ms = int(os.environ.get("CAPTURE_WAIT_MS", "1800"))
for slug, url in PAGES:
    parsed = urlsplit(url)
    query = [{"name": k, "value": {"source": "literal", "value": v}} for k, v in parse_qsl(parsed.query, keep_blank_values=True)]
    base = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
    for width, height in VIEWPORTS:
        for scheme in SCHEMES:
            variant = f"{slug}__{width}x{height}__{scheme}"
            output = OUT / f"{variant}.json"
            if only and variant not in only:
                continue
            if output.exists() and output.stat().st_size > 1000 and not force:
                print(f"skip {variant}", flush=True)
                continue
            scenario = {
                "browser": {"mode": "connect", "cdp_endpoint": CDP, "target_id": TARGET},
                "start_url": {"url": base, "query": query},
                "environment": {
                    "viewport": {"width": width, "height": height, "device_scale_factor": 1},
                    "locale": "en-US",
                    "timezone": "Asia/Ho_Chi_Minh",
                    "color_scheme": scheme,
                    "reduced_motion": "no-preference",
                    "service_workers": "allow",
                },
                "actions": [{"step_id": "settle", "action": "wait_for_timeout", "duration_ms": wait_ms}],
                "capture": {"after_each_step": [], "at_end": ["screenshot", "dom", "accessibility"], "events": [], "network": {"request_body": False, "response_body": False, "header_values": False}},
                "command_timeout_ms": 60000,
            }
            request = json.dumps(scenario, ensure_ascii=False)
            started = time.time()
            proc = subprocess.run([REA, "capture-browser-scenario", request, "--format", "json"], text=True, capture_output=True)
            payload = proc.stdout if proc.stdout.strip() else proc.stderr
            output.write_text(payload, encoding="utf-8")
            status = "ok" if proc.returncode == 0 else f"error:{proc.returncode}"
            print(f"{status} {variant} {time.time()-started:.1f}s", flush=True)
            if proc.returncode != 0:
                print(proc.stderr[-2000:], file=sys.stderr)
