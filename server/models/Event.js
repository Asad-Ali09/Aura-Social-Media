const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  authorCommunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CommunityPage", // Reference to the CommunityPage model
    required: true,
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
