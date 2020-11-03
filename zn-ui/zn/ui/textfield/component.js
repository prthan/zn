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
    return $(`[zn-textfield='${name}']`).get()[0].znc;
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

    textfield.$target.addClass("zn-textfield");
    textfield.$target.attr("zn-textfield", textfield.options.name);
    if(textfield.options.error) textfield.$target.addClass("error");
    
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
    evt.name=eventName;
    (textfield.eventHandlers[eventName] || []).forEach((eh)=>eh(evt));
  }

  TextField.prototype.setValue=function(value)
  {
    let textfield=this;
    textfield.value=value;
    textfield.$input.val(value);
  }

  TextField.prototype.getValue=function() {return this.value;}

  TextField.prototype.message=function(msg, type)
  {
    let textfield=this;
    if(!msg) return;
    if(msg!="")
    {
      textfield.$msg.text(msg);
      if(type=="error") textfield.$target.addClass("error");
      else textfield.$target.addClass("message");
    }
    else if(msg=="")
    {
      textfield.$msg.text("");
      textfield.$target.removeClass("error").removeClass("message");
    }
  }

  TextField.prototype.setupUI=function()
  {
    let textfield=this;
    textfield.$target.html(component.html.textfield(textfield.options));
    textfield.$input=textfield.$target.find(".zn-textfield-input input");
    textfield.$msg=textfield.$target.find(".zn-textfield-msg");
  }

  TextField.prototype.setupEventHandlers=function()
  {
    let textfield=this;
    textfield.$target.find(".zn-textfield-input input").on("change", (evt)=>
    {
      let $input=$(evt.currentTarget);
      let oldValue=textfield.getValue();
      let newValue=$input.val();
      textfield.value=newValue;
      textfield.fireEvent("change", {oldValue: oldValue, newValue: newValue});
    })
    textfield.$target.find(".zn-textfield-input input").on("keydown", (evt)=>
    {
      if(evt.keyCode!=13) return;
      textfield.fireEvent("action");
    })
    textfield.$target.find(".zn-textfield-input input").on("focus", (evt)=>
    {
      textfield.$target.addClass("focused");
    })
    textfield.$target.find(".zn-textfield-input input").on("blur", (evt)=>
    {
      textfield.$target.removeClass("focused");
    })
  }

  component.html={};

  component.html.textfield=(options)=>
  {
    return `
    ${options.label ? component.html.label(options.label) : ''}
    <div class="zn-textfield-input">${options.icon ? component.html.icon(options.icon) : ''}<input type="${options.password ? 'password' : 'text'}" value="${options.value || ''}" placeholder="${options.placeholder || ''}" ${options.readonly ? 'readonly' : ''}/></div>
    <div class="zn-textfield-msg">${options.error || options.message || ''}</div>
    `;
  };

  component.html.icon=(icon)=>
  {
    return `<i class="icon ${icon}"></i>`
  }

  component.html.label=(label)=>
  {
    return `<div class="zn-textfield-label">${label}</div>`
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

