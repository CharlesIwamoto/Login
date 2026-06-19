import { Sequelize, Op } from "sequelize";
import User from "../models/User";


class UsersController {
    async index(req, res) {
        const {
            name,
            email,
            data_de_nascimento,
        } = req.query;

        let where = {};

        if (name) {
            where = {
                ...where,
                name: {
                    [Op.iLike]: name,
                },
            };
        }

        if (email) {
            where = {
                ...where,
                email: {
                    [Op.iLike]: email,
                }
            };
        }

        const data = await User.findAll({
            where,
        });

        return res.json(data);
    }

    // async show(req, res) {
    //     const { id } = req.params
    //     const data = await User.findOne({

    //     })
    // }

    // async create(req, res) {

    // }

    // async update(req, res) {

    // }

    // async destroy(req, res) {

    // }

}

export default new UsersController();