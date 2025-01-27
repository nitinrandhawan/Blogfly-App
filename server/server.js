import express from 'express'
import 'dotenv/config'
import DBConnection from './db/index.js'
import cors from 'cors'
import admin from 'firebase-admin'


const app=express()

app.use(cors())
app.use(express.json())


const serviceAccountKey=JSON.parse(process.env.FIREBASE_JSON_FILE)

admin.initializeApp({
    credential:admin.credential.cert(serviceAccountKey)
})




DBConnection().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`app is listening on ${process.env.PORT}`);
    })
})
.catch((err)=>{
console.log('db connection failed',err);
})

// route

// user route
import userRoute from './routes/user.routes.js'

app.use('/',userRoute)

// Blog route
import blogRoute from './routes/blog.routes.js'
app.use('/',blogRoute)

import commentRoute from './routes/comment.routes.js'
app.use('/',commentRoute)