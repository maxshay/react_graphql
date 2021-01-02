import path from 'path'

// .env file is in root of directory not 'src'
require('dotenv').config({path: path.join(__dirname+'/../../.env')})

export default {
    nodeEnv: process.env.NODE_ENV,
    dbUri: process.env.DATABSE_URI,
    corsPolicy: process.env.CORS_ALLOW_POLICY,
    dbUser: process.env.DATABASE_USER,
    dbPassword: process.env.DATABASE_PASSWORD,
    dbName: process.env.DATABASE_DBNAME,
    dbHost: process.env.DATABASE_HOST,
    dbPort: process.env.DATABASE_PORT,
    dbType: process.env.DATABASE_TYPE,
    sessionName: process.env.SESSION_NAME,
    sessionSecret: process.env.SESSION_SECRET,
}