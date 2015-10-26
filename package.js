Package.describe({
    name: 'heaven7:wsl-items',
    summary: "WSL Items-Package",
    version: "0.0.1",
    git: "https://github.com/heaven7/wsl-items.git"
});

both = ['client','server'];

Package.on_use(function (api) {
    api.versionsFrom("METEOR@1.0.1");

    api.use([
        'heaven7:wsl-core@0.0.1'
    ], both);

    api.imply(['heaven7:wsl-core']);

    api.addFiles([
        'lib/both/items.js',
        'lib/both/helpers.js',
        'lib/both/schemas.js',
        'lib/both/router.js'
    ], both);

    api.addFiles([
        'lib/server/allow.coffee',
        'lib/server/methods.js',
        'lib/server/publish.js',
        'lib/server/utils.coffee'
    ], 'server');

    api.addFiles([
        'lib/client/hooks.js',
        'lib/client/templates.html',
        'lib/client/templates.js',
        'lib/client/helpers.js'
    ], 'client');

    api.export('Items', both);
});
