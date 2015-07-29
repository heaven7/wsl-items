Items = new Meteor.Collection 'items'
if Meteor.isServer
  Items._ensureIndex({ title: "text" })