import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { withdrawalSchema, options } from "../utility/utils";
import { WithdrawInstance } from "../model/withdrawModel";
import { UserInstance } from '../model/userModel';
import bcrypt from 'bcryptjs';
const Flutterwave = require('flutterwave-node-v3');


//Create Withdrawal
export async function withdrawal(req: Request, res: Response) {
  try {
    const validationResult = withdrawalSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const user = await UserInstance.findOne({ where: { id: req.user } }) as UserInstance;
    const validPass = await bcrypt.compare(req.body.password, user.getDataValue('password'));
    if (!validPass) {
      return res.status(401).json({ msg: "Password should match 'password' on login" });
    }

    const wallet = user?.getDataValue('wallet') as number;
    const { number, amount, code } = req.body;

    if (wallet < amount) {
      return res.status(400).json({ msg: 'Insufficient funds' });
    }

    const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
    const details = {
      account_bank: code,
      account_number: number,
      amount: amount,
      currency: "NGN",
      narration: "Airtime Transfer",
      reference: `${uuidv4()}_PMCK`,
      callback_url: `${process.env.ROOT_URL}/withdrawal/wallet`,
    };

    const payment = await flw.Transfer.initiate(details).then((data: any) => { return data }).catch(console.log);

    if (payment.status === 'error') {
      return res.status(400).json({ msg: payment.message });
    } else {
      await WithdrawInstance.create({
        id: payment.data.id,
        code: payment.data.bank_code,
        bank: payment.data.bank_name,
        name: payment.data.full_name,
        number: payment.data.account_number,
        amount: payment.data.amount,
        status: payment.data.status,
        user: user.getDataValue('id')
      });
    }
    const newWallet = wallet - amount;
    await user.update({ wallet: newWallet });
    return res.status(201).json({ msg: "Processing Withdrawal, Check 'Withdrawal History' to see status" });
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Withdrawal failed', route: '/withdrawal' });
  }
};


//Get a User's Withdrawals
export async function getWithdrawals(req: Request, res: Response) {
  try {
    const withdrawals = await WithdrawInstance.findAll({ where: { user: req.user } });
    if (!withdrawals.length) {
      return res.status(404).json({ msg: 'No withdrawals found' });
    }

    return res.status(200).json({
      msg: 'Here are your Withdrawals',
      withdrawals
    });
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Could not get Withdrawals', route: '/withdrawal/all' });
  }
};


//Withdraw form Wallet
export async function withdraw(req: Request, res: Response) {
  try {
    console.log(req.body);
    const { id } = req.body;
    const withdrawal = await WithdrawInstance.findOne({ where: { id } }) as WithdrawInstance;
    if (!withdrawal) {
      return res.status(404).json({ msg: 'Withdrawal not found' });
    }

    const user = await UserInstance.findOne({ where: { id: req.user } }) as UserInstance;
    const wallet = user?.getDataValue('wallet');

    // const newWallet = wallet - withdrawal.getDataValue('amount');
    // await user.update({ wallet: newWallet });

    // await withdrawal.update({ status: 'completed' });

    return res.status(200).json({ msg: 'Withdrawal successful' });
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'failed to get withdrawals', route: '/' });
  }
};

