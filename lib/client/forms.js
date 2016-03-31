Template.insertItemForm.onCreated(() => {
    const template = Template.instance()
    template.radius = new ReactiveVar(5)
    template.units = new ReactiveVar('km')
})
Template.insertItemForm.onRendered(() => {
    this.$('[name="units"]').parent().dropdown('set selected', Template.instance().units.get())
    this.$('.item-options').hide()
})
Template.insertItemForm.events({
    'change [name="radius"]': (e,t) => Template.instance().radius.set(e.currentTarget.value),
    'change [name="units"]': (e,t) => Template.instance().units.set(e.currentTarget.value),
    'click .toggle-item-options': (e,t) => $('.item-options').toggle('fade'),
    'click .submit-item': (e,t) => {
        $('#insertItemForm').submit()
    }
})

Template.insertItemForm.helpers({
    saveItem: () => i18n.t('save_item'),
    radius: () => Template.instance().radius.get(),
    radiusLabel: () => {
        const radius = Template.instance().radius.get()
        const units = Template.instance().units.get()
        let label = `${radius} ${units} ` + i18n.t('radius')
        return label
    },
    units: () => Template.instance().units.get(),
    tellOthers: () => i18n.t('tell_others')

})

Template.editItemForm.onCreated(() => {
    const template = Template.instance()
    template.radius = new ReactiveVar(Template.currentData().doc.radius)
    template.units = new ReactiveVar('km')
})


Template.editItemForm.events({
    'change [name="radius"]': (e,t) => Template.instance().radius.set(e.currentTarget.value),
    'change [name="units"]': (e,t) => Template.instance().units.set(e.currentTarget.value),
    'click .cancel': (e,t) => {
        Session.set('selectedItem', '')
        return false
    }
})

Template.editItemForm.helpers({
    rangeValue: () => {
        return Template.instance().radius.get()
    },
    radiusLabel: () => {
        const radius = Template.instance().radius.get()
        const units = Template.instance().units.get()
        let label = `${radius} ${units} ` + i18n.t('radius')
        return label
    }
})