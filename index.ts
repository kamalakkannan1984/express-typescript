import * as http from "http";
import { httpApp } from "./app";
import { LocationInstance } from "./controllers/location";
import { createDefaultDistributor } from "./controllers/users";

let app = http.createServer(httpApp);
const port = 3000 || process.env.PORT;
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
  createDefaultDistributor();
  LocationInstance.readCSVFile();
  //init();
});

/*function init() {
  LocationInstance.readCSVFile()
    .then(() => {
      console.info(`Successfully populated location file.`);
    })
    .catch(error => {});
}*/
