import { Router } from "express";

export default function endpointRegistry(parent, url, callback) {
  const endpoint = Router();
  callback(endpoint);
  return parent.use(url, endpoint);
}
