export type Evidence={id:string;source:string;sourceUrl?:string;sourceType:string;capturedAt:string;expiresAt?:string;confidence:number;payload:Record<string,unknown>};
export type Opportunity={id:string;title:string;audience:string;category:string;evidenceIds:string[];monetizationHypotheses:string[];createdAt:string;confidence:number};
export type Offer={id:string;merchant:string;product:string;category:string;model:"affiliate"|"lead_gen"|"saas"|"digital_product"|"other";price?:number;recurring?:boolean;commission?:number;currency?:string;geography?:string[];termsUrl?:string;lastVerifiedAt:string};
export type OfferMatch={opportunityId:string;offerId:string;fitScore:number;economicsScore:number;evidenceIds:string[];risks:string[];verifiedAt:string};
export type AssetType="page"|"comparison"|"calculator"|"matcher"|"video_brief"|"lead_capture"|"email_sequence"|"interactive_tool";
export type AssetPlan={opportunityId:string;assets:AssetType[];rationale:string[]};
export type Experiment={id:string;opportunityId:string;hypothesis:string;action:string;successMetric:string;minimumObservationDays:number;stopCondition:string;approvalRequired:boolean};
export type Outcome={experimentId:string;visits?:number;clicks?:number;leads?:number;conversions?:number;revenue?:number;cost?:number;attributionQuality:"high"|"medium"|"low"|"unknown";observedAt:string};
