define([
    'underscore',
    'backbone',
    'backbone-associations'
], function(_, Backbone) {
    return Backbone.AssociatedModel.extend({
        defaults: {
            'id': null
        }
    });
});