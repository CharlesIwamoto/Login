import Ticket from "../models/Ticket";
import * as Yup from "yup";
import User from "../models/User";
import { Op } from "sequelize";
import { parseISO } from "date-fns";
import Comment from "../models/Comment";

class TicketsController {

    async index(req, res) {

        const {
            title,
            description,
            status,
            priority,
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
        

        if (title) {
            where = {
                ...where,
                title: {
                    [Op.iLike]: title
                }
            };
        };

        if (description) {
            where = {
                ...where,
                description: {
                    [Op.iLike]: description
                }
            };
        };

        if (status) {
            where = {
                ...where,
                status: {
                    [Op.iLike]: status
                }
            };
        };

        if (priority) {
            where = {
                ...where,
                priority: {
                    [Op.iLike]: priority
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
        }


        const tickets = await Ticket.findAll({
            where,
            order,
            attributes: {
                exclude: ["user_id", "category_id", "UserId", "CategoryId"]
            },
            include: [{
                model: User,
                attributes: ["name"]
            },
            {
                model: Comment,
                attributes:["message", "createdAt"]
            }
        ],
            limit,
            offset: limit * page - limit
        });

        return res.json(tickets);
    }

    async create(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            description: Yup.string().required(),
            status: Yup.string().oneOf(["OPEN", "IN_PROGRESS", "WAITING FOR USER", "RESOLVED", "CLOSED"]).required("Status Invalido"),
            priority: Yup.string().oneOf(["LOW", "AVERAGE", "HIGH", "CRITICISM"]).required(),
            closing_date: Yup.date(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "erro de validação" });
        }

        const ticket = await Ticket.create({
            ...req.body,
            user_id: req.userId,
            category_id: req.body.category_id,
        });
        //encontra que envia a req
        const user = await User.findByPk(req.userId);
        console.log(user);

        return res.status(201).json(ticket);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string(),
            description: Yup.string().strict(),
            status: Yup.string().oneOf(["OPEN", "IN_PROGRESS", "WAITING FOR USER", "RESOLVED", "CLOSED"]),
            priority: Yup.string().oneOf(["LOW", "AVERAGE", "HIGH", "CRITICISM"]),
            closing_date: Yup.date(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "erro de validação" });
        }

        const ticket = await Ticket.findByPk(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                code: 404,
                message: "Ticket não encontrado"
            });
        }

        await ticket.update(req.body);

        return res.status(200).json({
            success: true,
            message: "Ticket atualizado com sucesso"
        });
    }

    async destroy(req, res) {
        const ticket = await Ticket.findByPk(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                code: 404,
                message: "Ticket não encontrado"
            });
        }

        await ticket.destroy();

        return res.status(200).json();
    }
}

export default new TicketsController();