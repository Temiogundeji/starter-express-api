import { Router } from 'express';
import user from './user';
import auth from './auth';
import wallet from './wallet';
import transaction from './transaction';
import webhook from './webhook';
import post from './post';
import account from './account';
import chat from './chat';

import { Authentications } from '../middlewares';

const { authenticate } = Authentications;
const router = Router();

router.use('/auth', auth);
router.use('/users', authenticate, user);
router.use('/wallets', authenticate, wallet);
router.use('/transactions', authenticate, transaction);
router.use('/posts', authenticate, post);
router.use('/payment', webhook);
router.use('/accounts', account);
router.use('/chats', authenticate, chat);

export default router;
