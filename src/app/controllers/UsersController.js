import { Op } from "sequelize";
import { parseISO } from "date-fns";
import * as Yup from "yup";
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

        if (data_de_nascimento) {
            where = {
                ...where,
                data_de_nascimento: {
                    [Op.eq]: parseISO(data_de_nascimento)
                }
            };
        }

        const data = await User.findAll({
            where,
        });

        console.log({userId: req.userId});
        console.log(await User.findByPk(req.userId));

        return res.json(data);
    }

    // async show(req, res) {
    //     const { id } = req.params
    //     const data = await User.findOne({

    //     })
    // }

    async create(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            data_de_nascimento: Yup.date().required(),
            password: Yup.string().required().min(8),
            passwordConfirmation: Yup.string().when("password", (password, field) =>
                password ? field.required().oneOf([Yup.ref("password")]) : field
            )
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "erro de validação" });
        }

        const { id, name, email, data_de_nascimento, createdAt, updatedAt } = await User.create(req.body);
        console.log({ id, name, email, data_de_nascimento, createdAt, updatedAt });

        return res.status(201).json({ id, name, email, data_de_nascimento, createdAt, updatedAt });
    }

    // async update(req, res) {

    // }

    // async destroy(req, res) {

    // }

}

export default new UsersController();