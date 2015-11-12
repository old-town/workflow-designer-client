define([
    'underscore',
    'backbone',
    'models/descriptor/action',
    'backbone-associations'
], function(_, Backbone, Action) {
    var StepDescriptor = Backbone.AssociatedModel.extend({
        defaults: {
            'id': null,
            'name': null,
            'actions': []
        },
        relations: [
            {
                type: Backbone.Many,
                key: 'actions',
                relatedModel: Action
            }
        ]
    });
    return StepDescriptor;
});