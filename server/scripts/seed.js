import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {User,ServiceRequest,Resolution} from '../models/index.js';
if(!process.env.MONGO_URI)throw new Error('MONGO_URI is required');
await mongoose.connect(process.env.MONGO_URI);
const hash=await bcrypt.hash('CampusCare!2026',12);
await User.deleteMany({email:/@campuscare\.edu$/});
const [admin,...users]=await User.create([
 {name:'CampusCare Admin',email:'admin@campuscare.edu',password:await bcrypt.hash('Admin@123',12),role:'admin'},
 {name:'Ravi Kumar',email:'rkumar@campuscare.edu',password:hash,role:'staff',department:'Maintenance',designation:'Facilities Technician'},
 {name:'Maya Thomas',email:'mthomas@campuscare.edu',password:hash,role:'staff',department:'IT Support',designation:'IT Support Specialist'},
 {name:'Sanjay Das',email:'sdas@campuscare.edu',password:hash,role:'staff',department:'Hostel',designation:'Hostel Services Coordinator'},
 ...[['Ananya Sharma','ananya@campuscare.edu','Computer Science'],['Rahul Mehta','rahul@campuscare.edu','Mechanical'],['Priya Nair','priya@campuscare.edu','Electrical'],['Arjun Patel','arjun@campuscare.edu','Business'],['Diya Iyer','diya@campuscare.edu','Computer Science']].map(([name,email,department],i)=>({name,email,password:hash,role:'student',department,year:i%4+1,rollNumber:`CC${2026}${String(i+1).padStart(3,'0')}`}))
]);
const staff=users.slice(0,3),students=users.slice(3), defs=[['Water leakage in Block C washroom','Water is leaking near the sink and making the floor slippery.','Maintenance','Block C · 2nd floor','Urgent','In Progress',0,0],['Wi-Fi not connecting in library','Campus network disconnects every few minutes.','IT Support','Central Library','High','Pending',1,null],['Projector lamp needs replacement','The projector image is too dim for lectures.','Academic','Engineering · Room 302','Medium','Assigned',2,1],['Mess card balance not updating','The payment is complete but balance has not changed.','Canteen','North Campus · Dining','Low','Resolved',3,2],['Hostel room fan making noise','Fan rattles loudly at night.','Hostel','Hostel 4 · Room 218','Medium','In Progress',4,2],['Bus route 4 running late','Route 4 has arrived 20 minutes late this week.','Transport','Main Gate','High','Pending',0,null],['Lab 2 AC not cooling','Air conditioning is not working in the afternoon.','Maintenance','Science Block · Lab 2','Urgent','Assigned',1,0],['Unable to access course portal','Portal returns an error when opening course materials.','IT Support','Student Portal','Low','Resolved',2,1],['Return slot unavailable for books','No return slot appears for the book due today.','Library','Central Library · Floor 1','Medium','Closed',3,2],['Classroom lights flickering','Two lights flicker during evening lectures.','Maintenance','Humanities · Room 110','Medium','Resolved',4,0]];
await ServiceRequest.deleteMany({});await Resolution.deleteMany({});const docs=await ServiceRequest.create(defs.map(([title,description,category,location,priority,status,si,ti],i)=>({title,description,category,location,priority,status,studentId:students[si]._id,assignedStaffId:ti===null?null:staff[ti]._id,createdAt:new Date(Date.now()-(i+1)*14*3600000),deadline:new Date(Date.now()+(i-2)*24*3600000)})));
for(const i of [3,7,9])await Resolution.create({requestId:docs[i]._id,staffId:staff[i%3]._id,resolutionNotes:'Issue investigated and resolved. Verified with the student and recorded completion.',resolvedAt:docs[i].updatedAt,timeTakenHours:18+i});
console.log('Seeded CampusCare. Admin: admin@campuscare.edu / Admin@123. Staff and student demo password: CampusCare!2026');await mongoose.disconnect();
