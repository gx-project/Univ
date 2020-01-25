import { name, version } from "../package.json";
import * as Router from "./router";
import Server from "./server";

const engine = name.split("/")[1];

export default { engine, version, Router, Server };
