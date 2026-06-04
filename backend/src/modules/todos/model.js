// TodoList schema fields:
// groupId (ref: Group), creatorId (ref: User), name, templateType (party|trip|project|null)
// tasks [{ description, assignedTo (ref: User), dueDate, completedBy, completedAt,
//           comments [{ userId, text, createdAt }] }]
// archived: Boolean, createdAt

