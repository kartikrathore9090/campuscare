import jwt from 'jsonwebtoken';
import {User} from '../models/index.js';
export async function auth(req,res,next){const token=req.get('authorization')?.replace(/^Bearer\s+/i,'');if(!token)return res.status(401).json({success:false,data:null,message:'Authentication required'});let claims;try{claims=jwt.verify(token,process.env.JWT_SECRET)}catch{return res.status(401).json({success:false,data:null,message:'Invalid or expired token'})}try{const user=await User.findById(claims.id).select('role isActive');if(!user||!user.isActive)return res.status(401).json({success:false,data:null,message:'Account is inactive'});req.user={id:user.id,role:user.role};return next()}catch(error){return next(error)}}
export const allow=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({success:false,data:null,message:'Insufficient permissions'});
export const send=(res,data,message='OK',status=200)=>res.status(status).json({success:true,data,message});
