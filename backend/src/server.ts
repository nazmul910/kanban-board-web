import app from "./app";
import config from "./config";

const port = config.port;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${config.env}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received");

  server.close(() => {
    console.log("Server closed successfully");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received");

  server.close(() => {
    console.log("Server closed successfully");
    process.exit(0);
  });
});