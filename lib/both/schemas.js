/**
 * Items schema
 * @type {SimpleSchema} Schemas.Items
 */

Schemas.Items = new SimpleSchema({

    title: {
        type: String
    },

    description: {
        type: String,
        optional: true
    },

    need: {
        type: Boolean,
        optional: true
    },

    category: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    }
});

/**
 * Attach and extend schemas
 */

Schemas.addBaseTo(Items);
Schemas.add(Schemas.Locations, Items);

// all Schemas belonging to Items
var extend = Schemas.extend(Schemas.Items, [
    Schemas.Base,
    Schemas.Locations
]);
// reassign the extended Schema
Schemas.Items = new SimpleSchema(extend);

Items.attachSchema(Schemas.Items);
