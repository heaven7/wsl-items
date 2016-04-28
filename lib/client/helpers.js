Template.registerHelper("itemTypes", function() {
    return [
        {label: i18n.t('choose'), value: ''},
        {label: i18n.t('offer'), value: 'offer', icon: 'icon gift'},
        {label: i18n.t('need'), value: 'need', icon: 'icon fire'},
        {label: i18n.t('wish'), value: 'wish', icon: 'icon wizard'},
        {label: i18n.t('idea'), value: 'idea', icon: 'icon cloud'}
    ]
})

