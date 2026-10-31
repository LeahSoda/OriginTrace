import {scoreEvidence,earliestDated} from './evidenceRanking.js';
export async function searchEvidence(terms){
 const key=process.env.TAVILY_API_KEY;
 if(!key) return {sources:[],earliest:null,warning:'Evidence search is not enabled. Add TAVILY_API_KEY.'};
 if(!terms?.length) return {sources:[],earliest:null,warning:'No identifiable search terms were extracted.'};
 const query=terms.slice(0,5).join(' ');
 const response=await fetch('https://api.tavily.com/search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({api_key:key,query,search_depth:'advanced',max_results:8,include_answer:false})});
 if(!response.ok) throw new Error(`Search service returned HTTP ${response.status}`);
 const data=await response.json();
 // Search snippets often omit publication dates. Never infer them from crawling order.
 const raw=(data.results||[]).map(x=>({title:x.title||'Untitled source',url:x.url,excerpt:x.content||'',publishedAt:x.published_date||null,corroboration:0})).filter(x=>x.url);
 const earliest=earliestDated(raw);
 return {sources:raw.map(s=>scoreEvidence(s,earliest?.publishedAt)),earliest,warning:earliest?'Earliest date in retrieved, date-stamped sources; not proof of first upload.':'Search returned no reliable publication timestamps. Original upload date remains unknown.'};
}
