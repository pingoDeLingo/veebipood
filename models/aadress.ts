import mongoose from "mongoose";

const aadressSchema = new mongoose.Schema({
    tanav: {
        type: String,
        required: true
    },
    maja: {
        type: String,
        required: true
    },
    linn: {
        type: String,
        required: true
    },
    postiindeks: {
        type: String,
        required: true
    }
});

export default mongoose.model('Aadress', aadressSchema);
