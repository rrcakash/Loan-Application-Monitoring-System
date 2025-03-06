import express from "express";
import morgan from "morgan";
import loanRoutes from "./api/v1/routes/loanRoutes";
import { errorHandler } from './api/v1/middleware/errormiddleware';
import adminRoutes from "./api/v1/routes/adminRoutes";
import userRoutes from "./api/v1/routes/userRoutes";  
const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1", loanRoutes);

app.use("/api/v1", adminRoutes);
app.use("/api/v1", userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;
