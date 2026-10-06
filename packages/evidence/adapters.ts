import type {Evidence} from "../core";

export type RawSignal={source:string;sourceUrl?:string;sourceType:string;payload:Record<string,unknown>;confidence?:number;expiresAt?:string};

export function normalizeSignal(signal:RawSignal,capturedAt=new Date().toISOString()):Evidence{
  const confidence=Number.isFinite(signal.confidence)?Math.max(0,Math.min(1,signal.confidence??0)):0;
  const sourceKey=signal.source.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"source";
  return {id:`ev_${sourceKey}_${capturedAt.replace(/[^0-9]/g,"").slice(0,14)}`,source:signal.source,sourceUrl:signal.sourceUrl,sourceType:signal.sourceType,capturedAt,expiresAt:signal.expiresAt,confidence,payload:structuredClone(signal.payload)};
}

export type EvidenceAdapter={name:string;collect:()=>Promise<RawSignal[]>};

export async function collectEvidence(adapters:EvidenceAdapter[],capturedAt=new Date().toISOString()){
  const results:Evidence[]=[];
  for(const adapter of adapters){for(const signal of await adapter.collect())results.push(normalizeSignal(signal,capturedAt));}
  return results;
}