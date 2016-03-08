Template.editItemForm.events({
    'click .cancel': (e, t) => {
        Session.set('selectedItem', '')
        return false
    }
})

Template.insertItemForm.helpers({ saveItem: () => i18n.t('save_item') })