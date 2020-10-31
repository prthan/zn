(function(window)
{
  var component =
  {
    name: "textfield",
    package: "zn.ui"
  }

  component.create=(options)=>
  {
    let znc=new TextField(options);
    return znc;
  }

  component.get=(name)=>
  {
    return $(`[zn-text-field='${name}']`).get()[0].znc;
  }

  let TextField=function(options)
  {
    this.options=options;
    this.value=options.value;
    this.eventHandlers={};
  }

  TextField.prototype.init=function()
  {
    let textfield=this;
    textfield.$target=$(textfield.options.target);
    textfield.setupUI();
    textfield.setupEventHandlers();
    textfield.$target.znc=textfield;
    textfield.fireEvent("init");
  }

  TextField.prototype.on=function(eventName, eventHandler)
  {
    let textfield=this;
    (textfield.eventHandlers[eventName]=textfield.eventHandlers[eventName] || []).push(eventHandler);
  }

  TextField.prototype.fireEvent=function(eventName, event)
  {
    let textfield=this;
    let evt=event || {};
    evt.source=textfield;
    (textfield.eventHandlers[eventName] || []).forEach((eh)=>eh(evt));
  }

  TextField.prototype.setValue=function(v) {this.value=value;}

  TextField.prototype.getValue=function() {return this.value;}

  TextField.prototype.setupUI=function()
  {
    let textfield=this;
    textfield.$target.html(component.html.textfield);
  }

  TextField.prototype.setupEventHandlers=function()
  {
    let textfield=this;
  }

  component.html={};

  component.html.textfield=`

  `;

  component.format=(v, t, f)=>
  {
    if(t==null || f == null || f == "") return v;
    if(t=="number") return numeral(v).format(f);
    if(t=="date") return moment(v).format(f);
    return v;
  }

  component.pointInContent = function(point,content)
  {
    var offset=content.offset();
    return point.x >= offset.left && 
           point.x <= (offset.left+content.width()) && 
           point.y >= offset.top &&
           point.y <= (offset.top+content.height());
  }

  component.html.directiveTemplate= ()=>
  {
    return ``;
  }

  component.directiveLinkFn=function(scope, element, attrs)
  {
    let htmlElement=element.get()[0];
    
    scope.$watch("columns",function(nv,ov)
    {
      if(!nv) return;
      let options={};
      options.target=htmlElement;

      let znc=new TextField(options);
      znc.init();
    });
  }

  component.directive=function()
  {
    let directive=
    {
      scope: 
      {
        name         : "@",
        value        : "=",
        onchange     : "=",
        onaction     : "="
      },
      restrict: "E",
      template: component.html.directiveTemplate(),
      replace : true,
      link: component.directiveLinkFn
    }
    return directive;
  };

  component.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[component.name]=component;

})(window);

