import Sequelize from 'sequelize';
import User from '../app/models/User';
import Recipients from '../app/models/Recipients';
import File from '../app/models/File';
import Deliverymans from '../app/models/Deliverymans';
import Deliverys from '../app/models/Deliverys';
import Delivery_problems from '../app/models/Delivery_problems';

import databaseConfig from '../config/database';

const models = [
    User,
    Recipients,
    File,
    Deliverymans,
    Deliverys,
    Delivery_problems,
];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models
            .map((model) => model.init(this.connection))
            .map(
                (model) =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
