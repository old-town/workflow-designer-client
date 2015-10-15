require.config({
    paths: {
        jquery: 'libs/jquery/jquery',
        underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        text: 'libs/require/text'
    }

});


require(['views/app', 'jquery'], function(AppView, $){

    var app_view = new AppView({
        el: $('.workflow-designer-layout')
    });



});