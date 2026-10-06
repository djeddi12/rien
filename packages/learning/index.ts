import type {Outcome} from "../core";

export type LearningSignal={metric:string;value:number;confidence:number;source:"observed"|"derived"};

export function deriveLearning(outcome:Outcome):LearningSignal[]{
 const out:LearningSignal[]=[];
 const visits=outcome.visits??0, clicks=outcome.clicks??0, conversions=outcome.conversions??0;
 if(visits>0){out.push({metric:"click_rate",value:clicks/visits,confidence:outcome.attributionQuality==="high"?1:.6,source:"derived"});}
 if(visits>0){out.push({metric:"conversion_rate",value:conversions/visits,confidence:outcome.attributionQuality==="high"?1:.6,source:"derived"});}
 if(typeof outcome.revenue==="number"){out.push({metric:"revenue",value:outcome.revenue,confidence:outcome.attributionQuality==="high"?1:.6,source:"observed"});}
 return out;
}

export function winnerSignal(outcome:Outcome){
 const cr=outcome.visits?(outcome.conversions??0)/outcome.visits:0;
 return outcome.attributionQuality==="high"&&cr>0;
}
