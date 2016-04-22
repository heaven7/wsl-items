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

        if (field && specifier) items = Items.find({}, {sort: {[field]: specifier}}).unblocked('owners')
        else if (itemType) items = Items.find({type: itemType}, {sort: {createdAt: -1}}).unblocked('owners')
        else items = Items.find().unblocked('owners')
        setSegmentData(items)
    })
})

Template.itemsList.helpers({
    items: () => Items.find().unblocked('owners'),
    itemSegments: () => Session.get('segmentData'),
    blockedItemsCount: () => Items.find().blocked('owners').length,
    unblockButtonText: () => i18n.t('unblock'),
    unblockItemsText: () => i18n.t('unblock_items_header'),
    blockUserModalHeader: () => i18n.t('blog_user_modal_header')
})

Template.itemsList.events({
    'click .items-unblock-action': (e,t) => {
        openModal('#unblockItemsModal')
    }
})

Template.item.events({
    'click .edit-item': (e, t) => Session.set('selectedItem',  t.data._id),
    'click .delete-item': (e, t) => {
        const confirmDeletion = confirm( i18n.t('confirm_delete_item') )
        if (confirmDeletion) {
            const id = t.data._id
            Items.remove(id)
            if(!Items.findOne(id))
                wAlert.success(i18n.t('successfully_deleted'))
        }
    },
    'click .item-block-action': (e,t) => {
        const confirmDeletion = confirm( i18n.t('really_block_this_item') )
        if (confirmDeletion) {
            const id = t.data._id
            const owner = t.data.owners[0]
            Social.block.docOf(owner, id)
            wAlert.success(i18n.t('successfully_blocked_item'))
        }

    },
    'click .items-block-action': (e,t) => {
        const id = t.data._id
        const owner = t.data.owners[0]
        Social.block.collectionOf(owner, 'Items')
        wAlert.success(i18n.t('successfully_blocked_items_of_user'))
    },
    'click .items-block-modal': (e,t) => {

        let id = t.data.owners[0]
        Session.set('blockUser', id)
        openModal('#blockUserModal')
    }
})

Template.item.helpers({
    selectedItem: () => {
        return Session.get('selectedItem') === Template.currentData()._id
    },
    owner: () => Meteor.users.find(Template.currentData().owners[0]),
    isItemOwner: () => Meteor.userId() === Template.currentData().owners[0],
    applyForItem: () => i18n.t('apply_for_item'),
    itemMenuItems: () => {
        return [
            {
                icon: 'angle down icon circular outline',
                class: 'right',
                value: [
                    {
                        icon: 'flag outline',
                        value: i18n.t('block_this_item'),
                        class: 'item-block-action'
                    },
                    {
                        icon: 'flag',
                        value: i18n.t('block_all_items_of_user'),
                        class: 'items-block-modal'
                    },
                    {
                        icon: 'announcement',
                        value: i18n.t('report'),
                        class: 'item-report-action'
                    }
                ]
            }
        ]
    }
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

Template.itemBottom.onCreated(function() {
    this.showComments = new ReactiveVar(false)
})

Template.itemBottom.helpers({
    itemOwners: () => {
        return Template.currentData().owners.map(owner => {
            return Meteor.users.findOne(owner)
        })
    },
    owner: () => Template.currentData().owners[0],
    showComments: () => Template.instance().showComments.get(),
    currentUserId: () => Meteor.userId(),
    commentsCount:() => Social.comments.count(Template.currentData()._id)
})

Template.itemBottom.events({
    'click .show-item-comments': (e,t) => {
        let target = $(e.currentTarget)
        target.toggleClass('active')
        if(target.hasClass('active') == true) Template.instance().showComments.set(true)
        else Template.instance().showComments.set(false)
    },
    'click .item-heart-action': (e,t) => {
        Social.hearts.toggle(t.data._id, 'Items')
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

Template.blockUserModal.helpers({
    user: () => {
        let userId = Session.get('blockUser')
        if(userId)
            return Meteor.users.findOne(userId)
    },
    userId: () => Session.get('blockUser'),
    blockUserText: () => i18n.t('block_items_of_user')
})

Template.blockUserModal.events({
    'click .items-block-action': (e,t) => {
        const owner = Session.get('blockUser')
        Social.block.collectionOf(owner, 'Items')
        wAlert.success(i18n.t('successfully_blocked_items_of_user'))
        closeModal('#blockUserModal')
    }
})

Template.unblockItemsModal.helpers({
    blockedItems: () => Items.find().blocked('owners')
})

Template.unblockItemsModal.events({
    'click .item-unblock-action': (e,t) => {
        let target = $(e.currentTarget)
        let id = target.attr('data-item-doc')
        if(id) {
            let owner = Items.findOne(id).owners[0]
            Social.unblock.docOf(owner, id)
        }
    }
})
