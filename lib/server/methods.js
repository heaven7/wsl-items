Meteor.methods({
  updateItem: function(doc) {
    check(doc, Schemas.Items)
    this.unblock()
    return Items.update({
      id: this._id
    }, doc, function(error, result) {
      if (error) {
        throw new Meteor.Error('Error: ' + error)
      }
      if(result) {
          console.log('update successful')
          return true
      }
    })
  },
  deleteItem: function(doc) {
    this.unblock()
    return Items.remove({
      _id: doc._id
    })
  }
})