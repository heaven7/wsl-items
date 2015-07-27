Package.describe({
    name: 'heaven7:wsl-items',
    summary: "WSL Items-Package",
    version: "0.0.1",
    git: "https://github.com/heaven7/wsl-items.git"
});

both = ['client','server']

Package.on_use(function (api) {
    api.versionsFrom("METEOR@1.0.1");

    api.use(['heaven7:wsl-core'], both);
    api.imply(['heaven7:wsl-core']);

    api.addFiles('package-tap.i18n', both);

    api.addFiles([
        'lib/both/collections.coffee',
        'lib/both/schemas.coffee',
        'lib/both/router.coffee'
    ], both);

    api.addFiles([
        'lib/server/allow.coffee',
        'lib/server/methods.coffee',
        'lib/server/publish.coffee',
        'lib/server/utils.coffee'
    ], 'server');

    api.addFiles([
        'lib/client/templates.html',
        'lib/client/templates.coffee',
        'lib/client/helpers.coffee'
    ], 'client');

    api.addFiles([
        'i18n/de.i18n.json',
        'i18n/en.i18n.json',
        'i18n/es.i18n.json'
    ], both);

    api.export('Items', both);
});
