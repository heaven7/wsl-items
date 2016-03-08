AutoForm.hooks({
    insertItemForm: {
        onSubmit: (insert, doc) => {},
        onError: (insert, error, template) => {
          return console.log(error)
        },
        onSuccess: (insert, doc) => {
            Session.set('selectedItem', '')
        }
    },
    editItemForm: {
        onSubmit: (update, doc) => {},
        onError: (update, error, template) => {
            return console.log(error)
        },
        onSuccess: (insert, doc) => {
            Session.set('selectedItem', '')
            console.log('edit item success')
        }
    }
})

Template.registerHelper("itemTypes", function() {
    return [
        {label: i18n.t('choose'), value: ''},
        {label: i18n.t('offer'), value: 'offer'},
        {label: i18n.t('need'), value: 'need'},
        {label: i18n.t('wish'), value: 'wish'},
        {label: i18n.t('dream'), value: 'dream'}
    ]
})

