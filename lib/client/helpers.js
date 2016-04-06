AutoForm.hooks({
    insertItemForm: {
        onSubmit: (insert, doc) => {},
        onError: (insert, error, template) => {
          return console.log(error)
        },
        onSuccess: (insert, doc) => {
            Session.set('selectedItem', '')
            wAlert.success(i18n.t('item_sent'))
            $('.submit-item').transition('pulse')
        }
    },
    editItemForm: {
        onSubmit: (update, doc) => {},
        onError: (update, error, template) => {
            return console.log(error)
        },
        onSuccess: (insert, doc) => {
            Session.set('selectedItem', '')
        }
    }
})

Template.registerHelper("itemTypes", function() {
    return [
        {label: i18n.t('choose'), value: ''},
        {label: i18n.t('offer'), value: 'offer', icon: 'icon gift'},
        {label: i18n.t('need'), value: 'need', icon: 'icon fire'},
        {label: i18n.t('wish'), value: 'wish', icon: 'icon wizard'},
        {label: i18n.t('dream'), value: 'dream', icon: 'icon cloud'}
    ]
})

