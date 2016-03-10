## WSL Items-Package
Package for sharing goods, services, transports - things you love...
This package is used internally for the [wsl project](https://github.com/heaven7/wsl).
### Installation
Use this command to install the package
```
meteor add heaven7:wsl-items
```
### Basics
Items can be of type `need`, `offer`. `wish` or `dream`.
Each item is sent out to other users in a certain range / location.
Users can manage the stream of items they receive.

### Usage
In your template the items list can be integrated with
```html
{{> itemsList}}
```
The form to insert items can be inserted only when a user is logged in
```html
<template name="myTemplate">
    {{#if loggedIn}}
        {{> insertItemForm doc=currentUser docType="User"}}
    {{/if}}
</template>
```