import Joi from 'joi';
import joiDate from '@joi/date';
import { PaymentType } from '../@types';
import { IWithdraw } from '../@types/withdraw';


const joi = Joi.extend(joiDate);
const payment = {
    async validatePayment(payload: PaymentType) {
        const schema = joi.object({
            amount: joi.number().min(5000).required().label('Amount must not be less than 5000'),
            description: joi.string().required().label('Description is required'),
            type: joi.string().required().valid('savings', 'withdrawal')
        });
        const { error } = schema.validate(payload);
        if (error) throw error.details[0].context.label;
        return true;
    },
    async validateWithdraw(payload: IWithdraw) {
        const schema = joi.object({
            walletId: joi.string().required().label('WalletId is required'),
            accountNumber: joi.string().max(15).required().label('Account number must not be greater than 15 digits'),
            amount: joi.number().min(1000).required().label('Amount must not be less than 1000'),
            activityType: joi.string().required().valid('Savings', 'withdrawal'),
            reason: joi.string().required().label('Reason is required'),
            bank: joi.string().required().label('Bank is required'),
            description: joi.string().label('Description is required'),
        });
        const { error } = schema.validate(payload);
        if (error) throw error.details[0].context.label;
        return true;
    }
}


export default payment;