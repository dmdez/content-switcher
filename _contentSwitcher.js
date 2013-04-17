(function() {

    function extend(destination, source) {
      for (var property in source) {
        if (typeof source[property] === "object") {
          destination[property] = destination[property] || {};
          arguments.callee(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
      return destination;
    }
    
    HTMLElement.prototype.hasClass = function(elem, className) {
        return new RegExp(' ' + className + ' ').test(' ' + this.className + ' ');
    };
    
    HTMLElement.prototype.addClass = function(elem, className) {
        if (!hasClass(elem, className)) {
            elem.className += ' ' + className;
        }
    };
    
    HTMLElement.prototype.toggleClass = function(className) {
        var elem = this;
        var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ' ) + ' ';
        if (elem.hasClass(className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
                newClass = newClass.replace( ' ' + className + ' ' , ' ' );
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        } else {
            elem.className += ' ' + className;
        }
    };

    HTMLElement.prototype.removeClass = function(remove) {
        var newClassName = "";
        var i;
        var classes = this.className.split(" ");
        for(i = 0; i < classes.length; i++) {
            if(classes[i] !== remove) {
                newClassName += classes[i] + " ";
            }
        }
        this.className = newClassName;
    };
    
    function ContentSwitcher(container, options) {
        
        var defaults = {
            'header'       : 'h3', 
            'activeIndex'  : 0, 
            'onChange'     : null,
            'headerAsHtml' : false,
            'toggleHeaders': false,
            'tabLabel'     : true,
            'prefix'       : '',
            'classNames': {
                'content'  : 'tabbed-content',
                'active'   : 'active',
                'tabs'     : 'tabs',
                'tabItems' : 'tab-items',
                'tabLabel' : 'tab-label button button-dropdown',
                'headers'  : 'header-inactive'
            }
        };

        var settings = extend(defaults, options);
        
        for ( var key in settings.classNames ) {
            settings.classNames[key] = settings.prefix + settings.classNames[key];
        }

        var panels = container.childNodes;
        var tabListWrapper = document.createElement('div');
        var tabList = document.createElement('ul');
        var tabLabel = document.createElement('a');
        var tabs = [];
        var activeHeader;

        var removeActiveState = function() {
            container.removeClass(settings.classNames.active);
        };

        var labelToggleActive = function(event) {
            event.stopPropagation();
            container.toggleClass(settings.classNames.active);
            return false;
        };

        var destroy = function() {
            tabListWrapper.parentNode.removeChild(tabListWrapper);
        };
        
        var parsePanels = function(index) {
            var panel = this;
            //var header = 
        }

        console.log(settings);
        return;


        var parsePanels = function(index) {
            var $panel = $(this);
            var $header = $panel.find(settings.header);
            var id = $panel.attr("id");
            var $tabLink = $('<a />', {
                'href': "#" + id
            });
            var $tabLi = $('<li />', {
                'class': $panel.attr('class') || ''
            });

            var isCurrentHeader = function() {
                return (activeHeader != undefined) && activeHeader == index;
            };
        
            var tabClick = function(event) {
                var $this = $(this);
                var activeClass = settings.classNames.active;

                $panels
                    .removeClass(activeClass);
                
                if ( settings.toggleHeaders && !isCurrentHeader())
                    $panel.removeClass(settings.classNames.headers);

                $tabList
                    .children()
                    .removeClass(activeClass);

                $panel
                    .addClass(activeClass);

                $tabLi
                    .addClass(activeClass);
                
                if ( settings.tabLabel)
                    $tabLabel
                        .text($this.text());

                if(settings.onChange)
                    settings.onChange.call(this, $panel);

                activeHeader = index;

                event.preventDefault();
            };

            $header.on('click', function() {

                if ( settings.toggleHeaders && isCurrentHeader())
                    $panel.toggleClass(settings.classNames.headers);

                $tabLink.click();
                
            });

            $tabLink.html(
                settings.headerAsHtml 
                    ? $header.html() 
                    : $header.text()

            ).on('click', tabClick);
            
            $('[data-toggle-content="' + id + '"]').on('click', function(event) {
                $panel.removeClass(settings.classNames.headers);
                $tabLink.click();
                event.preventDefault();
            });

            $tabLi.append($tabLink);
            $tabList.append($tabLi);

            tabs.push($tabLi);
        };

        $tabListWrapper
            .addClass(settings.classNames.tabItems);
        
        if ( settings.tabLabel)
            $tabListWrapper.append($tabLabel);

        $tabListWrapper
            .append($tabList);

        $container
            .addClass(settings.classNames.tabs)
            .prepend($tabListWrapper);

        $('html').on('click', removeActiveState);

        if ( settings.tabLabel)
            $tabLabel.on('click', labelToggleActive);

        $panels
            .each(parsePanels)
            .addClass(settings.classNames.content);

        $(tabs[settings.activeIndex])
            .find('a')
            .click();

        return {
            'destroy': destroy
        }
    }

    $.fn.contentSwitcher = function(args) {
        return this.each(function(){
            if (undefined == $(this).data('contentSwitcher')) {
                var plugin = new ContentSwitcher(this, args);
                $(this).data('contentSwitcher', plugin);
            }
        });
    };

})();