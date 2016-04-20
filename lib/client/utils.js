
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
    Session.set('segmentData', segmentData)
}