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

// merge together schemas to extend Schemas.Items
var merged = Schemas.packages(Schemas.Items);

// reassign the merged schema
Schemas.Items = new SimpleSchema(merged);

Schemas.add(Schemas.Items, Items);
