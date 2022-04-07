import dotenv from 'dotenv'
import Koa from 'koa'
import mongoose from 'mongoose'
import KoaCors from '@koa/cors'
import KoaBodyParser from 'koa-bodyparser'
import Router from './routes'

import { setupBot } from './bot'

dotenv.config();

const app = new Koa();

app.use(KoaCors());
app.use(KoaBodyParser());

app.use(Router.routes());
app.use(Router.allowedMethods());

const start = async () => {
    const PORT = process.env.PORT || 80;

    await mongoose.connect(process.env.MONGO_CONNECTION_URL as string);

    setupBot();

    app.listen(PORT, () => console.log("Сервер запущен и слушает порт:", PORT));
}

start();