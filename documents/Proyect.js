const mongoose = require('mongoose')
const ProyectSchema = mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    created: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('Proyect', ProyectSchema);
