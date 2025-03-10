import express from 'express';
import cors from 'cors';
import { env } from "./config/env";
import routes from "./routes/index.routes";
import { requestLogger } from './utils/logger.utils';

const app = express();
const { PORT, FRONTEND_URL } = env;

const allowedOrigins = [
    FRONTEND_URL, 
    'https://flowbiz-app-frontend.vercel.app',
    'https://flowbiz-app-production.up.railway.app'
].filter(Boolean);

app.use(cors({
origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
    callback(null, true);
    } else {
    callback(new Error('Non autorisé par CORS'));
    }
},
methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
credentials: true
}));

app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(routes);

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});