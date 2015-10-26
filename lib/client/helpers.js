AutoForm.hooks({
  insertItemForm: {
    onSubmit: function(insert, doc) {},
    onError: function(insert, error, template) {
      return console.log(error);
    },
    onSuccess: function(insert, doc) {
        Session.set('selectedItem', '');
    }
  }
});

Meteor.subscribe('items');

