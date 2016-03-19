/**
 * Items schema
 * @type {SimpleSchema} Schemas.Items
 */

Schemas.Items = new SimpleSchema([Schemas.Base, {

    title: {
        type: String,
        min: 3
    },

    description: {
        type: String,
        optional: true
    },

    type: {
        type: String,
        allowedValues: ['offer', 'need', 'wish', 'dream'],
        autoform: {
            afFieldInput: {
                type: 'select'
            }
        }
    },

    range: {
        type: Number
    },

    units: {
        type: String,
        allowedValues: ['km', 'm'],
        optional: true
    },

    category: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    }
}])

/**
 * Attach schema
 */

Meteor.startup(function() {
    Schemas.Items.i18n("schemas.items")
    Items.attachSchema(Schemas.Items)
})