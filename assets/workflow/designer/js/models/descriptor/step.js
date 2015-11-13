define([
    'underscore',
    'backbone',
    'models/descriptor/action',
    'models/descriptor/common-action',
    'backbone-associations'
], function(_, Backbone, Action, CommonAction) {
    var StepDescriptor = Backbone.AssociatedModel.extend({
        defaults: {
            'id': null,
            'name': null,
            'actions': [],
            'common-actions': []
        },
        relations: [
            {
                type: Backbone.Many,
                key: 'actions',
                relatedModel: Action
            },
            {
                type: Backbone.Many,
                key: 'common-actions',
                relatedModel: CommonAction
            }
        ]
    });
    return StepDescriptor;
});