require.config({
    paths: {
        text: 'libs/require/text',
        jquery: 'libs/jquery/jquery',
        lodash: 'libs/lodash/lodash',
        backbone: 'libs/backbone/backbone',
        joint: 'libs/joint/joint'
    },
    map: {
        '*': {
            'underscore': 'lodash'
        }
    }

});


require(['jquery', 'app'], function($, App){
    App.initialize({
        'appViewConfig': {
            'el': $('.workflow-designer-layout')
        }
    });
});