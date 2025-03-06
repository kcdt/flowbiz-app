import express from 'express';
import cors from 'cors';
import { env } from "./config/env";
import routes from "./routes/index.routes";

const app = express();
const { PORT, FRONTEND_URL } = env;

app.use(cors({
    origin: FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(routes);

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});