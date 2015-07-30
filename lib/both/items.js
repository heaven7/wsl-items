Items = new Meteor.Collection('items');

/**
 * Ensure index
 */

if(Meteor.isServer) {
    Items._ensureIndex({ title: "text" });
}
