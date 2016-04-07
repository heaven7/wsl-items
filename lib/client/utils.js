
/**
 * Sorting helper
 * @param field String
 * @param event Object
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
 * @param place String
 * @param radius Number
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
 * @param Object items
 */

setSegmentData = (items) => {
    let segmentData = items.map(i => {
        return {
            sticky: true,
            segments: [
                {
                    labelType: mDate.timeAgo(i.createdAt),
                    label: i18n.t(i.type),
                    labelClass: 'attached top',
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