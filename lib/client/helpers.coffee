AutoForm.hooks insertItemForm:
  onSubmit: (insert, doc) ->
#    console.log("onSubmit: " + doc)

  onError: (insert, error, template) ->
#    console.log error

  onSuccess: (insert, doc)->
#    console.log(doc);
    #search = Session.get('locationString');
    #if(search)
    #  WSL.locations.geocode(search);
    #  Meteor.call('addLocationToItem', doc, Session.get('locationLatLng'));




