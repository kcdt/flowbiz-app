import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from "./config/env";

const app = express();
const { PORT, FRONTEND_URL } = env;

app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req: Request, res: Response) => {
    res.send(`DB connectée : ${process.env.DATABASE_URL}`);
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});