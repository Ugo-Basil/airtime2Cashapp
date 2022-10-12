import { Request, Response } from 'express';
import { UserInstance } from '../model/userModel';
import { walletNotification } from '../mailer/EmailTemplate';
import mailer from '../mailer/SendMail'
import { TransactionInstance } from '../model/transactionModel';
const APP_EMAIL = process.env.POD_GMAIL as string;

//Update Wallet
export const creditWallet = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { amountToSell, amountToReceive, email, transactionId } = req.body;
    const user = await UserInstance.findOne({ where: { email } });
    const wallet = user?.getDataValue('wallet') as number || 0;
    const updatedWallet = wallet + Number(amountToReceive);

    if (!user) {
      return res.status(400).json({ message: 'invalid user' });
    }

    const updatedAmount = await user?.update({ wallet: updatedWallet });

    if (updatedAmount) {
      const html = walletNotification(updatedWallet, amountToReceive);
      await mailer.sendEmail(
        APP_EMAIL,
        req.body.email,
        'Wallet successfully credited',
        html
      );
    }

    //update transaction status
    const transaction = await TransactionInstance.findOne({ where: { id: transactionId } });
    if (transaction) {
      await transaction.update({
        status: "sent",
        amountToSell,
        amountToReceive
      });
    }

    return res.status(200).json({
      msg: 'Wallet credited successfully',
      data: updatedWallet
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'failed to update wallet', route: '/user/wallet' });
  }
};


