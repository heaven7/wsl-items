Template.itemsList.onCreated(function() { this.subscribe("Items") })

Template.itemsList.helpers({
    items: function() {
        var tItems
        tItems = Items.find()
        if (tItems.count() === 0) return false
        else return tItems
    }
})

Template.item.events({
    'click .editItem': (e, t) => Session.set('selectedItem',  t.data._id),
    'click .deleteItem': (e, t) => {
        const id = t.data._id
        const confirmDeletion = confirm( i18n.t("confirm_delete_item") )

        if (confirmDeletion) {
            Items.remove(id)
            if(!Items.findOne(id))
                wAlert.success(i18n.t('successfully_deleted'))

        }
    }
})

Template.item.helpers({
    selectedItem: () => Session.get('selectedItem') === Template.currentData()._id,
    owner: () => Meteor.users.find(Template.currentData().owners[0])
})
