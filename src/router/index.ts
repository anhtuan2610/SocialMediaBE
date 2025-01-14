import express from "express";

import authentication from "./authentication";
import users from "./users";
import chatRooms from "./chatRooms";
import messages from "./messages";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  chatRooms(router);
  messages(router);
  return router;
};
