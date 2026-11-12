export type ChatScenarioKind = 'text' | 'tool' | 'error' | 'offline' | 'quota' | 'attachment' | 'branch';
export type ChatScenario = { id:string; label:string; response:string; kind:ChatScenarioKind; toolName?:string; delayMs?:number };

export const chatScenarios:ChatScenario[] = [
 {id:'short',label:'Short answer',kind:'text',response:'A concise response using the platform skin.'},
 {id:'long',label:'Long markdown',kind:'text',response:'Here is a longer response.\n\n- First point\n- Second point\n\n| Model | Status |\n| --- | --- |\n| gpt-6-luna | Ready |\n| gpt-6-sol | Preview |\n\n```ts\nconst ready = true;\n```'},
 {id:'tool-running',label:'Tool running',kind:'tool',toolName:'web_search',response:'The tool is searching for a result.'},
 {id:'tool-done',label:'Tool done',kind:'tool',toolName:'web_search',response:'Tool completed. Result is ready for review.'},
 {id:'tool-error',label:'Tool error',kind:'tool',toolName:'web_search',response:'The tool could not complete the request.'},
 {id:'error',label:'Stream error',kind:'error',response:'The stream stopped. Retry to continue.'},
 {id:'stop',label:'Slow stream',kind:'text',delayMs:80,response:'This stream is intentionally slow so you can stop it and continue later.'},
 {id:'offline',label:'Offline',kind:'offline',response:'The network connection is unavailable.'},
 {id:'quota',label:'Quota exceeded',kind:'quota',response:'Your project has reached its current quota.'},
 {id:'attachment',label:'Attachment',kind:'attachment',response:'I received the attached file and can summarize it.'},
 {id:'branch',label:'Edit and branch',kind:'branch',response:'This answer can be edited into a new branch.'},
];
