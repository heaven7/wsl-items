Meteor.publish("Items", () => {
    return Items.find({}, {sort: {createdAt: -1}});
});

Meteor.publish("Item", (item_id) => {
    return Items.find(item_id);
});