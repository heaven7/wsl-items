Meteor.publish(null, function() {
    return Items.find();
});