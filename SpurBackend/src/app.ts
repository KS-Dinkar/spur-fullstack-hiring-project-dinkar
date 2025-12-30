import express from "express";
import cors from "cors";
import queryRouter from "./routes/query.route.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", queryRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
