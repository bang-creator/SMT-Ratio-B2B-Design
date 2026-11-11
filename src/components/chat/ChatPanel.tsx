import { useState } from 'react';
import { Alert, Button, Textarea } from '../ds';
import { chatScenarios } from '../../mocks/chat-scenarios';
import { mockRun } from '../../mocks/runtime';

type Message={role:'user'|'assistant'; content:string};
export function ChatPanel() {
 const [messages,setMessages]=useState<Message[]>([{role:'assistant',content:'Hi! How can I help?'}]);
 const [text,setText]=useState(''); const [scenario,setScenario]=useState('short'); const [running,setRunning]=useState(false);
 async function send(){const value=text.trim();if(!value||running)return;setText('');setMessages(m=>[...m,{role:'user',content:value},{role:'assistant',content:''}]);setRunning(true);try{for await(const part of mockRun(value,scenario)){setMessages(m=>{const copy=[...m];copy[copy.length-1]={role:'assistant',content:part};return copy;});}}catch{setMessages(m=>[...m,{role:'assistant',content:'The stream stopped. Retry to continue.'}]);}finally{setRunning(false);}}
 return <section className="ds-chat" aria-label="Mock chat"><div className="ds-chat__messages">{messages.map((m,i)=><div key={i} className={`ds-message ds-message--${m.role}`}>{m.content||'…'}</div>)}{running&&<span className="ds-muted">Streaming…</span>}{scenario==='error'&& !running&&<Alert tone="danger">Stream error scenario ready.</Alert>}</div><div className="ds-chat__composer"><Textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Ask anything" aria-label="Message" onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();void send();}}}/><div className="ds-stack"><select aria-label="Chat scenario" value={scenario} onChange={e=>setScenario(e.target.value)}>{chatScenarios.map(s=><option value={s.id} key={s.id}>{s.label}</option>)}</select><Button onClick={()=>void send()} disabled={running||!text.trim()}>Run</Button></div></div></section>;
}
