import { Request, Response, NextFunction } from "express";
import { verify } from 'jsonwebtoken';
import { UserInstance } from "../model/userModel";
import bcrypt from 'bcryptjs';

const secret = process.env.JWT_SECRET as string;

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization && !req.cookies.token) {
      return res.status(401).json({ msg: "Authentication required. Please login" })
    }

    const token = authorization?.slice(7) || req.cookies.token as string;
    const verified = verify(token, secret);
    if (!verified) {
      return res.status(401).json({ msg: "Token expired/invalid. Please login" });
    }

    const { id } = verified as { [key: string]: string };
    const user = await UserInstance.findOne({ where: { id } });
    if (!user) {
      return res.status(401).json({ msg: "User could not be identified" });
    }

    req.role = user.getDataValue('role');
    req.user = id;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Unexpected Auth error" });
  }
};


export async function adminAuth(req: Request, res: Response, next: NextFunction) {
  if (req.role === 'admin' || req.role === 'superadmin') {
    next();
  } else {
    return res.status(401).json({ msg: "You are not authorized to access this route" });
  }
};


export async function superAdminAuth(req: Request, res: Response, next: NextFunction) {
  if (req.role === 'superadmin') {
    next();
  } else {
    return res.status(401).json({ msg: "You are not authorized to access this route" });
  }
};


export async function oneTimeTokenAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!req.cookies.reset && !req.body.token) {
      return res.status(401).json({ msg: "Resend the mail you requested and use it in less than 10 minutes" })
    }

    const token = req.cookies.reset || req.body.token;
    const verified = verify(token, secret);
    if (!verified) {
      return res.status(401).json({ msg: "Token expired/invalid. Please request a new email" });
    }

    const { reset } = verified as { [key: string]: string };
    const user = await UserInstance.findOne({ where: { id } });
    if (!user) {
      return res.status(401).json({ msg: "User could not be identified" });
    }

    const hash = user?.getDataValue('password');
    const isMatch = await bcrypt.compare(hash, reset)
    if (isMatch) {
      res.clearCookie('reset');
      next();
    } else {
      return res.status(401).json({ msg: "Token expired/invalid. Please request a new email" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Unexpected Auth error" });
  }
};
