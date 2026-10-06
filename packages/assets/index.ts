import type {AssetPlan,AssetType,Opportunity,OfferMatch} from "../core";

export function planAssets(opportunity:Opportunity,matches:OfferMatch[]):AssetPlan{
 const assets:AssetType[]=["page"];
 const rationale=["Create a decision-focused landing asset around the measured opportunity."];
 if(matches.length){assets.push("comparison");rationale.push("Compare matched offers using verified economics and fit.");}
 if(opportunity.category.toLowerCase().includes("software")){assets.push("matcher","calculator");rationale.push("Interactive tools can capture commercial intent without relying on thin articles.");}
 assets.push("video_brief");
 return {opportunityId:opportunity.id,assets:[...new Set(assets)],rationale};
}
