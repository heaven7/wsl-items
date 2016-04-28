Template.insertItemForm.onCreated(() => {
    const template = Template.instance()
    template.radius = new ReactiveVar(5)
    template.units = new ReactiveVar('km')
})

Template.insertItemForm.onRendered(() => {
    this.$('[name="units"]').parent().dropdown('set selected', Template.instance().units.get())
    this.$('.item-options').hide()

    // daterangepicker
    setDateRangePickerOn('[name="daterange"]')
    clearDateValues()
})

Template.insertItemForm.events({
    'change [name="radius"]': (e,t) => Template.instance().radius.set(e.currentTarget.value),
    'change [name="units"]': (e,t) => Template.instance().units.set(e.currentTarget.value),
    'click .toggle-item-options': (e,t) => $('.item-options').toggle('fade'),
    'click .submit-item': (e,t) => {
        $('#insert-item-form').submit()
    },
    'keydown [name="title"]': (e,t) => {
        if( (!e.ctrlKey && (e.keyCode == 13)) )
            $('#insert-item-form').submit()
    },
    'change [name="daterange"]': (e, t) => {
        const daterange = e.currentTarget.value
        prepareDateFields(daterange)
    }
})

Template.insertItemForm.helpers({
    radius: () => Template.instance().radius.get(),
    radiusLabel: () => {
        const radius = Template.instance().radius.get()
        const units = Template.instance().units.get()
        let label = `${radius} ${units} ` + i18n.t('radius')
        return label
    },
    locationPlaceholder: () => i18n.t('where'),
    tellOthers: () => i18n.t('tell_others'),
    when: () => i18n.t('when')
})

Template.editItemForm.onCreated(function() {
    const template = Template.instance()
    template.radius = new ReactiveVar(Template.currentData().doc.radius)
    template.units = new ReactiveVar('km')
})

Template.editItemForm.onRendered(function() {
    setDateRangePickerOn('[name="daterange"]')
})

Template.editItemForm.events({
    'change [name="radius"]': (e,t) => Template.instance().radius.set(e.currentTarget.value),
    'change [name="units"]': (e,t) => Template.instance().units.set(e.currentTarget.value),
    'click .cancel': (e,t) => {
        Session.set('selectedItem', '')
        return false
    },
    'change [name="daterange"]': (e, t) => {
        const daterange = e.currentTarget.value
        prepareDateFields(daterange)
    }
})

Template.editItemForm.helpers({
    rangeValue: () => Template.instance().radius.get(),
    radiusLabel: () => {
        const radius = Template.instance().radius.get()
        const units = Template.instance().units.get()
        let label = `${radius} ${units} ` + i18n.t('radius')
        return label
    },
    editLocationLabel: () => i18n.t('where'),
    dateRange: () => {
        let from, till, data = Template.currentData().doc
        if(data.from)
            from = mDate.unix2Date(data.from)

        if(data.till)
            till = mDate.unix2Date(data.till)

        console.log(from && till && `${from} - ${till}`)
        return from && till && `${from} - ${till}`
    }
})

