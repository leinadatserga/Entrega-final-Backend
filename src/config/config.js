import dotenv from "dotenv";

const NODE_ENV = process.env.NODE_ENV || "development";
const dotenvPath = `./.env.${NODE_ENV}`;
dotenv.config ({
    path: dotenvPath
});

export default {
    port: process.env.PORT,
    host: process.env.HOST,
    mongoURL: process.env.MONGO_URL,
    privateSession: process.env.PRIVATE_SESSION,
    salt: process.env.SALT,
    appId: process.env.APP_ID,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callBackURL: process.env.CALLBACK_URL,
    JWTSecret: process.env.JWT_SECRET,
    email: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        user: 'leinadatserga2@gmail.com',
        pass: process.env.PASSWORD_EMAIL
    },
    environment: process.env.TEST_ENVIRONMENT,
    fakeUser: process.env.FAKE_USER,
    fakeProduct: process.env.FAKE_PRODUCT,
    realUser: process.env.REAL_DB_USER
};
