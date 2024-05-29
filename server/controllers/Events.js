// eventController.js

const Event = require("../models/Event");
const CommunityPage = require("../models/Community");

// Add Event Controller
const addEvent = async (req, res) => {
  // Assuming event details are provided in the request body
  const { name, startTime, endTime, authorCommunityId } = req.body;

  // Note: Make sure to replace 'CommunityPage' with the actual name of your community model
  const authorCommunity = await CommunityPage.findById(authorCommunityId);

  if (!authorCommunity) {
    return res.status(404).json({ error: "Author community not found" });
  }

  // Create a new event
  const event = new Event({
    name,
    startTime,
    endTime,
    authorCommunity: authorCommunityId,
  });

  // Save the event to the database
  await event.save();

  // You can customize the response as needed
  res.status(201).json({ message: "Event added successfully", event });
};

// Get All Events Controller
const getAllEvents = async (req, res) => {
  // Retrieve all events and populate the 'authorCommunity' field with community details
  const events = await Event.find();

  // You can customize the response as needed
  res.status(200).json({ events });
};

module.exports = { addEvent, getAllEvents };
