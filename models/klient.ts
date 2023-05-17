import mongoose from "mongoose";

const klientSchema = new mongoose.Schema({
    nimi: {
        type: String,
        required: true
    },
    kontaktandmed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kontaktandmed',
        required: true
    },
    aadress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aadress',
        required: true
    }
});

export default mongoose.model('Klient', klientSchema);
