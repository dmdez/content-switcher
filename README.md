# Content Switcher

Most web apps these days seem to have the need for content-changing components such as tabs, accordions and dropdowns to switch out blocks of content.  Hopefully, this small jQuery plugin will cover all of those needs, especially in responsive context.

What this plugin does is take a block of semantic content and adds some events and markup to give that HTML the ability to swap out those 3 main components with just css.

## Markup
```
<div class="container">
    <section id="porter">
        <h3>Header</h3>
        <div class="content">
            ...
        </div>
    </section>
    <section id="..">
        <h3>Header</h3>
        <div class="content">
            ...
        </div>
    </section>
</div>
```

## Usage
*All options are optional*
```
$('.container').contentSwitcher({
    'header'       : '> h3', 
    'activeIndex'  : 0, 
    'onChange'     : null,
    'headerAsHtml' : false,
    'toggleHeaders': false,
    'tabLabel'     : true,
    'classNames': {
        'content'  : 'tabbed-content',
        'active'   : 'active',
        'tabs'     : 'tabs',
        'tabItems' : 'tab-items',
        'tabLabel' : 'tab-label button button-dropdown',
        'headers'  : 'header-inactive'
    }
});
```

## Trigger with a data attribute
```
<a href="#porter" data-toggle-content="porter">Trigger Porter Section</a>
```

## Demo
http://dmdez.github.io/content-switcher/
