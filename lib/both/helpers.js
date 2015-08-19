///////////////////////////////////////////////////
// Collection Helpers
///////////////////////////////////////////////////

/**
 * Get all locations of an item
 * Usage: Items.findOne(_id).locations()
 */
Items.helpers({
    locations: function () {
        return Locations.find({
            doc: this._id
        });
    }
});