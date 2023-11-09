import { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { Toolbox } from '../../utils';

async function verifyToken(req: Request, res: Response) {
  try {
    const { token } = req.query;
    const { email } = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string as string
    ) as any;
    const user = (await User.findOne({ email })) as any;
    if (user.isActive) {
      return res.sendFile(path.join(__dirname, '../../templates/validate2.html'));
    }
    user.isActive = true;
    user.hasLoggedIn = true;
    await user.save();
    res.sendFile(path.join(__dirname, '../../templates/validate.html'));
  } catch (error) {
    res.sendFile(path.join(__dirname, '../../templates/fail.html'));
  }
}

export default verifyToken;
