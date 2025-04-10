import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from '../middleware/authMiddleware';

// Route Imports
import tenantRoutes from '../routes/tenantRoutes';
import managerRoutes from '../routes/managerRoutes';
import propertyRoutes from '../routes/propertyRoutes'
import leaseRoutes from '../routes/leaseRoutes'
import applicationRoutes from '../routes/applicationRoutes'

// Configurations
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan("common"));
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/properties", propertyRoutes)
app.use("/leases", authMiddleware(['manager', 'tenant']), leaseRoutes)
app.use("/tenants", authMiddleware(["tenant"]), tenantRoutes);
app.use("/managers", authMiddleware(["manager"]), managerRoutes);
app.use("/applications", applicationRoutes)

// Server
const PORT = Number(process.env.PORT) || 3002;
app.listen(PORT, "0.0.0.0", () => {  
  console.log(`Server is running on port ${PORT}`);
});
