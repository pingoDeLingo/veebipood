import mongoose from "mongoose";

const toodeSchema = new mongoose.Schema({
    nimetus: {
        type: String,
        required: true
    },
    kategooria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kategooria',
        required: true
    },
    hind: {
        type: Number,
        required: true
    },
    pildiURL: {
        type: String,
        required: true
    },
    aktiivne: {
        type: Boolean,
        default: true
    },
    laokogus: {
        type: Number,
        default: 0
    },
    vananemisaeg: {
        type: Date
    }
});

export default mongoose.model('Toode', toodeSchema);
