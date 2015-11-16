define([
], function () {
    return {
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
            size: {width: 80, height: 30},
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
        defaultSplitConfig: {
            size: {width: 5, height: 5},
            attrs: {
                '.root' : { stroke: '#4b4a67', 'stroke-width': 5 },
                '.label': {}
            }
        },
        defaultJoinConfig: {
            size: {width: 5, height: 5},
            attrs: {
                '.root' : { stroke: '#4b4a67', 'stroke-width': 5 },
                '.label': {}
            }
        },
        initStateName: 'initState',
        initStateNodeType: 'initState',
        conditionNodeType: 'condition',
        stepNodeType: 'step',
        splitNodeType: 'split',
        joinNodeType: 'join'
    };

});