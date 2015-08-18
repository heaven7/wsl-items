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
 * Attach schema
 */

Schemas.add(Schemas.packages(Schemas.Items), Items);
