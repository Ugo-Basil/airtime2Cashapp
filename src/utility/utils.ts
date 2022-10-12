import Joi from 'joi';
import jwt from 'jsonwebtoken';


//Joi validation options
export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
};


//User Sign up schema
export const userSchema = Joi.object().keys({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().trim().lowercase().required(),
  phonenumber: Joi.string().regex(/^[0-9]{11}$/).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  confirm_password: Joi.ref('password')
}).with('password', 'confirm_password');


//User Login schema
export const loginSchema = Joi.object().keys({
  emailOrUsername: Joi.string().trim().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
})


//update User profile
export const updateUserSchema = Joi.object().keys({
  firstname: Joi.string(),
  lastname: Joi.string(),
  phonenumber: Joi.string().regex(/^[a-zA-Z0-9]{11}$/),
  avatar: Joi.string()
});


//add Account details
export const accountSchema = Joi.object().keys({
  bank: Joi.string().required(),
  name: Joi.string().required(),
  number: Joi.string().length(10).required(),
});


//update Account details
export const updateAccountSchema = Joi.object().keys({
  name: Joi.string(),
  number: Joi.string().length(10)
});


//withdrawal schema
export const withdrawalSchema = Joi.object().keys({
  bank: Joi.string(),
  name: Joi.string(),
  number: Joi.string().length(10),
  code: Joi.string(),
  amount: Joi.string().required().regex(/^[0-9]{3,6}$/),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
});


//Transaction schema
export const transferAirtimeSchema = Joi.object().keys({
  network: Joi.string().required(),
  phoneNumber: Joi.string().regex(/^[a-zA-Z0-9]{11}$/).required(),
  amountToSell: Joi.number().min(50).max(5000).required(),
  amountToReceive: Joi.number(),
});


//Token Generator function for login sessions
export const generateToken = (user: { [key: string]: unknown }, time: string = '7d'): unknown => {
  const pass = process.env.JWT_SECRET as string;
  return jwt.sign(user, pass, { expiresIn: time });
};


//function for paginating transactions
export const getPagination = (page: number, size: number) => {
  const limit = size ? size : 15;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};
