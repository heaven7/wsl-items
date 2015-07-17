Package.describe({
    name: 'heaven7:wsl-items',
    summary: "WSL Items-Package",
    version: "0.0.1",
    git: "https://github.com/heaven7/wsl-items.git"
});

both = ['client','server']

Package.on_use(function (api) {
    api.versionsFrom("METEOR@1.0.1");


    api.use([
            'less'
        ],
        'client')

    api.use(
        [
            'accounts-password',
            'aldeed:simple-schema@1.3.3',
            'aldeed:collection2@2.3.3',
            'aldeed:autoform@4.2.2',
            'meteor',
            'livedata',
            'coffeescript',
            'templating',
            'iron:router@1.0.9'
        ],
        both)

    api.addFiles(
        [
            'lib/both/collections.coffee',
            'lib/both/schemas.coffee',
            'lib/both/router.coffee'
        ],
        both)

    api.addFiles(
        [
            'lib/client/templates.html',
            'lib/client/helpers.coffee',
            'lib/client/templates.coffee'
        ],
        'client')

    api.addFiles(
        [
            'lib/server/allow.coffee',
            'lib/server/methods.coffee',
            'lib/server/publish.coffee',
            'lib/server/utils.coffee'
        ],
        'server')

    api.imply('aldeed:simple-schema')
    api.imply('aldeed:collection2')
    api.imply('aldeed:autoform')
})
