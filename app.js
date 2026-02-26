import express from 'express';
import UserRouter from './Routes/UserRouter.js';
import AdminRouter from './Routes/AdminRouter.js';
import ContactRouter from './Routes/ContactRouter.js';
import EventRouter from './Routes/EventRouter.js';
const app = express();
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config({ quiet: true })

app.use(cors())


app.use(express.json());



app.use('/user', UserRouter)
app.use('/admin', AdminRouter)
app.use('/contact', ContactRouter)
app.use('/event', EventRouter)






export default app;