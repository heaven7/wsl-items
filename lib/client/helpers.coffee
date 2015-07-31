AutoForm.hooks insertItemForm:
  onSubmit: (insert, doc) ->
    console.log("onSubmit: " + doc)

  onError: (insert, error, template) ->
  #  console.log error

  onSuccess: (insert, doc)->
    console.log("Item inserted: " + doc)



