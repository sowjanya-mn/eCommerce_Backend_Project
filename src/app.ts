import "#db";
import express from "express";
import { userRouter } from "#routes";
const app = express();
const port = 3000;

app.use(express.json());
app.use("/users", userRouter);
app.listen(port, () =>
  console.log(`\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`),
);
