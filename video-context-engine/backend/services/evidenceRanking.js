/** Transparent editorial heuristic, NOT a factual trustworthiness measure. */
const established = new Set(['reuters.com','apnews.com','bbc.com','npr.org','pbs.org']);
const reference = new Set(['wikipedia.org','britannica.com']);
function domainOf(url){try {return new URL(url).hostname.toLowerCase().replace(/^www\./,'');}catch{return '';}}
export function domainWeight(url){
  const domain=domainOf(url);
  if(!domain) return {weight:0.3,reason:'Unknown source domain'};
  if(domain.endsWith('.gov')||domain.endsWith('.edu')) return {weight:0.9,reason:'Government or educational domain (verify relevance independently)'};
  if(established.has(domain)) return {weight:0.85,reason:'Established editorial newsroom (heuristic)'};
  if(reference.has(domain)) return {weight:0.7,reason:'General reference source'};
  return {weight:0.5,reason:'Unclassified domain; credibility requires manual checking'};
}
export function scoreEvidence(source,firstDate){
 const {weight,reason}=domainWeight(source.url);
 const publication=source.publishedAt?Date.parse(source.publishedAt):NaN;
 const earliest=firstDate?Date.parse(firstDate):NaN;
 const chronological=Number.isFinite(publication)&&Number.isFinite(earliest)?Math.max(0,1-Math.abs(publication-earliest)/(1000*60*60*24*365)):0.45;
 const corroboration=source.corroboration??0;
 const total=Math.round(100*(0.5*weight+0.3*chronological+0.2*corroboration));
 return {...source,domain:domainOf(source.url),score:total,weightFactors:{domain:weight,chronology:chronological,corroboration},scoreExplanation:reason};
}
export function earliestDated(sources){
 const dated=sources.filter(s=>s.publishedAt&&!Number.isNaN(Date.parse(s.publishedAt)));
 return [...dated].sort((a,b)=>Date.parse(a.publishedAt)-Date.parse(b.publishedAt))[0]||null;
}
