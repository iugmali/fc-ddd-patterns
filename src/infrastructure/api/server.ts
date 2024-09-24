import {app} from "./express";
import {config} from "dotenv";
import {customerRouter} from "./routes/customer.route";

config()

const port = +process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
