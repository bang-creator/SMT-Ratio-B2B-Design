import { forwardRef, useEffect, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TableHTMLAttributes } from 'react';

export function Button({variant='primary', loading=false, children, disabled, ...props}:{variant?:'primary'|'secondary'|'ghost'; loading?:boolean; children:ReactNode} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`ds-button ds-button--${variant}`} disabled={disabled||loading} aria-busy={loading||undefined} {...props}>{loading&&<Spinner/>}{children}</button>;
}
export function IconButton({label, children, ...props}:{label:string; children:ReactNode} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className="ds-icon-button" aria-label={label} {...props}>{children}</button>;
}
export function Input({className='', ...props}:InputHTMLAttributes<HTMLInputElement>) { return <input className={`ds-input ${className}`.trim()} {...props}/>; }
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(({className='', ...props}, ref) => <textarea ref={ref} className={`ds-textarea ${className}`.trim()} {...props}/>);
Textarea.displayName = 'Textarea';
export function Select({className='', ...props}:SelectHTMLAttributes<HTMLSelectElement>) { return <select className={`ds-input ${className}`.trim()} {...props}/>; }
export function Field({label, hint, error, children}:{label:string; hint?:string; error?:string; children:ReactNode}) { return <label><span className="ds-label">{label}</span>{children}{error?<small className="ds-field-error" role="alert">{error}</small>:hint&&<small className="ds-muted">{hint}</small>}</label>; }
export function Checkbox({label, ...props}:{label:string} & InputHTMLAttributes<HTMLInputElement>) { return <label className="ds-check"><input type="checkbox" {...props}/><span>{label}</span></label>; }
export function Switch({label, ...props}:{label:string} & InputHTMLAttributes<HTMLInputElement>) { return <label className="ds-check"><input type="checkbox" role="switch" {...props}/><span>{label}</span></label>; }
export function Badge({children}:{children:ReactNode}) { return <span className="ds-badge">{children}</span>; }
export function Card({title, className='', children}:{title?:string; className?:string; children:ReactNode}) { return <section className={`ds-card ${className}`.trim()}>{title&&<h2>{title}</h2>}{children}</section>; }
export function Tabs({items, active, onChange}:{items:string[]; active:string; onChange:(item:string)=>void}) { return <div className="ds-tabs" role="tablist">{items.map(item=><button className="ds-tab" role="tab" aria-selected={item===active} key={item} onClick={()=>onChange(item)}>{item}</button>)}</div>; }
export function Alert({children, tone='info'}:{children:ReactNode; tone?:'info'|'danger'|'success'}) { return <div className={`ds-alert ds-alert--${tone}`} role={tone==='danger'?'alert':'status'}>{children}</div>; }
export function Skeleton({width='100%'}:{width?:string}) { const size=width==='40%'?'ds-skeleton--40':width==='60%'?'ds-skeleton--60':''; return <div className={`ds-skeleton ${size}`} aria-label="Loading"/>; }
export function Spinner() { return <span className="ds-spinner" role="status" aria-label="Loading"/>; }
export function EmptyState({title='Nothing here yet', children}:{title?:string; children?:ReactNode}) { return <div className="ds-empty"><strong>{title}</strong>{children&&<p>{children}</p>}</div>; }
export function Table({children, ...props}:TableHTMLAttributes<HTMLTableElement>) { return <table className="ds-table" {...props}>{children}</table>; }
export function CodeBlock({children}:{children:ReactNode}) { return <pre className="ds-code"><code>{children}</code></pre>; }
export function Tooltip({label, children}:{label:string; children:ReactNode}) { return <span className="ds-tooltip"><span tabIndex={0} aria-describedby={`tooltip-${label.replaceAll(' ','-')}`}>{children}</span><span className="ds-tooltip__content" role="tooltip" id={`tooltip-${label.replaceAll(' ','-')}`}>{label}</span></span>; }
export function Popover({label, children}:{label:string; children:ReactNode}) { const [open,setOpen]=useState(false); return <span className="ds-popover"><Button variant="secondary" aria-expanded={open} onClick={()=>setOpen(value=>!value)}>{label}</Button>{open&&<span className="ds-popover__content" role="menu" onKeyDown={event=>{if(event.key==='Escape')setOpen(false);}}>{children}</span>}</span>; }
export function Dialog({open, title, onClose, children}:{open:boolean; title:string; onClose:()=>void; children:ReactNode}) { useEffect(()=>{if(!open)return; const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose();}; document.addEventListener('keydown',onKey); return()=>document.removeEventListener('keydown',onKey);},[open,onClose]); return open&&<div className="ds-dialog__backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}><section className="ds-dialog" role="dialog" aria-modal="true" aria-labelledby="ds-dialog-title"><div className="ds-dialog__header"><h2 id="ds-dialog-title">{title}</h2><IconButton label="Close dialog" autoFocus onClick={onClose}>×</IconButton></div>{children}</section></div>; }
export function Toast({children, action}:{children:ReactNode; action?:ReactNode}) { return <div className="ds-toast" role="status"><span>{children}</span>{action}</div>; }
export function PageHeader({title, description, actions}:{title:string; description?:string; actions?:ReactNode}) { return <header className="ds-page__header"><div><h1>{title}</h1>{description&&<p>{description}</p>}</div>{actions&&<div className="ds-row">{actions}</div>}</header>; }
