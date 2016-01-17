Package.describe({
    name: 'heaven7:wsl-items',
    summary: "WSL Items-Package",
    version: "0.0.3",
    git: "https://github.com/heaven7/wsl-items.git"
})

const both = ['client','server'],
    packages = [
        'heaven7:wsl-core@0.0.3_1',
        'heaven7:wsl-fulfiller@0.0.3'
    ]

Package.on_use(function (api) {
    api.versionsFrom('1.2')
    api.use(packages, both)
    api.imply(packages)

    api.addFiles([
        'lib/both/items.js',
        'lib/both/helpers.js',
        'lib/both/schemas.js',
        'lib/both/router.js'
    ], both)

    api.addFiles([
        'lib/server/allow.coffee',
        'lib/server/methods.js',
        'lib/server/publish.js',
        'lib/server/utils.coffee'
    ], 'server')

    api.addFiles([
        'lib/client/hooks.js',
        'lib/client/templates.html',
        'lib/client/templates.js',
        'lib/client/forms.html',
        'lib/client/forms.js',
        'lib/client/helpers.js'
    ], 'client')

    api.export('Items', both)
})
