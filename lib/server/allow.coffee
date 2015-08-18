
Items.allow
  insert: (userId, doc) ->
  	if(userId.indexOf(doc.owners) > -1)
    	true
  update: (userId, doc, fields, modifier) ->
    userId == doc.owner
    #true
  remove: (userId, doc) ->
    userId == doc.owner