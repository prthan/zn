(function(window)
{
  var component =
  {
    name: "emptycomp",
    package: "zn.ui.components"
  }

  component.create=(options)=>
  {
    let znc=new EmptyComp(options);
    return znc;
  }

  component.get=(name)=>
  {
    return $(`[zn-emptycomp='${name}']`).get()[0].znc;
  }

  let EmptyComp=function(options)
  {
    this.options=options;
    this.value=options.value;
    this.eventHandlers={};
  }

  EmptyComp.prototype.init=function()
  {
    let emptycomp=this;
    emptycomp.$target=$(emptycomp.options.target);
    emptycomp.setupUI();
    emptycomp.setupEventHandlers();
    emptycomp.$target.get()[0].znc=emptycomp;
    emptycomp.fireEvent("init");
  }

  EmptyComp.prototype.on=function(eventName, eventHandler)
  {
    let emptycomp=this;
    (emptycomp.eventHandlers[eventName]=emptycomp.eventHandlers[eventName] || []).push(eventHandler);
  }

  EmptyComp.prototype.fireEvent=function(eventName, event)
  {
    let emptycomp=this;
    let evt=event || {};
    evt.source=emptycomp;
    (emptycomp.eventHandlers[eventName] || []).forEach((eh)=>eh(evt));
  }

  EmptyComp.prototype.setValue=function(v) {this.value=value;}

  EmptyComp.prototype.getValue=function() {return this.value;}

  EmptyComp.prototype.setupUI=function()
  {
    let emptycomp=this;
    emptycomp.$target.html(component.html.emptycomp);
  }

  EmptyComp.prototype.setupEventHandlers=function()
  {
    let emptycomp=this;
  }

  component.html={};

  component.html.emptycomp=function()
  {
    return ``;
  };

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

  component.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[component.name]=component;

})(window);

