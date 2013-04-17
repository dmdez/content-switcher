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
    
    HTMLElement.prototype.hasClass = function(className) {
        return new RegExp(' ' + className + ' ').test(' ' + this.className + ' ');
    };
    
    HTMLElement.prototype.addClass = function(className) {
        var elem = this;
        if (!elem.hasClass(className)) {
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
    
    HTMLElement.prototype.getChildren = function() {
        var children = this.childNodes;
        var _c = [];
        for ( var i=0; i < children.length; i++) {
            if ( children[i].nodeType != 3 )
                _c.push(children[i]);
        }
        return _c;
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

        var panels = container.getChildren();
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
        
        var parsePanel = function(panel, index) {
            
        }

        tabListWrapper
            .addClass(settings.classNames.tabItems);
        
        if ( settings.tabLabel)
            tabListWrapper.appendChild(tabLabel);

        tabListWrapper
            .appendChild(tabList);

        container.addClass(settings.classNames.tabs);
        container.insertBefore(tabListWrapper, container.firstChild);

        document.onclick = removeActiveState;

        if ( settings.tabLabel)
            tabLabel.onclick = labelToggleActive;

        
        for ( var i=0; i < panels.length; i++ ) {
            parsePanel(panels[i]);
            panels[i].addClass(settings.classNames.content);    
        }        

        //$(tabs[settings.activeIndex])
          //  .find('a')
            //.click();

        return {
            'destroy': destroy
        };
    }
    
    window.contentSwitcher = ContentSwitcher;


})();