import { Schema, model, Document } from 'mongoose'

export interface UserDocument extends Document {
    name: string,
    classNumber: number,
    email: string,
    password: string,
    phone: string,
    dob: Date,
    photo: string
}

interface User {
    name: string,
    classNumber: number,
    email: string,
    password: string,
    phone: string,
    dob: Date,
    photo: string
}



const userSchema = new Schema<User>({
    name: {
        type: String,
        required: true
    },
    classNumber: {
        type: Number,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true
    },
    photo: {
        type: String
    }
})

const UserModel = model<User>('User', userSchema)

export default UserModel;