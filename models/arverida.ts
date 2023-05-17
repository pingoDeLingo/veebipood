import mongoose from "mongoose";

const arveridaSchema = new mongoose.Schema({
    toode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Toode',
        required: true
    },
    kogus: {
        type: Number,
        required: true
    }
});

export default mongoose.model('Arverida', arveridaSchema);
