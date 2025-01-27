import express from 'express'
import 'dotenv/config'
import DBConnection from './db/index.js'
import cors from 'cors'
import admin from 'firebase-admin'
import serviceAccountKey from './blogfly-website-firebase-adminsdk-zhh4z-e8c7dc2ed8.json' assert {type:'json'}


const app=express()

app.use(cors())
app.use(express.json())

// {
//     "type": process.env.FIREBASE_TYPE,
//     "project_id": process.env.FIREBASE_PROJECT_ID,
//     "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
//     "private_key": process.env.FIREBASE_PRIVATE_KEY,
//     "client_email": process.env.FIREBASE_CLIENT_EMAIL,
//     "client_id": process.env.FIREBASE_CLIENT_ID,
//     "auth_uri": process.env.FIREBASE_AUTH_URL,
//     "token_uri": process.env.FIREBASE_TOKEN_URL,
//     "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER,
//     "client_x509_cert_url": process.env.FIREBASE_CLIENT_URL,
//     "universe_domain": process.env.FIREBASE_UNIVERAL_DOMAIN
// }
admin.initializeApp({
    credential:admin.credential.cert(serviceAccountKey)
})
// created server
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