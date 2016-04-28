/**
 * Item ownership
 */

WSL.collection.addOwnershipBefore(Items)

/**
 * Add location to Items
 */

WSL.collection.addLocation(Items)

/**
 * Remove location after deletion
 */

WSL.collection.removeLocationAfter(Items)

/**
 * Autoform hooks
 */

AutoForm.hooks({
    "insert-item-form": {
        onSubmit: (insert, doc) => {},
        onError: (insert, error, template) => console.log(error),
        onSuccess: (insert, doc) => {
            // clear session
            Session.set('selectedItem', '')

            // clear date values
            clearDateValues()

            wAlert.success(i18n.t('item_sent'))
            $('.submit-item').transition('pulse')
        }
    },
    "edit-item-form": {
        onSubmit: (update, doc) => {},
        onError: (update, error, template) => console.log(error),
        onSuccess: (insert, doc) => Session.set('selectedItem', '')
    }
})