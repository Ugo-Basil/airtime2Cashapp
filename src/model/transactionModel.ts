import { DataTypes, Model } from 'sequelize';
import db from '../db/database.config';
import { UserInstance } from './userModel';


interface TransactionAttributes {
  id: string;
  network: string;
  phoneNumber: string;
  userId: string;
  amountToSell: number;
  amountToReceive: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'sent';
}

export class TransactionInstance extends Model<TransactionAttributes> { }

TransactionInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    network: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amountToSell: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    amountToReceive: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    userId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: 'transactions'
  }
);


UserInstance.hasMany(TransactionInstance, { foreignKey: "userId", as: "transfers" });
TransactionInstance.belongsTo(UserInstance, { foreignKey: "userId", as: "customer" });
