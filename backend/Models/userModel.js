import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true,
        trim: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },


    email: {
        type: String,
        required: true,
        unique: true,
        trin: true
    },

    passwordHash: {
        type: String,
        required: true,
    },

    bio: {
        type: String,
        default: "",
    },

    skills: {
        type: [String],
        default: []
    },

    github: {
        type: String,
        default: ""
    },

    website: {
        type: String,
        default: ""
    },

    avatarId: {
        type: String,
        default: ""
    },
},

{ timestamps: true }

)

const User = mongoose.model("User", userSchema);

export default User;