import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {User} from '../models/index.js';
const {MONGO_URI,ADMIN_EMAIL,ADMIN_NAME,ADMIN_PASSWORD}=process.env;
if(!MONGO_URI||!ADMIN_EMAIL||!ADMIN_NAME||!ADMIN_PASSWORD||ADMIN_PASSWORD.length<12)throw new Error('Set MONGO_URI, ADMIN_EMAIL, ADMIN_NAME, and a unique ADMIN_PASSWORD with 12+ characters.');
await mongoose.connect(MONGO_URI);
const email=ADMIN_EMAIL.toLowerCase();
const existing=await User.findOne({email});
if(existing){await mongoose.disconnect();throw new Error('An account with ADMIN_EMAIL already exists; create-admin will not overwrite it.');}
await User.create({name:ADMIN_NAME,email,password:await bcrypt.hash(ADMIN_PASSWORD,12),role:'admin'});
console.log(`Created initial admin account: ${email}`);
await mongoose.disconnect();
