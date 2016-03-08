Template.itemsList.onCreated(function() { this.subscribe("Items") })

Template.itemsList.helpers({
    items: function() {
        var tItems
        tItems = Items.find()
        if (tItems.count() === 0) return false
        else return tItems
    }
})

Template.itemsList.events({
    'click .editItem': (e, t) => Session.set('selectedItem', this._id),
    'click .deleteItem': (e, t) => {
        return Meteor.call('deleteItem', this, function(error, result) {
            if (error)
                console.log('Error: ' + error)

            return true
        })
    }
})

Template.item.helpers({ selectedItem: () => Session.get('selectedItem') === this._id })
