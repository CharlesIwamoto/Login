import { Sequelize } from "sequelize";
import config from "../config/database";

import User from "../app/models/User";

const model = [User];

class Database {
    constructor(){
        this.connection = new Sequelize(config);
        this.init();
    }

    init(){
        model.forEach(model => model.init(this.connection));
    }
}

export default new Database();