import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const requiredEnvVariables = ["PORT", "MONGODB_URL"];
for (const variable of requiredEnvVariables) {
  if (!(variable in process.env)) {
    console.error(
      `Missing environment variable '${variable}'. Make sure to configure the .env file correctly.`,
    );
    process.exit(1);
  }
}

connectToDb().catch((err) => console.log(err));
async function connectToDb() {
  console.log("Connecting to database...");
  await mongoose.connect(process.env.MONGODB_URL as string);
  console.log("...connected!");
}

const app = express();
const port = parseInt(process.env.PORT as string, 10);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
