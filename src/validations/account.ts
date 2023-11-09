import Joi from 'joi';
import joiDate from '@joi/date';
import { IAccount } from '../@types/account';


const joi = Joi.extend(joiDate);
const account = {
    async validateAccount(payload: IAccount) {
        const schema = joi.object({
            accountNumber: joi.string().required().label('Account Number is required'),
            bank: joi.string().required().label('Bank is required'),
        });
        const { error } = schema.validate(payload);
        if (error) throw error.details[0].context.label;
        return true;
    }
}


export default account;