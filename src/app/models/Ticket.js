import { Model, DataTypes } from "sequelize";

class Ticket extends Model {
    static init(sequelize) {
        super.init({
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            status: DataTypes.ENUM("OPEN", "IN_PROGRESS", "WAITING FOR USER", "RESOLVED", "CLOSED"),
            priority: DataTypes.ENUM("LOW", "AVERAGE", "HIGH", "CRITICISM"),
            closing_date: DataTypes.DATE,
            user_id: DataTypes.INTEGER,
            category_id: DataTypes.INTEGER
        },
            {
                sequelize,
                tableName: "tickets"
            });
    }
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: "user_id" });
        this.belongsTo(models.Category, { foreignKey: "category_id" });
        this.hasMany(models.Comment);
    }
}

export default Ticket;