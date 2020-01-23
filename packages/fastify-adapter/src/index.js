import { name, version } from "../package.json";
import * as Router from "./router";
import Server from "./server";

export default function UnivFastifyAdapter(configs) {
  return {
    engine: name.split("/")[1],
    version,
    Router,
    Server: Server(configs)
  };
}
