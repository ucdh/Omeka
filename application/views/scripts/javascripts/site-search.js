if (!Omeka) {
    var Omeka = {};
}

(function ($) {
    Omeka.showAdvancedForm = function () {
        var advanced_form = $('#advanced-form');
        var show_advanced = '<a href="#" class="show-advanced button">&hellip;</a>';
        var search_submit = $('#search-form button');

        /* 
            Setup classes and DOM elements jQuery will use.
        */
        if (advanced_form.length > 0) {
            $('#search-container').addClass('with-advanced');
            advanced_form.addClass('closed').before(show_advanced);
        }
        
        /*
            Setup flags for when "shift" key is used, mainly for
            tabbing between elements.   
        */
        var shift_state = false;
        $(document).keydown( function(e) {
            if (e.keyCode == 16) {
                shift_state = true;
            }
        });

        $(document).keyup( function(e) {
            if (e.keyCode == 16) {
                shift_state = false;
            }
        });

        $('.show-advanced').click(function(e) {
            e.preventDefault();
            advanced_form.toggleClass('open').toggleClass('closed');
        });
        $('.show-advanced').keydown(function(e) {
            var advanced_closed = e.keyCode == 40 && advanced_form.hasClass('closed');
            var advanced_hidden = e.keyCode == 38 && advanced_form.hasClass('open');
            if (advanced_closed || advanced_hidden) {
                e.preventDefault();
                advanced_form.toggleClass('open').toggleClass('closed');
            } else if (e.keyCode == 9 && advanced_form.hasClass('closed')) {
                e.preventDefault();
                if (shift_state == true) {
                    $(this).prev().focus();
                } else {
                    search_submit.focus();
                }
            }
        });
        search_submit.keydown(function(e) {
            if (e.keyCode == 9 && advanced_form.hasClass('closed') && shift_state == true) {
                e.preventDefault();
                $('.show-advanced').focus();
            }
        });

        /* 
        var advancedForm = $('#advanced-form');
        var searchTextbox = $('#search-form input[type=text]');
        var searchSubmit = $('#search-form button');
        console.log(advancedForm.length);
        if (advancedForm.length > 0) {
            advancedForm.css("display", "none");
            $('#search-form').addClass("with-advanced").after('<a href="#" id="advanced-search" class="button">Advanced Search</a>');
            advancedForm.click(function (event) {
                event.stopPropagation();
            });
            $("#advanced-search").click(function (event) {
                event.preventDefault();
                event.stopPropagation();
                advancedForm.fadeToggle();
                $(document).click(function (event) {
                    if (event.target.id == 'query') {
                        return;
                    }
                    advancedForm.fadeOut();
                    $(this).unbind(event);
                });
            });
        }
        */
    };
})(jQuery);