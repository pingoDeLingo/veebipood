import mongoose from "mongoose";

const maksestaatusSchema = new mongoose.Schema({
    makseseisund: {
        type: Boolean,
        required: true
    },
    maksmiseTähtaeg: {
        type: Date
    },
    makstudSumma: {
        type: Number
    },
    maksmiseKuupäev: {
        type: Date
    }
});

export default mongoose.model('Maksestaatus', maksestaatusSchema);
