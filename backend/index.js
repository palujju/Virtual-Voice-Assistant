import express from 'express'
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRouter from './routes/user.routes.js';
// import geminiResponse from './gemini.js';


const app = express();
app.use(cors({
    origin:"https://virtual-voice-assistant.onrender.com",
    credentials:true
}))
const port = process.env.PORT || 8000;

app.use(cookieParser())
app.use(express.json())

app.use('/api/auth',authRouter)
app.use("/api/user", userRouter);

// app.get('/', async (req,res)=>{
//     let prompt = req.query.prompt
//    let data = await geminiResponse(prompt)
//    res.json(data)
// })


app.listen(port,()=>{
    console.log(`Listening on Port on :- ${port}`)
    connectDb()
})
