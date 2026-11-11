export type ChatScenario = { id:string; label:string; response:string };
export const chatScenarios:ChatScenario[] = [
 {id:'short',label:'Short answer',response:'A concise response using the platform skin.'},
 {id:'long',label:'Long markdown',response:'Here is a longer response.\n\n- First point\n- Second point\n\n```ts\nconst ready = true;\n```'},
 {id:'tool',label:'Tool card',response:'Tool completed. Result is ready for review.'},
 {id:'error',label:'Stream error',response:'The stream stopped. Retry to continue.'},
];
