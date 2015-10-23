define([
    'underscore',
    'backbone',
    'models/unconditional-result-descriptor',
    'models/result-descriptor',
    'backbone-associations'
], function(_, Backbone, UnconditionalResult, Result) {
    var ActionDescriptor = Backbone.AssociatedModel.extend({
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
    return ActionDescriptor;
});