Template.editItemForm.events({
    'click #cancelUpdate': function(e, t) {
        Session.set('selectedItem', '');
        return false;
    }
});