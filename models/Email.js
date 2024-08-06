import { Schema, model } from 'mongoose';


const emailSchema = new Schema({
    to:
    {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Email = model('Email', emailSchema);
export default Email;