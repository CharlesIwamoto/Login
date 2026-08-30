import { Router } from "express";
import users from "./app/controllers/UsersController";
import sessions from "./app/controllers/SessionsController";
import categories from "./app/controllers/CategoriesController";
import comment from "./app/controllers/CommentsController";
import ticket from "./app/controllers/TicketsController";

import auth from "./app/middlewares/auth";

const routes = new Router();

//sessions
routes.post("/sessions", sessions.create);

//controla o acesso
routes.use(auth);

//user
routes.get("/users", users.index);
routes.post("/users", users.create);
routes.get("/users/:id", users.show);
routes.delete("/users/:id", users.destroy);
routes.put("/users/:id", users.update);

//categories
routes.post("/categories", categories.create);
routes.get("/categories/:id", categories.show);
routes.get("/categories", categories.index);
routes.put("/categories/:id", categories.update);
routes.delete("/categories/:id", categories.destroy);

//Comments
routes.post("/comments", comment.create);
routes.get("/comments/:id", comment.show);
routes.get("/comments", comment.index);
routes.put("/comments/:id", comment.update);
routes.delete("/comments/:id", comment.destroy);

//Ticket
routes.get("/tickets", ticket.index);
routes.post("/tickets", ticket.create);
routes.put("/tickets/:id", ticket.update);
routes.delete("/tickets/:id", ticket.destroy);


export default routes;