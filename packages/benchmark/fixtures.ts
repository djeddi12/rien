import type {BenchmarkCase} from "./index";

function evidence(id:string,title:string,category:string,audience:string,confidence:number,commercialIntent:number):BenchmarkCase["evidence"][number]{
 return {id,source:"benchmark",sourceType:"github_issue",capturedAt:"2026-10-06T00:00:00.000Z",confidence,payload:{title,category,audience,commercialIntent}};
}

export const benchmarkCases:BenchmarkCase[]=Array.from({length:100},(_,i)=>{
 const strong=i%3===0;
 const category=["software","marketing","analytics","developer-tools","operations"][i%5];
 return {
  id:`case-${String(i+1).padStart(3,"0")}`,
  category,
  audience:strong?"small agencies":"general users",
  title:strong?`Best ${category} alternative for teams`:`Workflow issue ${i+1}`,
  evidence:[evidence(`e-${i+1}`,strong?"Pricing and alternative request":"General workflow discussion",category,strong?"small agencies":"general users",strong ? .9 : .55,strong?1:.35)],
  offers:strong?[{id:`offer-${i+1}`,merchant:"benchmark",product:category,category,model:"affiliate",commission:.3,recurring:i%2===0,lastVerifiedAt:"2026-10-06"}]:[]
 };
});