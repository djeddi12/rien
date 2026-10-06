import type {Evidence} from "../core";

function normalizeText(value:string){
 return value.toLowerCase().replace(/https?:\/\/\S+/g," ").replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim();
}

export function evidenceFingerprint(e:Evidence):string{
 const p=e.payload;
 return [e.sourceType,normalizeText(String(p.repositoryUrl??"")),normalizeText(String(p.title??"")),normalizeText(String(p.body??"")).slice(0,1200)].join("|");
}

export function deduplicateEvidence(items:Evidence[]):Evidence[]{
 const seen=new Set<string>();
 const out:Evidence[]=[];
 for(const item of items){
  const key=evidenceFingerprint(item);
  if(seen.has(key)) continue;
  seen.add(key);
  out.push(item);
 }
 return out;
}
