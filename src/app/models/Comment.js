import { Model, DataTypes } from "sequelize";

class Comment extends Model {
    static init(sequelize) {
        super.init({
            message: DataTypes.STRING,
            internal: DataTypes.BOOLEAN,

        },
            {
                sequelize
            });
    }

    static associate(models) {
        this.belongsTo(models.Ticket, { foreignKey: "ticket_id" });
        this.belongsTo(models.User, { foreignKey: "user_id" });
    }
}

export default Comment;