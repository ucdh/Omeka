if (!Omeka) {
    var Omeka = {};
}

(function($) {
    $(document).ready(function () {
        // Provide starting point for focus.
        jQuery('#username').focus();
    
        // Skip to content
        Omeka.skipNav = function() {
            $("#skipnav").click(function() {
                $("#content").focus()
            });
        };
        
        // Show advanced options for site-wide search.
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
                }
            });

        };
    });
})(jQuery);
