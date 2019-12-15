import * as csv from "csvtojson";
import { DBConn } from "../../database";

/**
 * Read the location CSV file and store the location collection
 */
export class LOCATION {
  private readonly csvFile = "./controllers/location/location.csv";
  public async readCSVFile() {
    csv()
      .fromFile(this.csvFile)
      .then(jsonObj => {
        DBConn.dropCollection("locations", result => {});
        DBConn.collection("locations").insertMany(jsonObj, function(
          error,
          inserted
        ) {
          if (error) {
            return Promise.reject(error);
          }
          console.info(`Successfully populated location file.`);
          return Promise.resolve();
        }); // end of insert
      });
  }
}
