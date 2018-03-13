var msg = new builder.Message(session).sourceEvent({ directline: { type: "transfer", agent: "Jesper" } });
session.endDialog(msg);