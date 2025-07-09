import mongoose from "mongoose";

const breadSchema = new mongoose.Schema({
    text: {type: String, require: true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    parentId: {
        type: String
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bread"
        }
    ]
});

const Bread = mongoose.models.Bread || mongoose.model('Bread', breadSchema);

export default Bread;