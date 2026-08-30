import Categories from "../models/Category";
import { Op } from "sequelize";
import { parseISO } from "date-fns";

class CategoriesController {
    async create(req, res) {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: "campo name obrigatorio" });
        }

        const category = await Categories.create({ name, description });

        return res.status(200).json(category);
    }

    async index(req, res) {
        const {
            id,
            name,
            description,
            createdBefore,
            createdAfter,
            updatedBefore,
            updatedAfter,
            sort,
        } = req.query;

        let where = {};
        let order = [];

        const limit = parseInt(req.query.limit || 25);
        const page = parseInt(req.query.page || 1);

        if (id) {
            where = {
                ...where,
                id: {
                    [Op.eq]: id
                }
            };
        }

        if (name) {
            where = {
                ...where,
                name: {
                    [Op.iLike]: name
                }
            };
        }

        if (description) {
            where = {
                ...where,
                description: {
                    [Op.iLike]: description
                }
            };
        }

        if (createdBefore) {
            where = {
                ...where,
                created_at: {
                    [Op.lte]: parseISO(createdBefore)
                }
            };
        }

        if (createdAfter) {
            where = {
                ...where,
                created_at: {
                    [Op.gte]: parseISO(createdAfter)
                }
            };
        }

        if (updatedBefore) {
            where = {
                ...where,
                updated_at: {
                    [Op.lte]: parseISO(updatedBefore)
                }
            };
        }

        if (updatedAfter) {
            where = {
                ...where,
                updated_at: {
                    [Op.gte]: parseISO(updatedAfter)
                }
            };
        }

        if (sort) {
            order = sort.split(",").map(item => item.split(":"));
        }

        const category = await Categories.findAll({
            where,
            order,
            limit,
            offset: limit * page - limit
        });

        return res.json(category);
    }

    async show(req, res) {
        const category = await Categories.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                code: 404,
                message: "Category não encontrado"
            });
        }

        return res.status(200).json(category);
    }

    async update(req, res) {
        const category = await Categories.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                code: 404,
                message: "Category não encontrado"
            });
        }

        const { name, description } = await category.update(req.body);

        return res.status(201).json({ name, description });
    }

    async destroy(req, res) {
        const category = await Categories.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                code: 404,
                message: "Category não encontrado"
            });
        }

        await category.destroy();

        return res.status(200).json({
            success: true,
            code: 200,
            message: "Category deletado com sucesso"
        });

    }
}

export default new CategoriesController();