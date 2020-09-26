const mongoose = require('../db.js')

const Schema = mongoose.Schema

const UpdateChatSchema = new Schema({

	type:{ type: Number, default: 0 },

	chatname:{ type: String, required: true },

},{ versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }})

module.exports = mongoose.model('update_chat', UpdateChatSchema,'update_chat')