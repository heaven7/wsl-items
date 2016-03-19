Package.describe({
    name: 'heaven7:wsl-items',
    summary: "WSL Items-Package",
    version: "0.0.3",
    git: "https://github.com/heaven7/wsl-items.git"
})

const both = ['client','server'],
    packages = [
        'heaven7:wsl-core@0.0.3_1',
        'heaven7:wsl-theme-semantic-ui@0.0.4_1',
        'heaven7:wsl-fulfiller@0.0.3',
        'heaven7:wsl-locations@0.0.3',
        'heaven7:wsl-i18n@0.0.3',
        'heaven7:wsl-translations@0.0.3',
        'heaven7:wsl-alert@0.0.3',
        'heaven7:wsl-permissions@0.0.3',
        'heaven7:date@0.0.1',
        'ecmascript',
        'es5-shim'
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
        'lib/server/allow.js',
        'lib/server/publish.js'
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
