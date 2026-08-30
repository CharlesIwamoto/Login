import Comment from "../models/Comment";
import * as Yup from "yup";
import { Op } from "sequelize";
import { parseISO } from "date-fns";

class CommentsController {
    async index(req, res) {
        const {
            message,
            internal,
            createdBefore,
            createdAfter,
            updatedBefore,
            updatedAfter,
            sort
        } = req.query;

        let where = {};
        let order = [];

        const limit = parseInt(req.query.limit || 25);
        const page = parseInt(req.query.page || 1);

        if (message) {
            where = {
                ...where,
                message: {
                    [Op.iLike]: message
                }
            };
        };

        if (internal) {
            where = {
                ...where,
                internal: {
                    [Op.in]: [true, false]
                }
            };
        };

        if (createdBefore) {
            where = {
                ...where,
                created_at: {
                    [Op.lte]: parseISO(createdBefore)
                }
            };
        };

        if (createdAfter) {
            where = {
                ...where,
                created_at: {
                    [Op.gte]: parseISO(createdAfter)
                }
            };
        };

        if (updatedBefore) {
            where = {
                ...where,
                updated_at: {
                    [Op.lte]: parseISO(updatedBefore)
                }
            };
        };

        if (updatedAfter) {
            where = {
                ...where,
                updated_at: {
                    [Op.gte]: parseISO(updatedAfter)
                }
            };
        };

        if (sort) {
            order = sort.split(",").map(item => item.split(":"));
        };

        const comment = await Comment.findAll({
            where,
            order,
            limit,
            offset: limit * page - limit
        });

        return res.json(comment);
    }
    async show(req, res) {
        const comment = await Comment.findByPk(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                code: 404,
                message: "Comment não encontrado"
            });
        }

        return res.status(200).json(comment);
    }
    async create(req, res) {
        const schema = Yup.object().shape({
            message: Yup.string().required(),
            internal: Yup.boolean().required(),
            ticket_id: Yup.number().strict().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "erro de validação" });
        }

        const comment = await Comment.create({
            ticket_id: req.body.ticket_id,
            user_id: req.userId,
            ...req.body
        });

        return res.status(201).json(comment);
    }
    async update(req, res) {
        const schema = Yup.object().shape({
            message: Yup.string(),
            internal: Yup.boolean()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "Erro de validação"
            });
        }

        const comment = await Comment.findByPk(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                code: 404,
                message: "Comment não encontrado"
            });
        }

        await comment.update(req.body);

        return res.status(200).json({
            success: true,
            code: 200,
            message: "Comment atualizado com sucesso"
        });
    }
    async destroy(req, res) {
        const comment = await Comment.findByPk(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                code: 404,
                message: "Comment não encontrado"
            });
        }

        await comment.destroy();

        return res.status(200).json();
    }
};

export default new CommentsController();