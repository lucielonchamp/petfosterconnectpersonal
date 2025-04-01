import express, { Request, Response } from "express";
import router from "./routes/router";
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('', router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
