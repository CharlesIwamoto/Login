import { Model, DataTypes } from "sequelize";

class Category extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING
        },
            {
                sequelize,
            },
            {
                tableName: "categories"
            });
    }

    static associate(models){
        this.hasMany(models.Ticket);
    }
}

export default Category;