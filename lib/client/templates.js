Template.itemsList.onCreated(function() {
    this.autorun(() => {
        this.subscribe('Items')
        this.subscribe('Users')
    })
})

Template.itemsList.onRendered(function() {
    this.autorun(() => {
        let items
        let itemType = Session.get('itemType')
        let field = Session.get('sortField')
        let specifier = Session.get('sortSpecifier') == 'asc' ? 1 : -1

        if (field && specifier) items = Items.find({}, {sort: {[field]: specifier}}).fetch()
        else if (itemType) items = Items.find({type: itemType}, {sort: {createdAt: -1}}).fetch()
        else items = Items.find().fetch()
        setSegmentData(items)
    })
})

Template.itemsList.helpers({
    items: () => Items,
    itemSegments: () => Session.get('segmentData')
})

Template.item.events({
    'click .editItem': (e, t) => Session.set('selectedItem',  t.data._id),
    'click .deleteItem': (e, t) => {
        const id = t.data._id
        const confirmDeletion = confirm( i18n.t('confirm_delete_item') )

        if (confirmDeletion) {
            Items.remove(id)
            if(!Items.findOne(id))
                wAlert.success(i18n.t('successfully_deleted'))

        }
    }
})

Template.item.helpers({
    selectedItem: () => {
        return Session.get('selectedItem') === Template.currentData()._id
    },
    owner: () => Meteor.users.find(Template.currentData().owners[0]),
    isItemOwner: () => Meteor.userId() === Template.currentData().owners[0]
})

Template.itemPopup.helpers({
    place: () => {
        if(Template.currentData() && Template.currentData()._id) {
            const item = Items.findOne(Template.currentData()._id)
            if(item) {
                const locations = item.locations().fetch()
                return locations[0].city
            }
        }
        return false
    }
})

Template.itemBottom.helpers({
    itemOwners: () => {
    return Template.currentData().owners.map(owner => {
        return Meteor.users.findOne(owner)
    })
}
})

Template.itemsFilter.onCreated(function() {
    this.itemTypeText = new ReactiveVar()
    this.itemsSearchRadiusText = new ReactiveVar()
    this.itemsSearchByPlace = new ReactiveVar()
    this.itemsSearchByPlaceRadius = new ReactiveVar()
})

Template.itemsFilter.onRendered(function() {
    this.itemTypeText.set(i18n.t('type'))
    this.itemsSearchRadiusText.set(i18n.t('radius'))
    this.itemsSearchByPlaceRadius.set(20)

    this.autorun(() => {
        // Override function when user is selecting a
        // result of the location_search input
        WSL.search.onSelect = (result) => {
            this.itemsSearchByPlace.set(result.title)
            Session.set('locationLatLng', null)
         }


        let radius = this.itemsSearchByPlaceRadius.get()
        let place = this.itemsSearchByPlace.get()
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
    })
})


Template.itemsFilter.events({
    'click .sort-by-title': (e,t) => {
        sortByField(e, 'title')
    },
    'click .sort-by-date': (e,t) => {
        sortByField(e, 'createdAt')
    },
    'click .sort-by-type .item': (e,t) => {
        e.preventDefault()

        let target = $(e.currentTarget)
        let itemType = target.attr('data-item-type')
        let itemTypeText = itemType ? i18n.t(itemType) : i18n.t('type')

        Template.instance().itemTypeText.set(itemTypeText)
        Session.set('itemType', itemType)
        Session.set('sortField', null)
        Session.set('sortSpecifier', null)
    },
    'click .items-search-radius .item': (e,t) => {
        e.preventDefault()

        let target = $(e.currentTarget)
        let radius = target.attr('data-item-radius')
        let radiusText = radius ? target.text() : i18n.t('radius')
        let place = Template.instance().itemsSearchByPlace.get()

        Template.instance().itemsSearchRadiusText.set(radiusText)
        Template.instance().itemsSearchByPlaceRadius.set(radius)

        if(place && radius)
            searchByPlace(place, radius)
    }
})

Template.itemsFilter.helpers({
    menuItems: () => {
        return [
            {
                header: i18n.t('sort_by')
            },
            {
                value: i18n.t('title'),
                class: 'sort-by-title asc'
            },
            {
                value: i18n.t('date'),
                class: 'sort-by-date asc'
            },
            {
                text: Template.instance().itemTypeText.get(),
                class: 'sort-by-type',
                icon: 'dropdown',
                value: [
                    {
                        value: i18n.t('offer'),
                        "data-item-type": 'offer'
                    },
                    {
                        value: i18n.t('need'),
                        "data-item-type": 'need'
                    },
                    {
                        value: i18n.t('wish'),
                        "data-item-type": 'wish'
                    },
                    {
                        value: i18n.t('dream'),
                        "data-item-type": 'dream'
                    },
                    {
                        divider: true
                    },
                    {
                        value: i18n.t('none')
                    }
                ]
            },
            {
                template: 'searchLocationInputField',
                label: false,
                placeholder: i18n.t('place')
            },
            {
                text: Template.instance().itemsSearchRadiusText.get(),
                class: 'items-search-radius',
                icon: 'dropdown',
                value: [
                    {
                        value: '5 km',
                        "data-item-radius": '5'
                    },
                    {
                        value: '10 km',
                        "data-item-radius": '10'
                    },
                    {
                        value: '20 km',
                        "data-item-radius": '20'
                    },
                    {
                        value: '30 km',
                        "data-item-radius": '30'
                    },
                    {
                        value: '40 km',
                        "data-item-radius": '40'
                    },
                    {
                        value: '50 km',
                        "data-item-radius": '50'
                    },
                    {
                        value: '100 km',
                        "data-item-radius": '100'
                    },
                    {
                        value: '200 km',
                        "data-item-radius": '200'
                    }
                ]
            }
        ]
    }
})