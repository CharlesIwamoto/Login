import jwt from "jsonwebtoken";
import auth from "../../config/auth.js";

export default  (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error: "Nenhum token fornecido."});
    }

    const token = authHeader.replace("Bearer ", "");
    
    try {
        const decoded =  jwt.verify(token, auth.secret);

        req.userId = decoded.id;
        
        return next();
    } catch (error) {
        return res.status(401).json({error: error.message});
    }

};