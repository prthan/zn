(function(window)
{
  var component =
  {
    name: "radiogroup",
    package: "zn.ui"
  }

  component.create=(options)=>
  {
    let znc=new RadioGroup(options);
    return znc;
  }

  component.get=(name)=>
  {
    return $(`[zn-radiogroup='${name}']`).get()[0].znc;
  }

  let RadioGroup=function(options)
  {
    this.options=options;
    this.value=options.value;
    this.eventHandlers={};
    this.options.values = this.options.values || {on: true, off: false};
  }

  RadioGroup.prototype.init=function()
  {
    let radiogroup=this;
    radiogroup.$target=$(radiogroup.options.target);

    radiogroup.$target.addClass("zn-radiogroup");
    radiogroup.$target.attr("zn-radiogroup", radiogroup.options.name);
    if(radiogroup.options.layout==="horizontal") radiogroup.$target.addClass("horizontal");
    
    radiogroup.setupUI();
    radiogroup.setupEventHandlers();

    radiogroup.$target.znc=radiogroup;
    radiogroup.setValue(radiogroup.options.value);
    radiogroup.fireEvent("init");
  }

  RadioGroup.prototype.on=function(eventName, eventHandler)
  {
    let radiogroup=this;
    (radiogroup.eventHandlers[eventName]=radiogroup.eventHandlers[eventName] || []).push(eventHandler);
  }

  RadioGroup.prototype.fireEvent=function(eventName, event)
  {
    let radiogroup=this;
    let evt=event || {};
    evt.source=radiogroup;
    evt.name=eventName;
    (radiogroup.eventHandlers[eventName] || []).forEach((eh)=>eh(evt));
  }

  RadioGroup.prototype.setValue=function(value) 
  {
    let radiogroup=this;
    radiogroup.value=value;
    radiogroup.$input.find(`.zn-radiogroup-item[data-state='on']`).attr("data-state", "off");
    if(value) radiogroup.$input.find(`.zn-radiogroup-item[data-value='${value}']`).attr("data-state", "on");
  }

  RadioGroup.prototype.getValue=function() {return this.value;}

  RadioGroup.prototype.setupUI=function()
  {
    let radiogroup=this;
    radiogroup.$target.html(component.html.radiogroup(radiogroup.options));
    radiogroup.$input=radiogroup.$target.find(".zn-radiogroup-input");
  }

  RadioGroup.prototype.setupEventHandlers=function()
  {
    let radiogroup=this;
    radiogroup.$target.find(".zn-radiogroup-input").on("click", ".zn-radiogroup-item", (evt)=>
    {
      radiogroup.$target.find(".zn-radiogroup-input .zn-radiogroup-item[data-state='on']").attr("data-state", "off");
      let $item=$(evt.currentTarget);
      $item.attr("data-state", "on");

      let oldValue=radiogroup.value;
      let newValue=component.itemForValue(radiogroup.options.items, $item.attr("data-value")).value;
      radiogroup.value=newValue;
      radiogroup.fireEvent("change", {newValue: newValue, oldValue: oldValue});
    })
    .on("keypress", ".zn-radiogroup-item", (evt)=>
    {
      if(evt.keyCode!=32) return;
      radiogroup.$target.find(".zn-radiogroup-input .zn-radiogroup-item[data-state='on']").attr("data-state", "off");
      let $item=$(evt.currentTarget);
      $item.attr("data-state", "on");

      let oldValue=radiogroup.value;
      let newValue=component.itemForValue(radiogroup.options.items, $item.attr("data-value")).value;
      radiogroup.value=newValue;
      radiogroup.fireEvent("change", {newValue: newValue, oldValue: oldValue});

    });

    radiogroup.$target.find(".zn-radiogroup-input").on("focus", ".zn-radiogroup-item", (evt)=>
    {
      let $item=$(evt.currentTarget);
      $item.addClass("focused");
    })
    radiogroup.$target.find(".zn-radiogroup-input").on("blur", ".zn-radiogroup-item", (evt)=>
    {
      let $item=$(evt.currentTarget);
      $item.removeClass("focused");
    })
  }

  component.html={};

  component.html.radiogroup=(options)=>
  {
    return `
    ${options.label ? component.html.label(options.label) : ''}
    <div class="zn-radiogroup-input">
      ${options.items.reduce((a,c) => a + component.html.item(c), "")}
    </div>
    <div class="zn-radiogroup-msg"></div>
    `;
  };

  component.html.icon=(icon)=>
  {
    return `<i class="icon ${icon}"></i>`
  }

  component.html.label=(label)=>
  {
    return `<div class="zn-radiogroup-label">${label}</div>`
  }

  component.html.item=(item)=>
  {
    return `
    <div class="zn-radiogroup-item" tabindex="0" data-state="off" data-value="${item.value}">
      <i class="state-off far fa-circle"></i><i class="state-on fas fa-check-circle"></i>
      <span class="text">${item.label}</span>
    </div>
    `
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

  component.itemForValue=(items, value)=>
  {
    let result=items.filter((i)=>{return i.value==value});
    return result.length==0 ? null : result[0];
  }

  component.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[component.name]=component;

})(window);

