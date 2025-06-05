import mongoose from "mongoose";

const viewCountSchema = new mongoose.Schema({
    total: {
        type: Number,
        default: 0,
    },
});

const ViewCount = mongoose.model("ViewCount", viewCountSchema);
export default ViewCount;
