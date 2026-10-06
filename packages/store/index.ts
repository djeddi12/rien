import type {Evidence,Opportunity,Offer,OfferMatch,Experiment,Outcome} from "../core";

export type StoreState={evidence:Evidence[];opportunities:Opportunity[];offers:Offer[];matches:OfferMatch[];experiments:Experiment[];outcomes:Outcome[]};

export class MemoryStore {
  private state:StoreState={evidence:[],opportunities:[],offers:[],matches:[],experiments:[],outcomes:[]};
  addEvidence(v:Evidence){this.state.evidence.push(v);return v}
  addOpportunity(v:Opportunity){this.state.opportunities.push(v);return v}
  addOffer(v:Offer){this.state.offers.push(v);return v}
  addMatch(v:OfferMatch){this.state.matches.push(v);return v}
  addExperiment(v:Experiment){this.state.experiments.push(v);return v}
  addOutcome(v:Outcome){this.state.outcomes.push(v);return v}
  snapshot():StoreState{return structuredClone(this.state)}
}