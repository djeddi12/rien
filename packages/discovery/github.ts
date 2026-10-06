import type {RawSignal} from "../evidence/adapters";

type GitHubIssue={number:number;title:string;html_url:string;body:string|null;comments:number;created_at:string;updated_at:string;state:string;repository_url:string};

export type GitHubDiscoveryConfig={query:string;token?:string;perPage?:number};

export async function discoverGitHubIssues(config:GitHubDiscoveryConfig,fetcher:typeof fetch=fetch):Promise<RawSignal[]>{
 const params=new URLSearchParams({q:config.query,per_page:String(config.perPage??30),sort:"updated",order:"desc"});
 const response=await fetcher(`https://api.github.com/search/issues?${params}`,{
   headers:{"Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28",...(config.token?{Authorization:`Bearer ${config.token}`}:{})}
 });
 if(!response.ok) throw new Error(`GitHub discovery failed: ${response.status}`);
 const data=await response.json() as {items?:GitHubIssue[]};
 return (data.items??[]).map(issue=>({
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
