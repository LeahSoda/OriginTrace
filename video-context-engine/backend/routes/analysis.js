import {Router} from 'express';
import multer from 'multer';
import {unlink} from 'node:fs/promises';
import {analyze} from '../services/videoAnalyzer.js';

const ALLOWED = new Set(['video/mp4','video/quicktime','video/webm','video/x-matroska']);
export function analysisRouter(uploadDir){
 const router=Router();
 const upload=multer({dest:uploadDir,limits:{fileSize:80*1024*1024},fileFilter:(_req,file,cb)=>{
   cb(ALLOWED.has(file.mimetype)?null:new Error('Only MP4, MOV, WebM or MKV videos are allowed'),ALLOWED.has(file.mimetype));
 }});
 router.post('/analyze',upload.single('video'),async(req,res)=>{
  const filePath=req.file?.path;
  try{
   const url=String(req.body.url||'').trim();
   if(!filePath&&!url)return res.status(400).json({error:'Upload a video or enter a URL.'});
   if(url){let parsed;try{parsed=new URL(url);}catch{return res.status(400).json({error:'Enter a valid URL.'});}
    if(!['https:','http:'].includes(parsed.protocol))return res.status(400).json({error:'Only HTTP(S) URLs are accepted.'});
   }
   const result=await analyze({filePath,url,filename:req.file?.originalname||''});
   res.json(result);
  }catch(e){console.error(e);res.status(500).json({error:'Analysis failed',details:e.message});}
  finally{if(filePath)await unlink(filePath).catch(()=>{});}
 });
 return router;
}
