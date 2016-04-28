Template.itemsList.onCreated(function() {
    Session.set('unblockModal', false)
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
        else items = Items.find({}, {sort: {createdAt: -1}}).unblocked('owners')
        setSegmentData(items)
    })
})

Template.itemsList.helpers({
    items: () => Items.find().unblocked('owners'),
    itemSegments: () => Session.get('segmentData'),
    blockedItemsCount: () => Items.find().blocked('owners').length,
    blockUserModalHeader: () => i18n.t('blog_user_modal_header'),
    unblockButtonText: () => i18n.t('unblock'),
    unblockItemsText: () => i18n.t('unblock_items_header'),
    unblockModal: () => Session.get('unblockModal')
})

Template.itemsList.events({
    'click .items-unblock-action': (e,t) => {
        Session.set('unblockModal', true)
        Meteor.setTimeout(() => {
            openModal('#unblockItemsModal')
        }, 200)
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
    selectedItem: () => Session.get('selectedItem') === Template.currentData()._id,
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
    this.showStatistics = new ReactiveVar(false)
    Session.set('showHeartedUsers', false)
})

Template.itemBottom.helpers({
    itemOwners: () => {
        return Template.currentData().owners.map(owner => {
            return Meteor.users.findOne(owner)
        })
    },
    isOwner: () => Template.currentData().owners[0] == Meteor.userId(),
    showComments: () => Template.instance().showComments.get(),
    showStatistics: () => Template.instance().showStatistics.get(),
    showHeartedUsers: (id) => Session.get('showHeartedUsers') === id,
    currentUserId: () => Meteor.userId(),
    commentsCount:() => Social.comments.count(Template.currentData()._id)
})

Template.itemBottom.events({
    'click .show-item-statistics': (e,t) => {
        let target = $(e.currentTarget)
        target.toggleClass('active')
        if(target.hasClass('active') == true) Template.instance().showStatistics.set(true)
        else Template.instance().showStatistics.set(false)
    },
    'click .show-item-comments': (e,t) => {
        let target = $(e.currentTarget)
        target.toggleClass('active')
        if(target.hasClass('active') == true) Template.instance().showComments.set(true)
        else Template.instance().showComments.set(false)
    },
    'click .item-heart-action': (e,t) => {
        Social.hearts.toggle(t.data._id, 'Items')
    },
    'click .show-hearted-users': (e,t) => {
        let id = t.data._id
        Session.set('showHeartedUsers', id)
        Meteor.setTimeout(() => {
            openModal('#heartedUsersModal')
        }, 200)
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
       searchOnSelect(this)
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
                text: i18n.t('sort_by'),
                icon: 'dropdown',
                value: [
                    {
                        value: i18n.t('title'),
                        class: 'sort-by-title asc'
                    },
                    {
                        value: i18n.t('date'),
                        class: 'sort-by-date asc'
                    }
                ]
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

Template.itemStatistics.onCreated(function() {
    let id = Template.currentData()._id
    this.autorun(() => {
        this.subscribe('Blocks', id, null)
    })
})

Template.itemStatistics.onRendered(function() {
    let id = Template.currentData()._id
    let blocksCount = Blocks.find({doc: id}).count()
})

Template.itemStatistics.helpers({
    itemStats: () => {
        let id = Template.currentData()._id
        let blocksCount = Blocks.find({doc: id}).count()
        let viewsCount = 0 // Views.find({doc: id}).count()
        return [
            {
                value: viewsCount,
                label: i18n.t('views'),
                icon: 'unhide'
            },
            {
                value: blocksCount,
                label: i18n.t('times_blocked'),
                icon: 'flag'
            }
        ]
    }
})