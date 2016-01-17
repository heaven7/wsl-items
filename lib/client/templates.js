Template.itemsList.helpers({
    items: function() {
        var tItems;
        tItems = Items.find();
        if (tItems.count() === 0) {
            return false;
        } else {
            return tItems;
        }
    }
});

Template.itemsList.events({
    'click .editItem': function(e, t) {
        return Session.set('selectedItem', this._id);
    },
    'click .deleteItem': function(e, t) {
        return Meteor.call('deleteItem', this, function(error, result) {
            if (error) {
                console.log('Error: ' + error);
            }
            return true;
        });
    }
});

Template.item.helpers({
    selectedItem: function() {
        return Session.get('selectedItem') === this._id;
    }
});