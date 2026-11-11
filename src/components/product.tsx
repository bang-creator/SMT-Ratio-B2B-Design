import type { ReactNode } from 'react';
import { Badge, Button, Card, Select, Table } from './ds';

export function SectionHeading({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="ds-section-heading"><div><h2>{title}</h2>{description && <p className="ds-muted">{description}</p>}</div>{action}</div>;
}

export function MetricCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone?: 'neutral' | 'positive' }) {
  return <Card><p className="ds-metric__label">{label}</p><p className={`ds-metric__value ds-metric__value--${tone ?? 'neutral'}`}>{value}</p><p className="ds-metric__detail">{detail}</p></Card>;
}

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="ds-filter-bar" role="group" aria-label="Filters">{children}</div>;
}

export function Filter({ label, children }: { label: string; children: ReactNode }) {
  return <label className="ds-filter"><span>{label}</span>{children}</label>;
}

export function ChartCard({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <Card><SectionHeading title={title} action={action}/>{children}</Card>;
}

export function BarChart({ values }: { values: Array<{ label: string; value: string; size: 'low' | 'medium' | 'high' }> }) {
  return <div className="ds-bar-chart" role="img" aria-label="Usage chart">{values.map(item => <div className="ds-bar-chart__row" key={item.label}><span>{item.label}</span><div className="ds-bar-chart__track"><span className={`ds-bar-chart__bar ds-bar-chart__bar--${item.size}`}/></div><strong>{item.value}</strong></div>)}</div>;
}

export function DataTable({ headers, rows }: { headers: string[]; rows: Array<Array<ReactNode>> }) {
  return <div className="ds-table-wrap"><Table><thead><tr>{headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></Table></div>;
}

export function CompactSelect({ label, options, value }: { label: string; options: string[]; value: string }) {
  return <Filter label={label}><Select aria-label={label} defaultValue={value}>{options.map(option => <option key={option} value={option}>{option}</option>)}</Select></Filter>;
}

export function StatusBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'positive' }) {
  return <Badge><span className={`ds-status-dot ds-status-dot--${tone}`} aria-hidden="true"/>{children}</Badge>;
}

export function CodePreview({ title, children }: { title: string; children: ReactNode }) {
  return <Card title={title}><pre className="ds-code"><code>{children}</code></pre><div className="ds-row ds-code__actions"><Button variant="ghost">Copy</Button><Button variant="ghost">Open in editor</Button></div></Card>;
}
