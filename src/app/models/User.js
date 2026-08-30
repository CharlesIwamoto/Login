import { Model, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.VIRTUAL,
            password_hash: DataTypes.STRING,
            data_de_nascimento: DataTypes.DATE,
            status: DataTypes.ENUM("ACTIVE", "ARCHIVED"),
            profile: DataTypes.ENUM("ADMIN", "ANALYST", "USER")
        },
            {
                sequelize
            });
        this.addHook("beforeSave", async user => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 8);
            }
        });


    }
    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    };

    static associate(models){
        this.hasMany(models.Ticket);
        this.hasMany(models.Comment);
    }
}

export default User;