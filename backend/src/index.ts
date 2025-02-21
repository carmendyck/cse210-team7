import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import tasksRoutes from "./routes/createTasksRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes)

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
