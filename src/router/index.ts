import express from "express";

import authentication from "./authentication";
import users from "./users";
import chatRooms from "./chatRooms";
import messages from "./messages";
import upLoad from "./upLoad";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  chatRooms(router);
  messages(router);
  upLoad(router);
  return router;
};
