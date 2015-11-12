define([
    'underscore',
    'backbone',
    'backbone-associations'
], function(_, Backbone) {
    var UnconditionalResult = Backbone.AssociatedModel.extend({
        defaults: {
            'old-status': null,
            'status': null,
            'step': null,
            'owner': null,
            'split': null,
            'join': null,
            'due-date': null,
            'id': null,
            'display-name': null
        }
    });
    return UnconditionalResult;
});