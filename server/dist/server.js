import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadouter from "./routes/uploadRoutes.js";
import orderRouter from "./routes/orderRouters.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import addressRouter from "./routes/addressRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Server is Live!");
});
app.use("/api/auth", authRouter);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadouter);
app.use("/api/orders", orderRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/admin", adminRouter);
// ingest
app.use("/api/inngest", serve({ client: inngest, functions }));
// error handling
app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).json({ message: error.message });
});
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}
export default app;
