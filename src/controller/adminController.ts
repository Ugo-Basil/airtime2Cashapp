import { Request, Response } from "express";
import { UserInstance } from "../model/userModel";

export async function elevateToAdmin(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await UserInstance.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    } else {
      await user.update({ role: "admin" });
      return res.status(200).json({ msg: "User elevated to admin" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'failed to elevate user to admin', route: '/admin/add' });
  }
}


export async function revokeAdmin(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await UserInstance.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    } else {
      await user.update({ role: "user" });
      return res.status(200).json({ msg: "Admin role revoked" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'failed to revoke admin privileges', route: '/admin/revoke/'});
  }
}
