import { Router } from "express";

const routes = new Router();

routes.get("/login", (req, res) => {
    res.json({message: "Hello"});
});


export default routes;