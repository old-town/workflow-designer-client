define([
    'underscore',
    'backbone',
    'models/descriptor/unconditional-result',
    'backbone-associations'
], function(_, Backbone, UnconditionalResult) {
    return Backbone.AssociatedModel.extend({
        defaults: {
            'id': null
        },
        relations: [
            {
                type: Backbone.One,
                key: 'unconditional-result',
                relatedModel: UnconditionalResult
            }
        ]
    });
});