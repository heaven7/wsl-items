
searchOnSelect = (instance) => {
    WSL.search.onSelect = (result) => {
        console.log('itemsFilter search select')
        instance.itemsSearchByPlace.set(result.title)
        Session.set('locationLatLng', null)
    }


    let radius = instance.itemsSearchByPlaceRadius.get()
    let place = instance.itemsSearchByPlace.get()
    if(place && radius) {
        // get the items found in a certain place and radius
        searchByPlace(place, radius)

        // zoom and pan map to given location
        WSL.locations.geocode(place)
        let location = Session.get('locationLatLng')
        let zoom = parseInt(Math.floor(-0.049 * parseInt(radius)) + 15)

        if(location)
            WSL.map.setToLocation(location, zoom)
    }
}

/**
 * Sorting helper
 * @param {String} field
 * @param {Object} event
 */

sortByField = (event, field) => {
    Session.set('itemType', null)
    event.preventDefault()
    let target = $(event.currentTarget)
    target.toggleClass('asc desc')
    Session.set('sortField', field)
    let specifier = $(event.currentTarget).hasClass('asc') ? 'asc': 'desc'
    Session.set('sortSpecifier', specifier)
}

/**
 * Get items at a certain location
 * and pass on result to segment data
 * @param {String} place
 * @param {Number} radius
 */

searchByPlace = (place, radius) => {
    if(place && radius) {
        Meteor.call('getItemsAtLocation', Items._name, place, radius, (err, items) => {
            if(err)
                console.log(err)
            if(items)
                setSegmentData(items)
        })
    }
}

/**
 * Set segment data
 * @param {Object} items
 */

setSegmentData = (items) => {
    let segmentData = items.map(i => {
        let typeIcon, typeColor
        switch(i.type) {
            case 'offer':
                typeIcon = 'gift'
                typeColor = 'green'
                break
            case 'need':
                typeIcon = 'fire'
                typeColor = 'red'
                break
            case 'wish':
                typeIcon = 'wizard'
                typeColor = 'purple'
                break
            case 'dream':
                typeIcon = 'cloud'
                typeColor = 'violet'
                break
        }
        return {
            sticky: true,
            segments: [
                {
                    labelType: mDate.timeAgo(i.createdAt),
                    labelIcon: `${typeIcon} ${typeColor}`,
                    label: i18n.t(i.type),
                    labelClass: `attached top`,
                    class: 'existing',
                    template: 'item',
                    data: i
                },
                {
                    class: ' secondary',
                    template: 'itemBottom',
                    data: i
                }
            ]
        }
    })
    if(segmentData) {
//        console.log(segmentData)
        Session.set('segmentData', segmentData)
    }
}

/**
 * Daterangepicker helper
 */

setDateRangePickerOn = (el) => {
    $(el).daterangepicker({
        "autoApply": true,
        "opens": "center",
//        "timePicker": true,
//        "timePickerIncrement": 15,
//        "timePicker24Hour": true,
        "locale": {
            "format": WSL.ui.date.format,
            "separator": WSL.ui.date.separator,
            "applyLabel": i18n.t('apply'),
            "cancelLabel": i18n.t('cancel'),
            "fromLabel": i18n.t('from'),
            "toLabel": i18n.t('to'),
            "customRangeLabel": i18n.t('custom_range')
        }
    })
}

clearDateValues  = () => {
    $('[name="daterange"]').val('')
    $('[name="from"]').val('')
    $('[name="till"]').val('')
}

prepareDateFields = (daterange) => {
    const separator = WSL.ui.date.range.separator
    const date_parts = daterange.split(separator)
    const from = moment(date_parts[0], WSL.ui.date.format).unix()
    const till = moment(date_parts[1], WSL.ui.date.format).unix()
    $('[name="from"]').val(from)
    $('[name="till"]').val(till)
}