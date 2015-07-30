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
 * Attach schemas
 */

if(typeof Package['heaven7:wsl-core'] == 'object') {
  Items.attachSchema(Schemas.Base);
}

if(typeof Package['heaven7:wsl-settings'] == 'object') {
    Items.attachSchema(Schemas.Settings);
}

Items.attachSchema(Schemas.Items)