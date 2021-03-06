define([
    'underscore',
    'backbone',
    'models/descriptor/unconditional-result',
    'models/descriptor/result',
    'backbone-associations'
], function(_, Backbone, UnconditionalResult, Result) {
    return Backbone.AssociatedModel.extend({
        defaults: {
            'id': null,
            'name': null,
            'unconditional-result': null,
            'results': []
        },
        relations: [
            {
                type: Backbone.One,
                key: 'unconditional-result',
                relatedModel: UnconditionalResult
            },
            {
                type: Backbone.Many,
                key: 'results',
                relatedModel: Result
            }
        ]
    });
});