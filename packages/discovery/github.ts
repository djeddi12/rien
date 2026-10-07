import type {RawSignal} from "../evidence/adapters";

type GitHubIssue={
 number:number;
 title:string;
 html_url:string;
 body:string|null;
 comments:number;
 created_at:string;
 updated_at:string;
 state:string;
 repository_url:string;
 user?:{type?:string}|null;
 labels?:Array<{name?:string}>;
};

export type GitHubDiscoveryConfig={query:string;token?:string;perPage?:number};

const NOISE_PATTERNS=[
 /\[bot\]/i,
 /dependabot/i,
 /renovate/i,
 /github-actions/i,
 /stale/i,
 /auto-?generated/i,
 /^(fix|chore|refactor|test|ci|build|docs?):/i,
 /update .* to v?\d+\.\d+/i,
 /bump .* from .* to/i,
 /^(typo|whitespace|formatting)/i,
 /please (help|review|merge)/i,
];

const NOISE_LABELS=new Set(["dependencies","automated","bot","stale"]);

export function isGitHubIssueNoise(issue:GitHubIssue):boolean{
 const text=`${issue.title} ${issue.body??""}`;
 if(NOISE_PATTERNS.some(pattern=>pattern.test(text))) return true;
 if(issue.title.trim().split(/\s+/).filter(Boolean).length<8) return true;
 if(issue.user?.type?.toLowerCase()==="bot") return true;
 if((issue.labels??[]).some(label=>NOISE_LABELS.has(String(label.name??"").toLowerCase()))) return true;
 return false;
}

export async function discoverGitHubIssues(config:GitHubDiscoveryConfig,fetcher:typeof fetch=fetch):Promise<RawSignal[]>{
 const params=new URLSearchParams({q:config.query,per_page:String(config.perPage??30),sort:"updated",order:"desc"});
 const response=await fetcher(`https://api.github.com/search/issues?${params}`,{
   headers:{"Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28",...(config.token?{Authorization:`Bearer ${config.token}`}:{})}
 });
 if(!response.ok) throw new Error(`GitHub discovery failed: ${response.status}`);
 const data=await response.json() as {items?:GitHubIssue[]};
 return (data.items??[])
   .filter(issue=>!isGitHubIssueNoise(issue))
   .map(issue=>({
   source:"GitHub",
   sourceUrl:issue.html_url,
   sourceType:"github_issue",
   confidence:Math.min(1,.45+Math.min(issue.comments,20)/40),
   payload:{
     issueNumber:issue.number,title:issue.title,body:issue.body??"",
     comments:issue.comments,state:issue.state,createdAt:issue.created_at,
     updatedAt:issue.updated_at,repositoryUrl:issue.repository_url
   }
 }));
}
