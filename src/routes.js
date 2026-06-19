import { Router } from "express";
import users from "./app/controllers/UsersController";

const routes = new Router();

routes.get("/login",users.index);


export default routes;