import express from 'express';
import saveMoney from '../controllers/payment/savings';
import TransactionController from "../controllers/transactions";
import PaymentMiddleware from '../middlewares/payment';
import withdrawMoney from '../controllers/payment/withdraw';

const { inspectMakePayment, inspectWithdraw } = PaymentMiddleware;

const router = express.Router();

router.post("/save", inspectMakePayment, saveMoney);
router.post("/withdraw", inspectWithdraw, withdrawMoney);
router.get("/:walletId/transactions", TransactionController.fetchWalletTransactions);
router.post("");


export default router;