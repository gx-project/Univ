import { Router } from "express";

export default function endpointRegistry(Univ, { parent, url }, callback) {
  const endpoint = Router();
  callback(endpoint, Univ);
  return parent.use(url, endpoint);
}
