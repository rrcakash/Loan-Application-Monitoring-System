import express from "express";
import morgan from "morgan";
import loanRoutes from "./api/v1/routes/loanRoutes";

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/loans", loanRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;
