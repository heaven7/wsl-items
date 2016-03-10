AutoForm.hooks({
    insertItemForm: {
        onSubmit: (insert, doc) => {},
        onError: (insert, error, template) => {
          return console.log(error)
        },
        onSuccess: (insert, doc) => {
            Session.set('selectedItem', '')
            wAlert.success(i18n.t('item sended'))
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
            check(doc, Schemas.Items)

            Items.update({
                id: this._id
            }, doc, function(error, result) {
                if (error)
                    throw new Meteor.Error('Error: ' + error)

                if(result)
                    console.log('update item successfully')
            })
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

Template.registerHelper("unitTypes", function() {
    return [
        {label: i18n.t('choose'), value: ''},
        {label: i18n.t('m'), value: 'm'},
        {label: i18n.t('km'), value: 'km'}
    ]
})

