import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});