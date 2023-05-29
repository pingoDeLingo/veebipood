import mongoose from "mongoose";

const maksestaatusSchema = new mongoose.Schema({
    makseseisund: {
        type: Boolean,
        required: true
    },
    maksmiseTahtaeg: {
        type: Date
    },
    makstudSumma: {
        type: Number
    },
    maksmiseKuupaev: {
        type: Date
    }
});

export default mongoose.model('Maksestaatus', maksestaatusSchema);
