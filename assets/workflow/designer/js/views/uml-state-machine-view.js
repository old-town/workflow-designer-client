define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'arbor',
    'views/uml-state-machine-renderer',
    'text!templates/uml-state-machine-view.html'
], function ($, _, Backbone, joint, arbor, Renderer, umlStateMachineView) {
    var UmlStateMachineView = Backbone.View.extend({
        tagName: 'div',
        model: null,
        graph: null,
        template: _.template(umlStateMachineView),
        paperElSelector: '.paper',
        graphEngine: null,
        renderer: null,
        className: 'graph-viewport',

        getWidth: function () {
            return this.width;
        },
        getHeight: function () {
            return this.height;
        },
        getGraphEngine: function () {
            if (this.graphEngine) {
                return this.graphEngine;
            }
            this.graphEngine = arbor.ParticleSystem(1000);
            var elRender = $(this.paperElSelector, $(this.el));
            this.graphEngine.parameters({gravity:true});
            this.graphEngine.renderer = Renderer(elRender);

            return this.graphEngine;
        },

        drawUml: function () {
            this.initUmlStateMachine();
            this.initTransition();
        },
        initUmlStateMachine: function() {

            var sys = this.getGraphEngine();

            sys.addNode('initState', {
                'type': 'initState',
                mass: 0.4
            });


            this.model.get('initial-actions').each(_.bind(this.initCondition, this));

            this.model.get('steps').each(_.bind(function(step){
                sys.addNode(step.get('name'), {
                    'type': 'state',
                    'model': step,
                    mass: 0.4
                });
                step.get('actions').each(_.bind(this.initCondition, this));
            }, this));

            return this;
        },
        initCondition: function(action) {
            if (action.get('results').length > 0) {
                var conditionName = this.buildConditionName(action);
                this.getGraphEngine().addNode(conditionName, {
                    'type': 'condition',
                    mass: 0.4
                });
            }
        },
        initTransition: function() {
            this.initInitialActionTransitions();
        },
        initInitialActionTransitions: function() {
            var sys = this.getGraphEngine();

            var initStateNode = sys.getNode('initState');

            this.model.get('initial-actions').each(_.bind(function(action) {
                if (action.get('results').length > 0) {
                    var conditionName = this.buildConditionName(action);
                    var conditionNode = sys.getNode(conditionName);

                    sys.addEdge(initStateNode, conditionNode);

                    action.get('results').each(_.bind(function(result){
                        var stepId = result.get('step');
                        if (stepId) {
                            var stepName = this.model.get('steps').get(stepId).get('name');
                            var stepNode = sys.getNode(stepName);
                            sys.addEdge(conditionNode, stepNode);

                        }
                    }, this));

                    var unconditionalResult = action.get('unconditional-result');
                    var stepId = unconditionalResult.get('step');
                    if (stepId) {
                        var stepName = this.model.get('steps').get(stepId).get('name');
                        var stepNode = sys.getNode(stepName);
                        sys.addEdge(conditionNode, stepNode);
                    }




                } else {

                }
            }, this));



        },
        buildConditionName: function(action) {
            var conditionName = 'condition_for_action_id_' + action.get('id');
            return conditionName;
        },

        render: function () {
            $(this.el).html(this.template());

            return this;
        }
    });
    return UmlStateMachineView;
});