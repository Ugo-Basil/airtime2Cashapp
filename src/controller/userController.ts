import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { userSchema, loginSchema, generateToken, options, updateUserSchema } from '../utility/utils';
import { UserInstance } from '../model/userModel';
import bcrypt from 'bcryptjs';
import mailer from '../mailer/SendMail';
import { emailVerificationView, passwordMailTemplate } from '../mailer/EmailTemplate';
import { deleteImg, uploadImg } from '../cloud/config';
const APP_EMAIL = process.env.POD_GMAIL as string;
const APP_URL = process.env.APP_URL as string;


//User Sign up
export async function registerUser(req: Request, res: Response) {
  try {
    const id = uuidv4();
    const validationResult = userSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const duplicate = await UserInstance.findOne({
      where: {
        [Op.or]: [
          { username: req.body.username },
          { email: req.body.email },
          { phonenumber: req.body.phonenumber }
        ]
      }
    });

    if (duplicate) {
      return res.status(409).json({ msg: 'Enter a unique username, email, or phonenumber' });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 8);
    const user = await UserInstance.create({
      id: id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      password: passwordHash,
      avatar: '',
      verified: false
    });

    if (user) {
      const verifyContext = await bcrypt.hash(passwordHash, 8);
      const verifyToken = generateToken({ reset: verifyContext }, '1d');
      const html = emailVerificationView(id, verifyToken)

      process.env.NODE_ENV !== 'test' && await mailer.sendEmail(APP_EMAIL, req.body.email, "please verify your email", html);
      return res.status(201).json({
        msg: `User created successfully, welcome ${req.body.username}`,
        id
      });
    }
    else {
      return res.status(403).json({ msg: 'Verification mail failed to send' });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to register', route: '/user/register' });
  }
};


//Resends verification mail if user failed to verify at the alloted time
export async function resendVerificationEmail(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await UserInstance.findOne({ where: { id } });
    if (user) {
      const email = user.getDataValue('email');
      const passwordHash = user.getDataValue("password");
      const verifyContext = await bcrypt.hash(passwordHash, 8);
      const verifyToken = generateToken({ reset: verifyContext }, '1d');
      const html = emailVerificationView(id, verifyToken)

      await mailer.sendEmail(APP_EMAIL, email, "please verify your email", html);
      return res.status(200).json({ msg: 'Verification email sent' })
    }
    else {
      return res.status(404).json({ msg: 'User not found' });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to resend verification email', route: '/user/resendVerification' });
  }
}


//User Login
export async function loginUser(req: Request, res: Response) {
  try {
    const validationResult = loginSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }
    const user = await UserInstance.findOne({
      where: {
        [Op.or]: [
          { email: req.body.emailOrUsername },
          { username: req.body.emailOrUsername }
        ]
      }
    });

    if (!user) { return res.status(404).json({ msg: 'User not found' }) };

    const isMatch = await bcrypt.compare(req.body.password, user.getDataValue('password'));
    if (isMatch) {
      if (!user.getDataValue('verified')) {
        return res.status(401).json({ msg: 'Your account has not been verified' });
      }

      const id = user.getDataValue('id');
      const firstname = user.getDataValue('firstname');
      const lastname = user.getDataValue('lastname');
      const username = user.getDataValue('username');
      const email = user.getDataValue('email');
      const phonenumber = user.getDataValue('phonenumber');
      const avatar = user.getDataValue('avatar');
      const role = user.getDataValue('role');
      const wallet = user.getDataValue('wallet');
      const userInfo = { id, firstname, lastname, username, email, phonenumber, avatar, role, wallet };
      const token = generateToken({ id }) as string;
      const production = process.env.NODE_ENV === "production";

      return res.status(200).cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: production,
        sameSite: production ? "none" : "lax"
      }).json({
        msg: 'You have successfully logged in',
        userInfo
      });
    } else {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to authenticate', route: '/user/login' });
  }
};


//Verify User
export async function verifyUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await UserInstance.findOne({ where: { id: id } });

    if (user) {
      const updateVerified = await user.update({ verified: true });
      if (updateVerified) {
        return res.status(200).redirect(`${APP_URL}/login`);
      } else {
        throw new Error('failed to update user')
      }
    } else {
      return res.status(404).json({ msg: 'Verification failed: User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'failed to verify', route: '/user/verify/id' });
  }
};


//Password Reset, Sends an email
export async function forgetPassword(req: Request, res: Response) {
  try {
    const { email } = req.body
    const user = await UserInstance.findOne({ where: { email: email } }) as unknown as { [key: string]: string } as any

    if (user) {
      const id = user.getDataValue('id');
      const resetContext = await bcrypt.hash(user.getDataValue('password'), 8);
      const resetToken = generateToken({ reset: resetContext }, '10m');
      const html = passwordMailTemplate(id, resetToken);
      await mailer.sendEmail(APP_EMAIL, email, "New Account Password", html);
      return res.status(200).json({ msg: "email for password reset sent" });
    } else {
      return res.status(404).json({ msg: "Invalid Email Address, User Not Found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to send password', route: '/user/forgetPassword' });
  }
};


//Creates a token for authentication, redirects to reset form
export async function setResetToken(req: Request, res: Response) {
  try {
    const { token } = req.body;
    const { id } = req.params;
    const production = process.env.NODE_ENV === "production";
    res.cookie('reset', token, {
      maxAge: 10 * 60 * 1000,
      httpOnly: true,
      secure: production,
      sameSite: production ? "none" : "lax"
    }).redirect(`${APP_URL}/forgotPassword/update/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to set reset token', route: '/user/resetPassword' });
  }
};


//User password update
export async function resetPassword(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { password } = req.body
    const user = await UserInstance.findOne({ where: { id: id } })
    if (user) {
      const passwordHash = await bcrypt.hash(password, 8)
      let updatePassword = await user.update({ password: passwordHash });

      if (updatePassword) {
        return res.status(200).json({ msg: "password updated successfully" });
      } else {
        return res.status(400).json({ msg: "failed to update password" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to reset password', route: '/user/resetPassword' });
  }
};


//User Profile Update
export async function updateUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = updateUserSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const { id } = req.params
    const record = await UserInstance.findOne({ where: { id } })
    if (!record || id !== req.user) {
      return res.status(404).json({ msg: "User not found" })
    }

    let avatar: string | undefined = undefined, temp: string = '';
    if (req.body.avatar) {
      const previousValue = record.getDataValue("avatar");

      if (!!previousValue) { temp = previousValue };

      avatar = await uploadImg(req.body.avatar) as string;
      if (!avatar) { throw new Error('Avatar failed to upload') };
    }

    const { firstname, lastname, phonenumber } = req.body;
    await record.update({
      firstname,
      lastname,
      phonenumber,
      avatar
    });

    if (temp) { await deleteImg(temp) };

    return res.status(200).json({
      msg: "You have successfully updated your profile",
      firstname,
      lastname,
      phonenumber,
      avatar: record.getDataValue('avatar')
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "failed to update", route: "/user/update/:id" });
  }
};


//Logout User
export async function logoutUser(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie('token');
    res.status(200).json({ msg: 'You have successfully logged out' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'failed to logout', route: '/user/logout' });
  }
};
