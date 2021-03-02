import * as $ from 'jquery';

$(document).on('click', '.quiz-label', function(){
    let quiz = $(this).parents('.quiz-item'),
        step = $(quiz).data('step') + 1;

    if(step > 4)
        step = 4;

    setTimeout(function(){
        $(quiz).removeClass('active');
        $(`[data-step=${step}]`).addClass('active');
    }, 500);
});
