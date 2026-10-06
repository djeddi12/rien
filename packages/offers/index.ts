import type {Offer,Opportunity,OfferMatch} from "../core";
export function matchOffer(opportunity:Opportunity,offer:Offer):OfferMatch{
 const category=opportunity.category.toLowerCase()===offer.category.toLowerCase()?100:50;
 const economics=Math.max(0,Math.min(100,(offer.commission??0)*100));
 return {opportunityId:opportunity.id,offerId:offer.id,fitScore:category,economicsScore:economics,evidenceIds:[],risks:offer.lastVerifiedAt?[]:["unverified"],verifiedAt:new Date().toISOString()};
}
