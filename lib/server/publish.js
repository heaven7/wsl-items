Meteor.publish("Items", (field, specifier) => {

    if(field && specifier) {
        check(field, [String, undefined])
        check(specifier, [String, undefined])
        return Items.find({}, {sort: [field, specifier]})
    }
    return Items.find({}, {sort: {createdAt: -1}})
})

Meteor.publish("Item", (item_id) => {
    check(item_id, String)
    return Items.find(item_id)
})