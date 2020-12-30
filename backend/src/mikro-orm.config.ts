require('dotenv').config({path: __dirname+'/.env'})
import { MikroORM } from '@mikro-orm/core'
import path from 'path';
import { Post, User } from './entities';

export default {

    migrations: {
        path: path.join(__dirname+'/migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/
    },
    entities: [Post, User],
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dbName: process.env.DATABASE_DBNAME,
    type: process.env.DATABASE_TYPE,
    debug: process.env.NODE_ENV === 'development'
} as Parameters<typeof MikroORM.init>[0];