import mongoose from "mongoose";

const kontaktandmedSchema = new mongoose.Schema({
    telefoninumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

export default mongoose.model('Kontaktandmed', kontaktandmedSchema);
