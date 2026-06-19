import { Model, DataTypes } from "sequelize";

class User extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password_hash: DataTypes.STRING,
            data_de_nascimento: DataTypes.DATE
        },
        {
            sequelize
        });

    }
}

export default User;