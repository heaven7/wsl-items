/**
 * Items Mongo Collection
 * @type {Mongo.Collection} Items
 */

Items = new Meteor.Collection('items');

/**
 * Search index
 */

WSL.search.addIndex(Items, ['title'], 'mongodb')

if(Meteor.isServer)
    Items._ensureIndex({ title: "text" })