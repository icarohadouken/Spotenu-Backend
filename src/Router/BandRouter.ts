import { BandController } from '../Controller/BandController'
import express from 'express'

export const bandRouter = express.Router()

bandRouter.post("/signup", new BandController().signup)