Meteor.methods({
  updateItem: function(doc) {
    check(doc, Schemas.Items);
    this.unblock();
    return Items.update({
      id: this._id
    }, {
      $set: doc
    }, function(error) {
      if (error) {
        console.log('Error: ' + error);
      }
      console.log('update successful');
      return true;
    });
  },
  deleteItem: function(doc) {
    this.unblock();
    return Items.remove({
      _id: doc._id
    });
  }
});