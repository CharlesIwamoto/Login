export default (req, res, next) => {
    const profile = req.userProfile;

    if (profile !== "ADMIN"){
        return res.status(403).json({error: "Acesso negado"});
    }

    next();
};