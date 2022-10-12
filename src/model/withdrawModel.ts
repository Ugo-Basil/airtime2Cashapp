import { DataTypes, Model } from 'sequelize';
import db from '../db/database.config';
import { UserInstance } from './userModel';


interface WithdrawAttributes {
  id: number;
  code: string;
  bank: string;
  name: string;
  number: string;
  amount: string;
  status: string;
  user: string;
}

export class WithdrawInstance extends Model<WithdrawAttributes> { }

WithdrawInstance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Bank code is required'
        },
        notEmpty: {
          msg: 'Bank code cannot be empty'
        }
      }
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
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'An amount is required'
        },
        notEmpty: {
          msg: 'Amount cannot be empty'
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
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
    }
  },
  {
    sequelize: db,
    tableName: 'withdrawals'
  }
);

UserInstance.hasMany(WithdrawInstance, { foreignKey: "user", as: "withdrawals" });

WithdrawInstance.belongsTo(UserInstance, { foreignKey: "user", as: "holder" });
