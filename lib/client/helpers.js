AutoForm.hooks({
  insertItemForm: {
    onSubmit: function(insert, doc) {},
    onError: function(insert, error, template) {
      return console.log(error);
    },
    onSuccess: function(insert, doc) {}
    }
});

Meteor.subscribe('items');

