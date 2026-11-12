import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { Alert, Badge, Button, Card, Checkbox, CodeBlock, Combobox, CopyField, DatePicker, Dialog, Drawer, EmptyState, Field, Heading, Icon, IconButton, Input, Menu, PageHeader, Pagination, Popover, Radio, SegmentedControl, Select, Skeleton, Spinner, Switch, Table, Tabs, Text, Textarea, Toast, Tooltip } from './ds';
import { BarChart, ChartCard, CodePreview, CompactSelect, DataTable, Filter, FilterBar, MetricCard, SectionHeading, StatusBadge } from './product';
import { ChatPanel } from './chat/ChatPanel';

const meta = {
  title: 'DS/Public exports',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function ExportPreview({ name, children }: { name: string; children: ReactNode }) {
  return <article className="ds-export-catalog__item"><code>{name}</code><div>{children}</div></article>;
}

export const Catalog: Story = {
  render: () => {
    const [segment, setSegment] = useState('Day');
    const [tab, setTab] = useState('Overview');
    const [page, setPage] = useState(2);
    const [dialog, setDialog] = useState(false);
    const [drawer, setDrawer] = useState(false);
    return <div className="ds-export-catalog">
      <header className="ds-page__header"><div><Heading as="h1">Public exports</Heading><Text muted>Every package export appears here. Use this page as the review surface before promoting a component change into the shared DS.</Text></div><Badge>Dark first</Badge></header>

      <section className="ds-export-catalog__group"><SectionHeading title="Foundations and actions" description="Primitive building blocks exported from src/index.ts."/><div className="ds-export-catalog__grid">
        <ExportPreview name="Button"><div className="ds-row"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button loading>Loading</Button></div></ExportPreview>
        <ExportPreview name="IconButton"><IconButton label="More actions">···</IconButton></ExportPreview>
        <ExportPreview name="Icon"><Icon label="Check">✓</Icon></ExportPreview>
        <ExportPreview name="Badge / StatusBadge"><div className="ds-row"><Badge>New</Badge><StatusBadge tone="positive">Ready</StatusBadge></div></ExportPreview>
        <ExportPreview name="Heading / Text"><div><Heading as="h3">Section heading</Heading><Text muted>Supporting text</Text></div></ExportPreview>
        <ExportPreview name="PageHeader"><PageHeader title="Page title" description="Supporting description"/></ExportPreview>
        <ExportPreview name="Card"><Card title="Card title"><Text muted>Card content</Text></Card></ExportPreview>
      </div></section>

      <section className="ds-export-catalog__group"><SectionHeading title="Form controls" description="All compact controls use the 32px platform control height."/><div className="ds-export-catalog__grid">
        <ExportPreview name="Field / Input"><Field label="Email"><Input placeholder="you@example.com"/></Field></ExportPreview>
        <ExportPreview name="Textarea"><Textarea placeholder="Write something"/></ExportPreview>
        <ExportPreview name="Select / option"><Select aria-label="Model" defaultValue="gpt-6.1-sol"><option>gpt-6.1-sol</option><option>gpt-6-luna</option></Select></ExportPreview>
        <ExportPreview name="Combobox"><Combobox aria-label="Search model" placeholder="Search model" options={['gpt-6.1-sol', 'gpt-6-luna']}/></ExportPreview>
        <ExportPreview name="DatePicker"><DatePicker aria-label="Date" defaultValue="2026-11-06"/></ExportPreview>
        <ExportPreview name="Checkbox / Radio / Switch"><div className="ds-stack"><Checkbox label="Remember me"/><Radio label="Option A" name="public-export-radio" defaultChecked/><Switch label="Enabled" defaultChecked/></div></ExportPreview>
      </div></section>

      <section className="ds-export-catalog__group"><SectionHeading title="Navigation and overlays"/><div className="ds-export-catalog__grid">
        <ExportPreview name="Tabs"><Tabs items={['Overview', 'Details']} active={tab} onChange={setTab}/></ExportPreview>
        <ExportPreview name="SegmentedControl"><SegmentedControl items={['Day', 'Week', 'Month']} active={segment} onChange={setSegment}/></ExportPreview>
        <ExportPreview name="Menu / Popover"><div className="ds-row"><Menu label="Menu"><Button variant="ghost">Rename</Button><Button variant="ghost">Duplicate</Button></Menu><Popover label="Popover"><Button variant="ghost">Details</Button></Popover></div></ExportPreview>
        <ExportPreview name="Tooltip"><Tooltip label="Token-backed tooltip"><Button variant="ghost">Hover or focus</Button></Tooltip></ExportPreview>
        <ExportPreview name="Dialog / Drawer"><div className="ds-row"><Button onClick={() => setDialog(true)}>Open dialog</Button><Button variant="secondary" onClick={() => setDrawer(true)}>Open drawer</Button></div><Dialog open={dialog} title="Review change" onClose={() => setDialog(false)}><div className="ds-stack"><Text>Promote this component update?</Text><Button onClick={() => setDialog(false)}>Continue</Button></div></Dialog><Drawer open={drawer} title="Component details" onClose={() => setDrawer(false)}><p className="ds-muted">Review the source, states, and token links here.</p></Drawer></ExportPreview>
        <ExportPreview name="Pagination"><Pagination page={page} totalPages={4} onChange={setPage}/></ExportPreview>
      </div></section>

      <section className="ds-export-catalog__group"><SectionHeading title="Feedback and states"/><div className="ds-export-catalog__grid">
        <ExportPreview name="Alert"><div className="ds-stack"><Alert>Info state</Alert><Alert tone="danger">Error state</Alert></div></ExportPreview>
        <ExportPreview name="Spinner / Skeleton"><div className="ds-stack"><Spinner/><Skeleton width="60%"/></div></ExportPreview>
        <ExportPreview name="EmptyState"><EmptyState title="No results">Try a different filter.</EmptyState></ExportPreview>
        <ExportPreview name="Toast"><Toast action={<Button variant="ghost">Undo</Button>}>Changes saved.</Toast></ExportPreview>
      </div></section>

      <section className="ds-export-catalog__group"><SectionHeading title="Data and product components"/><div className="ds-export-catalog__grid">
        <ExportPreview name="SectionHeading"><SectionHeading title="Section title" description="Supporting description"/></ExportPreview>
        <ExportPreview name="MetricCard"><MetricCard label="Requests" value="0" detail="No data in this period"/></ExportPreview>
        <ExportPreview name="ChartCard / BarChart"><ChartCard title="Activity"><BarChart values={[{ label: 'Mon', value: '0', size: 'low' }, { label: 'Tue', value: '0', size: 'medium' }]}/></ChartCard></ExportPreview>
        <ExportPreview name="FilterBar / Filter / CompactSelect"><FilterBar><Filter label="Status"><Select aria-label="Status" defaultValue="All"><option>All</option><option>Ready</option></Select></Filter><CompactSelect label="Range" value="Last 7 days" options={['Last 7 days', 'Last 30 days']}/></FilterBar></ExportPreview>
        <ExportPreview name="Table / DataTable"><DataTable headers={['Name', 'Status']} rows={[[<strong>Demo</strong>, <StatusBadge tone="positive">Ready</StatusBadge>]]}/></ExportPreview>
        <ExportPreview name="CodeBlock / CodePreview"><CodeBlock>const ready = true;</CodeBlock><CodePreview title="Request preview">{'{ "model": "gpt-6.1-sol" }'}</CodePreview></ExportPreview>
        <ExportPreview name="CopyField"><CopyField value="proj_demo_123"/></ExportPreview>
        <ExportPreview name="Table"><Table><thead><tr><th scope="col">Name</th><th scope="col">Value</th></tr></thead><tbody><tr><td>Theme</td><td>Dark</td></tr></tbody></Table></ExportPreview>
      </div></section>

      <section className="ds-export-catalog__group"><SectionHeading title="Chat layer" description="Mock interaction surface; replace runtime wiring in the consuming product."/><ExportPreview name="ChatPanel"><ChatPanel/></ExportPreview></section>
    </div>;
  },
};
