Template.itemsList.onCreated(function() {
    this.autorun(() => {
        this.subscribe("Items")
    })
})

Template.itemsList.helpers({
    items: () => {
        var tItems
        tItems = Items.find({}, {sort: {createdAt: -1}})
        if (tItems.length == 0) return false
        else return tItems
    },
    itemSegments: () => {
        const items = Items.find().fetch()
        let data = items.map(i => {
            return {
                labelType: mDate.timeAgo(i.createdAt),
                label: i18n.t(i.type),
                labelClass: "attached top",
                class: "existing",
                template: "item",
                data: i
            }
        })
        return data
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
    selectedItem: () => {
        return Session.get('selectedItem') === Template.currentData()._id
    },
    owner: () => Meteor.users.find(Template.currentData().owners[0]),
    isItemOwner: () => Meteor.userId() === Template.currentData().owners[0]
})
