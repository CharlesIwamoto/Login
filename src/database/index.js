import { Sequelize } from "sequelize";
import config from "../config/database";

import User from "../app/models/User";
import Categories from "../app/models/Category";
import Comment from "../app/models/Comment";
import Ticket from "../app/models/Ticket";

const model = [User, Categories, Comment, Ticket];

class Database {
    constructor() {
        this.connection = new Sequelize(config);
        this.init();
        this.associate();
    }

    init() {
        model.forEach(model => model.init(this.connection));
    }

    associate() {
        model.forEach(model => {
            if (model.associate) {
                model.associate(this.connection.models);
            }
        });
    }
}

export default new Database();