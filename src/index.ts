import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'
import {userRouter} from './Router/UserRouter'
import {bandRouter} from './Router/BandRouter'

dotenv.config()

export const app = express()

app.use(cors({origin: true}))

app.use(express.json())

app.use(fileUpload())

app.use('/user/', userRouter)
app.use('/band/', bandRouter)