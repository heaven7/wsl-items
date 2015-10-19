
Items.allow
  insert: (userId, doc) ->
  	if(doc.owners.indexOf(userId) > -1)
    	true
  update: (userId, doc, fields, modifier) ->
    userId == doc.owner
    #true
  remove: (userId, doc) ->
    userId == doc.owner