(function(window)
{
  var component =
  {
    name: "checkboxfield",
    package: "zn.ui.components"
  }

  component.create=(options)=>
  {
    let znc=new CheckboxField(options);
    return znc;
  }

  component.get=(name)=>
  {
    return $(`[zn-checkboxfield='${name}']`).get()[0].znc;
  }

  let CheckboxField=function(options)
  {
    this.options=options;
    this.value=options.value;
    this.eventHandlers={};
    this.options.values = this.options.values || {on: true, off: false};
  }

  CheckboxField.prototype.init=function()
  {
    let checkboxfield=this;
    checkboxfield.$target=$(checkboxfield.options.target);

    checkboxfield.$target.addClass("zn-checkboxfield");
    checkboxfield.$target.attr("zn-checkboxfield", checkboxfield.options.name);
    if(checkboxfield.options.error) checkboxfield.$target.addClass("error");

    checkboxfield.setupUI();
    checkboxfield.setupEventHandlers();

    checkboxfield.$target.get()[0].znc=checkboxfield;
    checkboxfield.setValue(checkboxfield.options.value);
    checkboxfield.fireEvent("init");
  }

  CheckboxField.prototype.on=function(eventName, eventHandler)
  {
    let checkboxfield=this;
    (checkboxfield.eventHandlers[eventName]=checkboxfield.eventHandlers[eventName] || []).push(eventHandler);
  }

  CheckboxField.prototype.fireEvent=function(eventName, event)
  {
    let checkboxfield=this;
    let evt=event || {};
    evt.source=checkboxfield;
    evt.name=eventName;
    (checkboxfield.eventHandlers[eventName] || []).forEach((eh)=>eh(evt));
  }

  CheckboxField.prototype.setValue=function(value) 
  {
    let checkboxfield=this;
    checkboxfield.value=value;
    checkboxfield.$input.attr("data-state", value && checkboxfield.options.values.on==value ? "on" : "off");
  }

  CheckboxField.prototype.getValue=function() {return this.value;}

  CheckboxField.prototype.message=function(msg, type)
  {
    let checkboxfield=this;
    if(!msg) return;
    if(msg!="")
    {
      checkboxfield.$msg.text(msg);
      if(type=="error") checkboxfield.$target.addClass("error");
      else checkboxfield.$target.addClass("message");
    }
    else if(msg=="")
    {
      checkboxfield.$msg.text("");
      checkboxfield.$target.removeClass("error").removeClass("message");
    }
  }

  CheckboxField.prototype.setupUI=function()
  {
    let checkboxfield=this;
    checkboxfield.$target.html(component.html.checkboxfield(checkboxfield.options));
    checkboxfield.$input=checkboxfield.$target.find(".zn-checkboxfield-input");
    checkboxfield.$msg=checkboxfield.$target.find(".zn-checkboxfield-msg");
  }

  CheckboxField.prototype.setupEventHandlers=function()
  {
    let checkboxfield=this;
    checkboxfield.$target.find(".zn-checkboxfield-input").on("click", (evt)=>
    {
      let $input=$(evt.currentTarget);
      let state = $input.attr("data-state") == "on" ? "off" : "on";
      $input.attr("data-state", state);

      let oldValue=checkboxfield.value;
      let newValue=checkboxfield.options.values[state];
      checkboxfield.value=newValue;
      checkboxfield.fireEvent("change", {newValue: newValue, oldValue: oldValue});
    })
    .on("keypress", (evt)=>
    {
      if(evt.keyCode!=32) return;
      let $input=$(evt.currentTarget);
      let state = $input.attr("data-state") == "on" ? "off" : "on";
      $input.attr("data-state", state);

      let oldValue=checkboxfield.value;
      let newValue=checkboxfield.options.values[state];
      checkboxfield.value=newValue;
      checkboxfield.fireEvent("change", {newValue: newValue, oldValue: oldValue});
    });

    checkboxfield.$target.find(".zn-checkboxfield-input").on("focus", (evt)=>
    {
      checkboxfield.$target.addClass("focused");
    })
    checkboxfield.$target.find(".zn-checkboxfield-input").on("blur", (evt)=>
    {
      checkboxfield.$target.removeClass("focused");
    })
  }

  component.html={};

  component.html.checkboxfield=(options)=>
  {
    return `
    ${options.label ? component.html.label(options.label) : ''}
    <div class="zn-checkboxfield-input" tabindex="0" data-state="off">
      <i class="state-off far fa-square"></i><i class="state-on fas fa-check-square"></i>
      <span class="text">${options.text || ''}</span>
    </div>
    <div class="zn-checkboxfield-msg">${options.error || options.message || ''}</div>
    `;
  };

  component.html.icon=(icon)=>
  {
    return `<i class="icon ${icon}"></i>`
  }

  component.html.label=(label)=>
  {
    return `<div class="zn-checkboxfield-label">${label}</div>`
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

