Items.before.insert(function (userId, doc) {
	// to do: make items polymorph
	doc.doc = userId;
	doc.docType = 'User';

	doc.owners = [userId];
	doc.createdAt = Date.now();
});