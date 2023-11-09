import express from 'express';
import TransactionController from "../controllers/transactions"

const router = express.Router();

router.get("/:id", TransactionController.fetchTransactionsById);

export default router;