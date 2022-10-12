import { DataTypes, Model } from 'sequelize';
import db from '../db/database.config';
import { UserInstance } from './userModel';


interface AccountAttributes {
  id: string;
  bank: string;
  name: string;
  number: string;
  user: string;
  bankCode: string;
}

export class AccountInstance extends Model<AccountAttributes> { }

AccountInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    bank: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Bank name is required'
        },
        notEmpty: {
          msg: 'Bank name cannot be empty'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Account holder name is required'
        },
        notEmpty: {
          msg: 'Account holder name cannot be empty'
        }
      }
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Account number is required'
        },
        notEmpty: {
          msg: 'Account number cannot be empty'
        }
      }
    },
    user: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'User id is required'
        },
        notEmpty: {
          msg: 'User id cannot be empty'
        }
      }
    },
    bankCode: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize: db,
    tableName: 'accounts'
  }
);

UserInstance.hasMany(AccountInstance, { foreignKey: "user", as: "accounts" });

AccountInstance.belongsTo(UserInstance, { foreignKey: "user", as: "holder" });
