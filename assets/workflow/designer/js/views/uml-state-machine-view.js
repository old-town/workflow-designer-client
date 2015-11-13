define([
    'jquery',
    'underscore',
    'backbone',
    'joint',
    'arbor',
    'views/uml-state-machine-renderer',
    'text!templates/uml-state-machine-view.html'
], function ($, _, Backbone, joint, arbor, Renderer, umlStateMachineView) {
    return Backbone.View.extend({
        tagName: 'div',
        model: null,
        graph: null,
        template: _.template(umlStateMachineView),
        paperElSelector: '.paper',
        graphEngine: null,
        renderer: null,
        className: 'graph-viewport',
        addedState: {},

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
            this.graphEngine = arbor.ParticleSystem(10000000, 512, 1, true);
            var elRender = $(this.paperElSelector, $(this.el));
            //this.graphEngine.parameters({gravity:true});
            this.graphEngine.renderer = Renderer(elRender);

            return this.graphEngine;
        },

        drawUml: function () {
            this.initUmlStateMachine();
            this.initTransition();
        },

        initUmlStateMachine: function () {

            var sys = this.getGraphEngine();

            sys.addNode('initState', {
                'type': 'initState'
            });
            //this.model.get('initial-actions').each(_.bind(this.initCondition, this, 5));

            this.addedState = {};

            this.model.get('initial-actions').each(_.bind(this.addStepByAction, this));


            this.model.get('steps').each(_.bind(function(step){
                if (!this.addedState[step.get('id')]) {
                    sys.addNode(step.get('name'), {
                        'type': 'state',
                        'model': step,
                        mass: 0.4,
                        fixed: true
                    });
                }






            }, this));



            //
            //this.model.get('steps').each(_.bind(function(step){
            //
            //    step.get('actions').each(_.bind(this.initCondition, this, 0.4));
            //
            //    sys.addNode(step.get('name'), {
            //        'type': 'state',
            //        'model': step,
            //        mass: 0.4,
            //        fixed: true
            //    });
            //
            //}, this));

            return this;
        },
        addStepByAction: function(action) {
            this.initCondition(0.4, action);

            action.get('results').each(_.bind(function (result) {
                var stepId = result.get('step');
                if (stepId && _.isUndefined(this.addedState[stepId])) {
                    var step = this.model.get('steps').get(stepId);
                    this.getGraphEngine().addNode(step.get('name'), {
                        'type': 'state',
                        'model': step,
                        mass: 0.4,
                        fixed: true
                    });

                    this.addedState[stepId] = stepId;
                    this.addStepByParentStep(step);

                }

            }, this));


            var unconditionalResultStepId = action.get('unconditional-result').get('step');
            if (unconditionalResultStepId && _.isUndefined(this.addedState[unconditionalResultStepId])) {
                var step = this.model.get('steps').get(unconditionalResultStepId);
                this.getGraphEngine().addNode(step.get('name'), {
                    'type': 'state',
                    'model': step,
                    mass: 0.4,
                    fixed: true
                });

                this.addedState[unconditionalResultStepId] = unconditionalResultStepId;
                this.addStepByParentStep(step);
            }


        },
        addStepByParentStep: function(parentStep) {
            parentStep.get('actions').each(_.bind(this.addStepByAction, this));
        },



        initCondition: function (mass, action) {
            if (action.get('results').length > 0) {
                var conditionName = this.buildConditionName(action);
                this.getGraphEngine().addNode(conditionName, {
                    'type': 'condition',
                    mass: mass
                });
            }
        },

        initTransition: function () {
            this.initInitialActionTransitions();
            this.initStateTransition();
        },

        initStateTransition: function () {
            this.model.get('steps').each(_.bind(function (step) {
                var source = this.getGraphEngine().getNode(step.get('name'));
                step.get('actions').each(_.bind(this.initEdge, this, source));
            }, this));
        },

        initInitialActionTransitions: function () {
            var sys = this.getGraphEngine();
            var initStateNode = sys.getNode('initState');
            this.model.get('initial-actions').each(_.bind(this.initEdge, this, initStateNode));
        },

        initEdge: function (source, action) {
            var sys = this.getGraphEngine();
            var sourceForUnconditionalEdge;
            if (action.get('results').length > 0) {
                var conditionName = this.buildConditionName(action);
                var conditionNode = sys.getNode(conditionName);
                sys.addEdge(source, conditionNode);
                action.get('results').each(_.bind(this.addEdgeByResult, this, conditionNode));
                sourceForUnconditionalEdge = conditionNode;
            } else {
                sourceForUnconditionalEdge = source;
            }

            var unconditionalResult = action.get('unconditional-result');
            this.addEdgeByResult(sourceForUnconditionalEdge, unconditionalResult);
        },

        addEdgeByResult: function (source, result) {
            var sys = this.getGraphEngine();

            if (!result) {
                console.log(source);
            }


            var stepId = result.get('step');
            if (stepId) {
                var stepName = this.model.get('steps').get(stepId).get('name');
                var stepNode = sys.getNode(stepName);
                sys.addEdge(source, stepNode);

            }
        },

        buildConditionName: function (action) {
            return 'condition_for_action_id_' + action.get('id');
        },

        render: function () {
            $(this.el).html(this.template());

            return this;
        }
    });
});