import "#db";
import express from "express";
import cors from "cors";
import {
  userRouter,
  productRouter,
  orderRouter,
  categoryRouter,
  docsRoutes,
} from "#routes";
import { errorHandler, notFoundHandler } from "#middlewares";

const app = express();
const port = 3000;

app.use(express.json());

// const corsOptions = {
//   // origin: process.env.NODE_ENV === "production"
//   //   ? "https://yourproductionfrontend.com"
//   //   : "http://localhost:3000",

//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };

//app.use(cors(corsOptions));
app.use(cors());

app.use("/docs", docsRoutes);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/categories", categoryRouter);
app.use("*splat", notFoundHandler);
app.use(errorHandler);
app.listen(port, () =>
  console.log(`\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`),
);
