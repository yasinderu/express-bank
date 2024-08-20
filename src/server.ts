import { pool } from "./db/pool";
import app from "./app";

const port = 8080;

pool
  .connect()
  .then(() => {
    app().listen(port, () => {
      console.log(`Server is running on PORT: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
