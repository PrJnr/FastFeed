import Sequelize, { Model } from 'sequelize';

class Deliverys extends Model {
    static init(sequelize) {
        super.init(
            {
                product: Sequelize.STRING,
                canceled_at: Sequelize.DATE,
                start_date: Sequelize.DATE,
                end_date: Sequelize.DATE,
                signature_id: Sequelize.NUMBER,
                deliveryman_id: Sequelize.NUMBER,
                recipient_id: Sequelize.NUMBER,
            },
            {
                sequelize,
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.File, {
            foreignKey: 'signature_id',
            as: 'signature',
        });
        this.belongsTo(models.File, {
            foreignKey: 'deliveryman_id',
            as: 'deliveryman',
        });
        this.belongsTo(models.File, {
            foreignKey: 'recipient_id',
            as: 'recipient',
        });
    }
}

export default Deliverys;
