import mongoose from 'mongoose'

export default mongoose.model('WaitlistEntry', {
    playerName: {
        type: String,
        required: true
    },
    waitingTimestamp: {
        type: Date,
        required: true,
        index: true
    },
    waitingConsole: {
        type: [mongoose.Types.ObjectId],
        required: false
    },
    waitingGame: {
        type: [String],
        required: false
    },
    notes: {
        type: String,
        required: false
    }
})