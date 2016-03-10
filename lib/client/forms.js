Template.editItemForm.events({
    'click .cancel': (e, t) => {
        Session.set('selectedItem', '')
        return false
    }
})
Template.insertItemForm.onCreated(() => {
    const template = Template.instance()
    template.range = new ReactiveVar(5)
    template.units = new ReactiveVar('km')
})
Template.insertItemForm.onRendered(() => {
    this.$('[name="units"]').parent().dropdown('set selected', Template.instance().units.get())
    this.$('.item-options').hide()
})
Template.insertItemForm.events({
    'change [name="range"]': (e,t) => Template.instance().range.set(e.currentTarget.value),
    'change [name="units"]': (e,t) => Template.instance().units.set(e.currentTarget.value),
    'click .toggle-item-options': (e,t) => $('.item-options').toggle('fade'),
    'click .submit-item': (e,t) => {
        $('#insertItemForm').submit()
    }
})

Template.insertItemForm.helpers({
    saveItem: () => i18n.t('save_item'),
    range: () => Template.instance().range.get(),
    rangeLabel: () => {
        const range = Template.instance().range.get()
        const units = Template.instance().units.get()
        let label = `${range} ${units} ` + i18n.t('range')
        return label
    },
    units: () => Template.instance().units.get(),
    tellOthers: () => i18n.t('tell_others')

})