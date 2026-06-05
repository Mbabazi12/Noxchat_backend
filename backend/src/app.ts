import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db';
import { initSocket } from './config/socket';
import routes from './routes';
import errorHandler from './middlewares/errorHandler';

const app = express();
const server = http.createServer(app);

connectDB();
initSocket(server);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api', routes);
app.use(errorHandler);

const PORT = process.env.PORT ?? 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
