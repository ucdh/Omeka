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
        
        Omeka.megaMenu = function(customMenuOptions) {
            
            var menuOptions = {
                /* Id for targeted menu */
                menuId: "#primary-nav",
                
                /* prefix for generated unique id attributes, which are required
                 to indicate aria-owns, aria-controls and aria-labelledby */
                uuidPrefix: "accessible-megamenu",
                
                /* css class used to define the megamenu styling */
                menuClass: "nav-menu",
                
                /* css class for a top-level navigation item in the megamenu */
                topNavItemClass: "nav-item",
                
                /* css class for a megamenu panel */
                panelClass: "sub-nav",
                
                /* css class for a group of items within a megamenu panel */
                panelGroupClass: "sub-nav-group",
                
                /* css class for the hover state */
                hoverClass: "hover",
                
                /* css class for the focus state */
                focusClass: "focus",
                
                /* css class for the open state */
                openClass: "open"
            };
            
            $.extend(true,menuOptions,customMenuOptions);
            
            $(menuOptions.menuId).accessibleMegaMenu({
              uuidPrefix: menuOptions.uuidPrefix,
              menuClass: menuOptions.menuClass,
              topNavItemClass: menuOptions.topNavItemClass,
              panelClass: menuOptions.panelClass,
              panelGroupClass: menuOptions.panelGroupClass,
              hoverClass: menuOptions.hoverClass,
              focusClass: menuOptions.focusClass,
              openClass: menuOptions.openClass
            });
        };
    });
})(jQuery);
