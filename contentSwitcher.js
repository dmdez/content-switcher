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
    
    function hasClass(element, className) {
        return new RegExp(' ' + className + ' ').test(' ' + element.className + ' ');
    };
    
    function addClass(elem, className) {
        if (!hasClass(elem, className)) {
            elem.className += ' ' + className;
        }
    };
    
    function toggleClass(elem, className) {
        var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ' ) + ' ';
        if (hasClass(elem, className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
                newClass = newClass.replace( ' ' + className + ' ' , ' ' );
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        } else {
            elem.className += ' ' + className;
        }
    };

    function removeClass(elem, remove) {
        var newClassName = "";
        var i;
        var classes = elem.className.split(" ");
        for(i = 0; i < classes.length; i++) {
            if(classes[i] !== remove) {
                newClassName += classes[i] + " ";
            }
        }
        elem.className = newClassName;
    };
    
    function getChildren(elem) {
        var children = elem.childNodes;
        var _c = [];
        for ( var i=0; i < children.length; i++) {
            if ( children[i].nodeType === 1 )
                _c.push(children[i]);
        }
        return _c;
    }
    
    function getAllElementsWithAttribute(attribute, value)
    {
      var matchingElements = [];
      var allElements = document.getElementsByTagName('*');
      for (var i = 0; i < allElements.length; i++)
      {
          var attr = allElements[i].getAttribute(attribute);
        if (attr && attr == value)
        {            
          // Element exists with attribute. Add to array.
          matchingElements.push(allElements[i]);
        }
      }
      return matchingElements;
    }
    
    function each(items, callback) {
        for ( var i=0; i < items.length; i++) {
            callback.call(items[i], i);
        }
    }
    
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

        var panels = getChildren(container);
        var tabListWrapper = document.createElement('div');
        var tabList = document.createElement('ul');
        var tabLabel = document.createElement('a');
        var tabs = [];
        var activeHeader;

        var removeActiveState = function() {
            removeClass(container, settings.classNames.active);
        };

        var labelToggleActive = function(event) {
            event.stopPropagation();
            toggleClass(container, settings.classNames.active);
            return false;
        };

        var destroy = function() {
            tabListWrapper.parentNode.removeChild(tabListWrapper);
        };
        
        var parsePanel = function(panel, index) {
            var header = panel.getElementsByTagName('h3')[0];
            var id = panel.id;
            var tabLink = document.createElement('a');
            var tabLi = document.createElement('li');
                        
            tabLink.href = '#' + id;
            tabLi.style.className = panel.style.className || '';

            var isCurrentHeader = function() {
                return (activeHeader != undefined) && activeHeader == index;
            };
            
            var tabClick = function(event) {
                var self = this;
                var activeClass = settings.classNames.active;
                var tabListLi = getChildren(tabList);
                
                each(panels, function() {
                    removeClass(this, activeClass);
                });
                
                if ( settings.toggleHeaders && !isCurrentHeader())
                    removeClass(panel, settings.classNames.headers);
                
                each(tabListLi, function() {
                    removeClass(this, activeClass);
                });             

                addClass(panel, activeClass);

                addClass(tabLi, activeClass);
                
                if ( settings.tabLabel)
                    tabLabel.innerText = self.innerText;

                if(settings.onChange)
                    settings.onChange.call(self, panel);

                activeHeader = index;

                return false;
            };
            
            header.onclick = function() {
                
                if ( settings.toggleHeaders && isCurrentHeader())
                    toggleClass(panel, settings.classNames.headers);

                tabLink.click();
            };

            tabLink.innerHTML = settings.headerAsHtml ? header.innerHTML : header.innerText;
            tabLink.onclick = tabClick;
            
            each(getAllElementsWithAttribute('data-toggle-content', id), function() {
              this.onclick = function(event) {
                  removeClass(panel, settings.classNames.headers);
                  tabLink.click();
                  return false;
              };
            });

            tabLi.appendChild(tabLink);
            tabList.appendChild(tabLi);

            tabs.push(tabLi);
            
        }

        addClass(tabListWrapper, settings.classNames.tabItems);
        
        if ( settings.tabLabel)
            tabListWrapper.appendChild(tabLabel);

        tabListWrapper
            .appendChild(tabList);

        addClass(container, settings.classNames.tabs);
        container.insertBefore(tabListWrapper, container.firstChild);

        document.onclick = removeActiveState;

        if ( settings.tabLabel)
            tabLabel.onclick = labelToggleActive;

        each(panels, function(i) {
            parsePanel(this, i); 
            addClass(this, settings.classNames.content);
        });
        
        tabs[settings.activeIndex].getElementsByTagName('a')[0].click();

        return {
            'destroy': destroy
        };
    }
    
    window.contentSwitcher = ContentSwitcher;


})();