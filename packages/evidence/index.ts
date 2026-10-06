import type {Evidence} from "../core";
export function isFresh(e:Evidence,now=new Date()){return !e.expiresAt||new Date(e.expiresAt).getTime()>=now.getTime()}
export function evidenceQuality(e:Evidence){return Number.isFinite(e.confidence)?Math.max(0,Math.min(1,e.confidence)):0}
export function createEvidenceId(source:string,capturedAt:string){const s=source.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");return `ev_${s||"source"}_${capturedAt.replace(/[^0-9]/g,"").slice(0,14)}`}
