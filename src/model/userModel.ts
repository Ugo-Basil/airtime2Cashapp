import { DataTypes, Model } from 'sequelize';
import db from '../db/database.config';
import bcrypt from 'bcryptjs';

interface UsersAttributes {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phonenumber: string
  password: string;
  avatar: string;
  verified: boolean;
  wallet?: number;
  role?: 'user' | 'admin' | 'superadmin';
}

export class UserInstance extends Model<UsersAttributes> { }

UserInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Enter your firstname'
        },
        notEmpty: {
          msg: 'Please provide a firstname'
        }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Enter your lastname'
        },
        notEmpty: {
          msg: 'Please provide a lastname'
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Enter a username'
        },
        notEmpty: {
          msg: 'Please provide a username'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'email is required'
        },
        isEmail: {
          msg: 'Please provide a a valid Email'
        }
      }
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Phone Number is required'
        },
        notEmpty: {
          msg: 'Please provide a a valid Phone Number'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        }
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    wallet: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    role: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize: db,
    tableName: 'users'
  }
);

const superadmin = {
  id: process.env.SUPERADMIN_ID as string,
  firstname: process.env.SUPERADMIN_FIRSTNAME as string,
  lastname: process.env.SUPERADMIN_LASTNAME as string,
  username: process.env.SUPERADMIN_USERNAME as string,
  email: process.env.SUPERADMIN_EMAIL as string,
  phonenumber: process.env.SUPERADMIN_PHONENUMBER as string,
  password: process.env.SUPERADMIN_PASSWORD as string,
}

UserInstance.findOrCreate({
  where: {
    id: superadmin.id,
    firstname: superadmin.firstname,
    lastname: superadmin.lastname,
    username: superadmin.username,
    email: superadmin.email,
    phonenumber: superadmin.phonenumber,
    password: bcrypt.hashSync(superadmin.password, 8),
    avatar: '',
    verified: true,
    role: 'superadmin'
  }
}).then(([user, created]) => {
  if (created) {
    console.log('Super Admin created successfully');
  } else if (user) {
    console.log('Super Admin already seeded');
  }
}, (err) => {
  if (err.name === "SequelizeUniqueConstraintError") {
    console.log('Super Admin seeded');
  }
});
