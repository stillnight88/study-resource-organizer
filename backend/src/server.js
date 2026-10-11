import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import createAdminAccount from "./utils/createAdmin.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await createAdminAccount();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();