import fs from "fs";
import { getListOfGods } from "./God.js";

fs.writeFileSync("./gods.json", JSON.stringify(await getListOfGods(), null, 2));
