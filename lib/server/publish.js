Meteor.publish(null, () => {
    return Items.find();
});

Meteor.publish("Items", () => {
    return Items.find();
});

Meteor.publish("Item", (item_id) => {
    return Items.find(item_id);
});