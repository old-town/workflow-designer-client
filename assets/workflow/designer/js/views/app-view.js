define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'text!templates/app-layout.html',
    'models/descriptor/workflow',
    'views/uml-state-machine-view'
], function($, _, Backbone, joint, appLayout, WorkflowDescriptor, UmlStateMachineView){
    return Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: null,

        // Our template for the line of statistics at the bottom of the app.
        appLayout: _.template(appLayout),

        // Delegated events for creating new items, and clearing completed ones.
        events: {

        },

        /**
         * Инициализация отображения приложения
         */
        initialize: function() {
            WorkflowDescriptor.prototype.bind('sync', this.renderWorkflowDescriptor);


            this.renderAppLayout();

            var model = new WorkflowDescriptor();
            model.fetch();
        },

        renderWorkflowDescriptor: function(model) {
            var view = new UmlStateMachineView({
                'model': model
            });
            $(this.el).empty();
            $('.uml-layout', this.el).append(view.render().el);
            view.drawUml();
        },

        /**
         * Рендер layout приложения
         */
        renderAppLayout: function()
        {
            $(this.el).html(this.appLayout());

        }
    });

});