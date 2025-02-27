import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import createTasksRoutes from "./routes/createTasksRoutes";
import taskListRoutes from "./routes/taskListRoutes";
import viewTaskRoutes from "./routes/viewTaskRoutes"
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/createTasks", createTasksRoutes)
app.use("/api/tasklist", taskListRoutes)
app.use("/api/viewTask", viewTaskRoutes)

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
