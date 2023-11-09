import express from "express";
const router = express.Router();
import inspectAccount from "../middlewares/acount";
import resolveAccountNumber from "../controllers/payment/utils";

router.get('/resolve', inspectAccount, resolveAccountNumber);

export default router;