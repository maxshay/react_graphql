import 'reflect-metadata'
import { HelloResolver, PostResolver, UserResolver } from './resolvers'
import { ApolloServer } from 'apollo-server-express'
import session from 'express-session'
import mikroOrmConfig from './mikro-orm.config'
import { MikroORM } from '@mikro-orm/core'
import { buildSchema } from 'type-graphql'
import connectRedis from 'connect-redis'
import express from 'express'
import Redis from 'ioredis'
import { MyContext } from './types'
import cors from 'cors'

require('dotenv').config({path: __dirname+'/.env'})

declare module 'express-session' {
    export interface SessionData {
        [key: string]: any
    }
}

const main = async () => {

    const orm = await MikroORM.init(mikroOrmConfig)
    await orm.getMigrator().up()

    const client = new Redis()
    const RedisStore = connectRedis(session)
    const store = new RedisStore({client, disableTouch: true})

    const app = express()
    app.use(cors({
        origin: process.env.CORS_ALLOW_POLICY,
        credentials: true
    }))

    if (process.env.SESSION_SECRET === undefined) {
        throw new Error('environment variables not configured.')
    }

    app.use(
        session({
            name: process.env.SESSION_NAME,
            secret: process.env.SESSION_SECRET,
            resave: false,
            cookie: {
                maxAge: 1000*60*60*24*365, // 1 year
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV !== 'development'
            },
            saveUninitialized: false,
            store
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({req, res}): MyContext => ({em: orm.em, req, res})
    })

    apolloServer.applyMiddleware({
        app, 
        cors: false
    })

    app.get('/', (_,res)=> {
        res.json({message: 'Hello World.'})
    })

    app.listen(4000, () => console.log('listening on port 4000.'))

}
main()