import Joi from 'joi';
import joiDate from '@joi/date';
import { ChangeStatusType, RegisterType } from '../@types';

const joi = Joi.extend(joiDate);

const user = {
    async validateSignUp(payload: RegisterType) {
        const schema = joi.object({
            firstName: joi.string().required().label('First name is required'),
            lastName: joi.string().required().label('Last name is required'),
            email: joi.string().email().required().label('A valid email is required'),
            password: joi.string().min(5).required().label('Password is required.'),
            phoneNumber: joi.string().min(11).required().label('Phone number is required'),
            accountNumber: joi.string().min(10).label('Account number is required'),
            staffId: joi.string().required().label('Staff ID  is required'),
            roles: joi.array().max(2).label('User roles is required'),
            gender: joi.string().required().valid('male', 'female'),
            staffType: joi.string().required().valid('teaching', 'non-teaching')
        });
        const { error } = schema.validate(payload);
        if (error) throw error.details[0].context.label;
        return true;
    },
    async validateAuth(payload: RegisterType) {
        const schema = joi.object({
            email: joi.string().email().required().label('A valid email is required'),
            password: joi
                .string()
                .min(4)
                .optional()
                .label('Invalid or missing pin. It must be 4 digits'),
            tempToken: joi.string().min(6).max(6).optional().label('Invalid or missing token'),
        });
        const { error } = schema.validate(payload);
        if (error) throw error.details[0].context.label;
        return true;
    },
    async validateVerifyToken(payload: RegisterType) {
        const schema = joi.object({
            token: joi.string().required().label('Invalid or missing token in query'),
        });
        const { error } = schema.validate(payload);
        if (error) throw error.details[0].context.label;
        return true;
    },
    async validateToggleStatus(payload: ChangeStatusType) {
        const schema = joi.object({
            deactivate: joi.boolean().required().label('Invalid or missing request body.'),
            id: joi.string().required().label('Invalid or missing request body.'),
        });
        const { error } = schema.validate(payload);
        if (error) throw error.details[0].context.label;
        return true;
    },
};

export default user;
