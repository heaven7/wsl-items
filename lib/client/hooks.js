Items.before.insert(function (userId, doc) {
	// items can belong to groups, projects,... or users
    var itemDocType = Session.get('itemDocType') ? Session.get('itemDocType') : 'User';
    var docId = Session.get('itemDocId') ? Session.get('itemDocId') : userId;
    doc.owners = typeof doc.owners == 'array' ? doc.owners : [];
	doc.doc = docId;
	doc.docType = itemDocType;

	doc.owners.push(userId);
	doc.createdAt = Date.now();
});