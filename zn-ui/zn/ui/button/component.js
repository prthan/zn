(function(window)
{
  var component =
  {
    name: "button",
    package: "zn.ui.components"
  }

  component.create=(options)=>
  {
    let znc=new Button(options);
    return znc;
  }

  component.get=(name)=>
  {
    return $(`[zn-text-field='${name}']`).get()[0].znc;
  }

  let Button=function(options)
  {
    this.options=options;
    this.eventHandlers={};
  }

  Button.prototype.init=function()
  {
    let button=this;
    button.$target=$(button.options.target);
    button.$target.addClass("zn-button");
    button.$target.attr("title", button.options.title);
    button.$target.attr("data-type", button.options.type);

    button.setupUI();
    button.setupEventHandlers();
    button.$target.znc=button;
    button.fireEvent("init");
  }

  Button.prototype.on=function(eventName, eventHandler)
  {
    let button=this;
    (button.eventHandlers[eventName]=button.eventHandlers[eventName] || []).push(eventHandler);
  }

  Button.prototype.fireEvent=function(eventName, event)
  {
    let button=this;
    let evt=event || {};
    evt.source=button;
    (button.eventHandlers[eventName] || []).forEach((eh)=>eh(evt));
  }

  Button.prototype.setValue=function(v) {this.value=value;}

  Button.prototype.getValue=function() {return this.value;}

  Button.prototype.setupUI=function()
  {
    let button=this;
    button.$target.html(component.html.button(button.options));
  }

  Button.prototype.setupEventHandlers=function()
  {
    let button=this;
    button.$target.on("click", (evt)=>
    {
      button.fireEvent("action", {action: button.options.action});
    })
  }

  component.html={};

  component.html.button=(options)=>
  {
    return `${options.icon ? component.html.icon(options.icon) : ''}<span class="text">${options.text || ''}</span>`;
  };

  component.html.icon=(icon)=>
  {
    return `<i class="icon ${icon}"></i>`
  }

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

