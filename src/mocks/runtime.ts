import { chatScenarios, type ChatScenario } from './chat-scenarios';

export class MockRunError extends Error {
  constructor(public code:'offline'|'quota'|'error'|'stopped', message:string) { super(message); }
}

export async function* mockRun(text:string, scenarioId='short', signal?:AbortSignal) {
  const scenario:ChatScenario = chatScenarios.find(item=>item.id===scenarioId)??chatScenarios[0];
  if (scenario.kind==='offline') throw new MockRunError('offline','The network connection is unavailable.');
  if (scenario.kind==='quota') throw new MockRunError('quota','Your project has reached its current quota.');
  const response=`${scenario.response}\n\nEcho: ${text}`;
  let content='';
  for (const [index,char] of [...response].entries()) {
    await new Promise(resolve=>setTimeout(resolve,scenario.delayMs??12));
    if (signal?.aborted) throw new MockRunError('stopped','The user stopped the stream.');
    if (scenario.kind==='error'&&index>28) throw new MockRunError('error','The stream stopped. Retry to continue.');
    content+=char;
    yield { content, scenario };
  }
}
