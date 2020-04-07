import Sequelize, { Model } from 'sequelize';

class Delivery_problems extends Model {
    static init(sequelize) {
        super.init(
            {
                description: Sequelize.STRING,
                delivery_id: Sequelize.NUMBER,
            },
            {
                sequelize,
                tableName: 'delivery_problems',
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Deliverys, {
            foreignKey: 'delivery_id',
            as: 'delivery',
        });
    }
}

export default Delivery_problems;
