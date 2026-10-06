export type VariantStats={id:string;impressions:number;conversions:number};
export function empiricalConversionRate(v:VariantStats){return v.impressions>0?v.conversions/v.impressions:0}
export function selectVariant(variants:VariantStats[]){
 return [...variants].sort((a,b)=>empiricalConversionRate(b)-empiricalConversionRate(a))[0]??null;
}
