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

        console.log({ userId: req.userId });
        console.log(await User.findByPk(req.userId));

        return res.json(data);
    }

    async show(req, res) {
        const data = await User.findByPk(req.params.id);

        if (!data) {
            return res.status(404).json({ error: "não encontrado" });
        }

        return res.json(data);
    }

    async create(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            data_de_nascimento: Yup.date().required(),
            password: Yup.string().required().min(8),
            passwordConfirmation: Yup.string().when("password", ([password], field) =>
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

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            data_de_nascimento: Yup.date(),
            oldPassword: Yup.string().min(8),
            password: Yup.string().min(8).when("oldPassword", ([oldPassword], field) =>
                oldPassword ? field.required() : field
            ),
            passwordConfirmation: Yup.string().when("password", ([password], field) =>
                password ? field.required().oneOf([Yup.ref("password")]) : field
            )
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "erro de validação" });
        }

        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(401).json({ error: "usuario nao encontrado." });
        }
        const { oldPassword } = req.body;

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json();
        }

        await user.update(req.body);

        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            data_de_nascimento: user.data_de_nascimento,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });

    }

    async destroy(req, res) {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            res.status(404).json({ error: "usuario nao existe!" });
        }

        await user.destroy();

        return res.status(200).json({ msg: "deletado" });
    }

}

export default new UsersController();