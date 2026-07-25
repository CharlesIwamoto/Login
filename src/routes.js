import { Router } from "express";
import users from "./app/controllers/UsersController";
import sessions from "./app/controllers/SessionsController";

import auth from "./app/middlewares/auth";

const routes = new Router();

//sessions
routes.post("/sessions", sessions.create);

//controla o acesso
routes.use(auth);

//user
routes.get("/login",users.index);
routes.post("/login", users.create);


export default routes;