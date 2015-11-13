define([
    'jquery',
    'underscore',
    'joint'
], function ($, _, joint) {
    return function (viewport) {
        var graph;
        var paper;
        var el = viewport;
        var particleSystem;
        return {
            initStateId: 'initState',
            defaultStartStateConfig: {
                size: {width: 30, height: 30},
                attrs: {
                    'circle': {
                        fill: '#4b4a67',
                        stroke: 'none'
                    }
                }
            },
            defaultStateConfig: {
                size: {width: 80, height: 30},
                attrs: {
                    '.uml-state-body': {
                        fill: 'rgba(48, 208, 198, 0.1)',
                        stroke: 'rgba(48, 208, 198, 0.5)',
                        'stroke-width': 1.5
                    },
                    '.uml-state-separator': {
                        stroke: 'rgba(48, 208, 198, 0.4)'
                    }
                }
            },
            defaultConditionConfig: {
                attrs: {
                    text: {
                        fill: '#ffffff',
                        text: ' ',
                        'letter-spacing': 0,
                        style: {
                            'text-shadow': '1px 0 1px'
                        }
                    },
                    '.outer': {
                        fill: 'white',
                        stroke: 'rgba(48, 208, 198, 0.5)'
                    }
                }
            },
            defaultTransitionConfig: {
                attrs: {
                    '.connection': {
                        'fill': 'none',
                        'stroke-linejoin': 'round',
                        'stroke-width': '2',
                        'stroke': '#4b4a67'
                    }
                }
            },

            init: function (system) {
                //начальная инициализация
                particleSystem = system;

                particleSystem.screenSize(el.width(), el.height());
                particleSystem.screenPadding(80);

            },

            buildInitStateId: function () {
                return this.initStateId;
            },

            buildStateId: function (workflowStepId) {
                return 'step_id_' + workflowStepId;
            },

            buildConditionalBlockId: function (conditionalNodeId) {
                return 'condition_id_' + conditionalNodeId;
            },

            buildTransitionId: function (edgeId) {
                return 'transition_id_' + edgeId;
            },

            getGraph: function () {
                if (graph) {
                    return graph;
                }

                var paperEl = $(el);

                graph = new joint.dia.Graph();

                paper = new joint.dia.Paper({
                    el: paperEl,
                    width: el.width(),
                    height: el.height(),
                    gridSize: 1,
                    model: graph
                });

                return graph;

            },
            getPaper: function() {
                if (paper) {
                    return paper;
                }
                this.getGraph();

                return paper;
            },


            redraw: function () {
                this.redrawNode();
                this.redrawEdge();
            },

            getCellByNode: function(node) {
                var cellId;
                switch (node.data.type) {
                    case 'initState':
                    {
                        cellId = this.buildInitStateId();
                        break;
                    }
                    case 'state':
                    {
                        var workflowStepId = node.data.model.get('id');
                        cellId = this.buildStateId(workflowStepId);
                        break;
                    }
                    case 'condition':
                    {
                        cellId = this.buildConditionalBlockId(node._id);
                        break;
                    }
                    default :{
                        throw new Error('Undefined node type:' + node.data.type);
                    }
                }
                return this.getGraph().getCell(cellId);
            },

            redrawEdge: function () {
                particleSystem.eachEdge(_.bind(function (edge) {
                    var transitionId = this.buildTransitionId(edge._id);
                    if (!this.getGraph().getCell(transitionId)) {
                        var transitionConfig = _.clone(this.defaultTransitionConfig);
                        var sourceNode = this.getCellByNode(edge.source);
                        var targetNode = this.getCellByNode(edge.target);


                        _.extend(transitionConfig, {
                            id: transitionId,
                            source: {
                                id: sourceNode.id
                            },
                            target: {
                                id: targetNode.id
                            }
                        });

                        var transition;
                        if (transitionConfig.source.id === transitionConfig.target.id) {

                            var box = this.getPaper().findViewByModel(sourceNode).getBBox();

                            transitionConfig['vertices'] = [
                                {
                                    x: box.x,
                                    y: box.y - 50
                                },
                                {
                                    x: box.x + box.width,
                                    y: box.y - 50
                                }
                            ];

                            transition = new joint.shapes.fsa.Arrow(transitionConfig);

                        } else {
                            transition = new joint.shapes.uml.Transition(transitionConfig);
                        }




                        this.getGraph().addCell(transition);
                    }
                }, this));
            },

            redrawNode: function () {
                particleSystem.eachNode(
                    _.bind(function (node, pt) {
                        switch (node.data.type) {
                            case 'initState':
                            {
                                this.redrawInitState(node, pt);
                                break;
                            }
                            case 'state':
                            {
                                this.redrawState(node, pt);
                                break;
                            }
                            case 'condition':
                            {
                                this.redrawCondition(node, pt);
                                break;
                            }
                        }
                    }, this)
                );
            },

            redrawInitState: function (node, pt) {
                if (!this.getGraph().getCell(this.buildInitStateId())) {
                    var uml = joint.shapes.uml;
                    var startStateConfig = _.clone(this.defaultStartStateConfig);
                    _.extend(startStateConfig, {
                        id: this.buildInitStateId(),
                        position: {x: pt.x, y: pt.y}
                    });
                    this.getGraph().addCell(new uml.StartState(startStateConfig));
                }
                this.getGraph().getCell('initState').position({x: pt.x, y: pt.y});
            },

            redrawState: function (node, pt) {
                var workflowStepId = node.data.model.get('id');
                var id = this.buildStateId(workflowStepId);

                if (!this.getGraph().getCell(id)) {
                    var uml = joint.shapes.uml;
                    var stateConfig = _.clone(this.defaultStateConfig);
                    _.extend(stateConfig, {
                        id: id,
                        position: {x: pt.x, y: pt.y},
                        name: node.data.model.get('name')
                    });
                    this.getGraph().addCell(new uml.State(stateConfig));
                }
                this.getGraph().getCell(id).position({x: pt.x, y: pt.y});
            },

            redrawCondition: function (node, pt) {
                var id = this.buildConditionalBlockId(node._id);

                if (!this.getGraph().getCell(id)) {
                    var erd = joint.shapes.erd;

                    var conditionConfig = _.clone(this.defaultConditionConfig);
                    _.extend(conditionConfig, {
                        id: id,
                        position: {x: pt.x, y: pt.y}
                    });

                    this.getGraph().addCell(new erd.Relationship(conditionConfig));
                }
                this.getGraph().getCell(id).position({x: pt.x, y: pt.y});
            }
        }
    }
});
