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
        closeModal('#blockUserModal')
        wAlert.success(i18n.t('successfully_blocked_items_of_user'))
    }
})

Template.unblockItemsModal.helpers({
    blockedItems: () => {
        let blocks = Blocks.find({docType: null}).fetch()
        let items = []
        blocks.forEach(block => {
            let item = Items.findOne(block.doc)
            if (item)
                items.push(item)
        })
        return items
    },
    blockedUsers: () => {
        let blocks = Blocks.find({doc: null, docType: 'Items'}).fetch()
        let users = []
        blocks.forEach(block => {
            users.push(Meteor.users.findOne(block.userId))
        })
        return users
    },
    unblockUserText: () => i18n.t('unblock_user')
})

Template.unblockItemsModal.events({
    'click .item-unblock-action': (e,t) => {
        let target = $(e.currentTarget)
        let doc = target.attr('data-item-doc')
        let user = target.attr('data-item-user')

        // unblock collection
        if(user) {
            Social.unblock.collectionOf(user, 'Items')
            wAlert.success(i18n.t('successfully_unblocked_items_of_user'))
        }
        // unblock doc
        if(doc) {
            let owner = Items.findOne(doc).owners[0]
            Social.unblock.docOf(owner, doc)
            wAlert.success(i18n.t('successfully_unblocked_item'))
        }
        closeModal('#unblockItemsModal')
        Session.set('unblockModal', false)
    }
})

Template.heartedUsersModal.onCreated(function() {
    this.autorun(() => {
        this.subscribe('Hearts', Template.currentData()._id)
        this.subscribe('Users')
    })
})

Template.heartedUsersModal.onRendered(function() {
    WSL.ui.modal.onHide = function() {
        Session.set('showHeartedUsers', false)
    }
})

Template.heartedUsersModal.helpers({
    users: () => {
        let id = Template.currentData()._id
        let hearts = Hearts.find({doc: id}).fetch()
        console.log(id)
        let users = []
        hearts.forEach(heart => {
            if(heart.owner)
                users.push(Meteor.users.findOne(heart.owner))
        })
        return users
    }
})