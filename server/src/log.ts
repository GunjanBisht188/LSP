import * as fs from "fs";
import * as path from "path";

// Define the log file path
const logFilePath = path.join("C:", "lsp-from-scratch", "try", "lsp.log");
const log = fs.createWriteStream(logFilePath);

export default {
  write: (message: object | unknown) => {
    if (typeof message === "object") {
      log.write(JSON.stringify(message));
    } else {
      log.write(message as string); // Asserting the type to string
    }
    log.write("\n");
  },
};
