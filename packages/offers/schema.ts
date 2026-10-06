import type {Offer} from "../core";

export type OfferVerification={offerId:string;verifiedAt:string;sourceUrl:string;status:"verified"|"stale"|"unverified";notes:string[]};

export function offerFreshness(offer:Offer,now=new Date(),maxAgeDays=30){
 const age=(now.getTime()-new Date(offer.lastVerifiedAt).getTime())/86400000;
 return age<=maxAgeDays;
}

export function normalizeOffer(input:Omit<Offer,"lastVerifiedAt"> & {lastVerifiedAt?:string}):Offer{
 return {...input,lastVerifiedAt:input.lastVerifiedAt??new Date().toISOString()};
}

export function offerEconomics(offer:Offer){
 const commission=Math.max(0,Math.min(1,offer.commission??0));
 const recurring=offer.recurring?1.25:1;
 const price=Math.max(0,offer.price??0);
 return Math.min(100,Math.round((commission*70+Math.min(price/1000,1)*20+((recurring-1)/.25)*10)*100)/100);
}
