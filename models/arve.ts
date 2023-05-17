import mongoose from "mongoose";

const arveSchema = new mongoose.Schema({
    kuupäev: {
        type: Date,
        required: true
    },
    arverida: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Arverida',
        required: true
    },
    kogusumma: {
        type: Number,
        required: true
    },
    maksestaatus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Maksestaatus',
        required: true
    },
    klient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Klient',
        required: true
    }
});

export default mongoose.model('Arve', arveSchema);
