const EventEmitter = require("events");

const appEvents = new EventEmitter();

appEvents.on("userRegistered", (user) => {
  console.log(`[EVENT] New user registered: ${user.email}`);
});

appEvents.on("noteCreated", (note) => {
  console.log(`[EVENT] Note created: ${note.title}`);
});

appEvents.on("chatMessage", (data) => {
  console.log(`[EVENT] Chat message in room "${data.room}"`);
});

module.exports = appEvents;
