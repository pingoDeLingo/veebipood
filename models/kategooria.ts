import mongoose from "mongoose";

const kategooriaSchema = new mongoose.Schema({
    nimetus: {
        type: String,
        required: true
    }
});

export default mongoose.model('Kategooria', kategooriaSchema);
