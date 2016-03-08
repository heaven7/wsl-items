/**
 * Items schema
 * @type {SimpleSchema} Schemas.Items
 */

Schemas.Items = new SimpleSchema([Schemas.Base, {

    title: {
        type: String
    },

    description: {
        type: String,
        optional: true
    },

    type: {
        type: String,
        allowedValues: ['offer', 'need', 'wish', 'dream'],
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'select'
            }
        }
    },

    category: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    }
}]);

/**
 * Attach schema
 */

Items.attachSchema(Schemas.Items);
