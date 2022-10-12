import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { accountSchema, updateAccountSchema, options } from '../utility/utils';
import { AccountInstance } from '../model/accountModel';
import { UserInstance } from '../model/userModel';
import { getBanks, cachedBanks } from '../utility/flutter';

//Create Account
export async function createAccount(req: Request, res: Response) {
  try {
    const validationResult = accountSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const { bank, name, number } = req.body;
    await getBanks();
    const { code } = cachedBanks.find((bankObj: any) => bankObj.name === bank);

    const account = await AccountInstance.findOne({ where: { number } });
    if (account) {
      return res.status(409).json({ msg: 'Account already exists' });
    }

    const holder = await UserInstance.findOne({ where: { id: req.user } }) as UserInstance;
    if (!name.includes(holder.getDataValue('firstname')) || !name.includes(holder.getDataValue('lastname'))) {
      return res.status(400).json({
        msg: 'Account name does not match user details',
      });
    }

    const id = uuidv4();
    const newAccount = await AccountInstance.create({
      id,
      bank,
      name,
      number,
      user: holder.getDataValue('id'),
      bankCode: code
    });

    return res.status(201).json({
      msg: 'Account created successfully',
      data: newAccount
    });
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'failed to add account', route: '/account/add' });
  }
};


//Get Account
export async function getAccounts(req: Request, res: Response) {
  try {
    const accounts = await AccountInstance.findAll({ where: { user: req.user } });
    if (!accounts.length) {
      return res.status(404).json({ msg: 'No accounts found' });
    }

    return res.status(200).json({
      msg: 'Accounts retrieved successfully',
      accounts
    });
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'failed to get accounts', route: '/account' });
  }
};


//Update Account
export async function updateAccount(req: Request, res: Response) {
  try {
    const validationResult = updateAccountSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const { id } = req.params;
    const account = await AccountInstance.findOne({ where: { id, user: req.user } });

    if (!account) {
      return res.status(404).json({ msg: 'Account not found' });
    }

    const updatedAccount = await account.update(req.body);
    return res.status(200).json({
      msg: 'Account updated successfully',
      data: updatedAccount
    });
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'failed to update account', route: 'account/update/' + req.params.id });
  }
};


//Delete Account
export async function deleteAccount(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const account = await AccountInstance.findOne({ where: { id, user: req.user } });

    if (!account) {
      return res.status(404).json({ msg: 'Account not found' });
    }

    await AccountInstance.destroy({ where: { id } });

    return res.status(200).json({ msg: 'Account deleted successfully' });
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'failed to delete account', route: 'account/delete/' + req.params.id });
  }
};
