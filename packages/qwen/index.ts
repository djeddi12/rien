export type QwenAdapter={explain:(input:{facts:unknown;instructions:string})=>Promise<string>;draft:(input:{facts:unknown;asset:string})=>Promise<string>};
export function validateQwenFacts(facts:unknown){return facts!==undefined&&facts!==null}
export async function safeQwenExplain(adapter:QwenAdapter,facts:unknown,instructions:string){
 if(!validateQwenFacts(facts)) return "Insufficient evidence.";
 return adapter.explain({facts,instructions});
}
