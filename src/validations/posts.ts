import Joi from 'joi';
import joiDate from '@joi/date';
import { IPost } from '../@types/post';


const joi = Joi.extend(joiDate);
const post = {
    async validatePost(payload: IPost) {
        const schema = joi.object({
            author: joi.string().required().label('Author is required'),
            title: joi.string().required().label('Title is required'),
            body: joi.string().required().label('Body is required')
        });
        const { error } = schema.validate(payload);
        if (error) throw error.details[0].context.label;
        return true;
    }
}


export default post;