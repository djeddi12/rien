import type {Offer,Opportunity,OfferMatch} from "../core";

const STOP=new Set(["the","and","for","with","from","that","this","software","tool","service","platform"]);
const tokens=(value:string)=>value.toLowerCase().split(/[^a-z0-9]+/).filter(x=>x.length>2&&!STOP.has(x));

function semanticFit(opportunity:Opportunity,offer:Offer):number{
 const source=new Set(tokens([opportunity.title,opportunity.audience,opportunity.category].join(" ")));
 const target=new Set(tokens([offer.product,offer.merchant,offer.category].join(" ")));
 const overlap=[...source].filter(x=>target.has(x)).length;
 const category=opportunity.category.toLowerCase()===offer.category.toLowerCase()?70:0;
 const model=opportunity.monetizationHypotheses.includes(offer.model)?15:0;
 return Math.min(100,Math.round(40*Math.min(1,overlap/3)+category+model+15));
}

function economics(offer:Offer):number{
 const commission=offer.commission??0;
 const recurring=offer.recurring?15:0;
 const value=commission<=1?commission*100:Math.min(100,20+Math.log10(1+commission)*18);
 return Math.round(Math.min(100,value+recurring));
}

export function matchOffer(opportunity:Opportunity,offer:Offer):OfferMatch{
 const fitScore=semanticFit(opportunity,offer);
 const economicsScore=economics(offer);
 const risks:string[]=[];
 if(!offer.lastVerifiedAt) risks.push("unverified");
 if(offer.geography?.length===0) risks.push("geography_unknown");
 return {
  opportunityId:opportunity.id,offerId:offer.id,fitScore,economicsScore,
  evidenceIds:opportunity.evidenceIds,risks,
  verifiedAt:new Date().toISOString()
 };
}
