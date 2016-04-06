Meteor.publish("Items", (field, specifier) => {
    if(field && specifier) {
        return Items.find({}, {sort: [field, specifier]})
    }
    return Items.find({}, {sort: {createdAt: -1}})
})

Meteor.publish("Item", (item_id) => {
    return Items.find(item_id)
})