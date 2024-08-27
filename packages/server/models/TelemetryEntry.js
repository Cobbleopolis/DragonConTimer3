import mongoose from "mongoose"

export default mongoose.model('Telemetry', {
    timestamp: {
        type: Date,
        required: true,
        index: true
    },
    eventType: {
        type: String,
        required: true
    },
    oldState: {
        type: Object,
        required: false
    },
    mutationArgs: {
        type: Object,
        required: true
    }
})