import type {Evidence,Opportunity} from "../core";
import {mineOpportunity} from "../opportunities";

export type DiscoveryCluster={title:string;audience:string;category:string;evidence:Evidence[];monetizationHypotheses:string[]};

export function discoverOpportunities(clusters:DiscoveryCluster[]):Opportunity[]{
 return clusters.filter(c=>c.evidence.length>0).map(c=>mineOpportunity(c)).sort((a,b)=>b.confidence-a.confidence);
}
