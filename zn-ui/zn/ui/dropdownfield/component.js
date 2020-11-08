(function(window)
{
  var component =
  {
    name: "dropdownfield",
    package: "zn.ui.components"
  }

  component.create=(options)=>
  {
    let znc=new DropdownField(options);
    return znc;
  }

  component.get=(name)=>
  {
    return $(`[zn-dropdownfield='${name}']`).get()[0].znc;
  }

  let DropdownField=function(options)
  {
    this.options=options;
    this.value=options.value;
    this.eventHandlers={};
  }

  DropdownField.prototype.init=function()
  {
    let dropdownfield=this;
    dropdownfield.$target=$(dropdownfield.options.target);

    dropdownfield.$target.addClass("zn-dropdownfield");
    dropdownfield.$target.attr("zn-dropdownfield", dropdownfield.options.name);
    if(dropdownfield.options.error) dropdownfield.$target.addClass("error");

    dropdownfield.setupUI();
    dropdownfield.setupEventHandlers();

    dropdownfield.$target.get()[0].znc=dropdownfield;
    dropdownfield.setValue(dropdownfield.options.value);
    dropdownfield.fireEvent("init");
  }

  DropdownField.prototype.on=function(eventName, eventHandler)
  {
    let dropdownfield=this;
    (dropdownfield.eventHandlers[eventName]=dropdownfield.eventHandlers[eventName] || []).push(eventHandler);
  }

  DropdownField.prototype.fireEvent=function(eventName, event)
  {
    let dropdownfield=this;
    let evt=event || {};
    evt.source=dropdownfield;
    evt.name=eventName;
    (dropdownfield.eventHandlers[eventName] || []).forEach((eh)=>eh(evt));
  }

  DropdownField.prototype.setValue=function(value)
  {
    let dropdownfield=this;
    dropdownfield.value=value;
    let item=component.itemForValue(dropdownfield.options.items, dropdownfield.value);
    if(item) dropdownfield.$value.text(item.label);
  }

  DropdownField.prototype.getValue=function()
  {
    return this.value;
  }
  
  DropdownField.prototype.message=function(msg, type)
  {
    let dropdownfield=this;
    if(!msg) return;
    if(msg!="")
    {
      dropdownfield.$msg.text(msg);
      if(type=="error") dropdownfield.$target.addClass("error");
      else dropdownfield.$target.addClass("message");
    }
    else if(msg=="")
    {
      dropdownfield.$msg.text("");
      dropdownfield.$target.removeClass("error").removeClass("message");
    }
  }
  DropdownField.prototype.setupUI=function()
  {
    let dropdownfield=this;
    dropdownfield.$target.html(component.html.dropdownfield(dropdownfield.options));
    dropdownfield.$value=dropdownfield.$target.find(".value");
    dropdownfield.$input=dropdownfield.$target.find(".zn-dropdownfield-input");
    dropdownfield.$items=dropdownfield.$target.find(".zn-dropdownfield-items");
    dropdownfield.$msg=dropdownfield.$target.find(".zn-dropdownfield-msg");
  }

  DropdownField.prototype.setupEventHandlers=function()
  {
    let dropdownfield=this;
    dropdownfield.$target.find(".zn-dropdownfield-input").on("keydown", (evt)=>
    {
      if(evt.keyCode!=40) return;
      if(!dropdownfield.$items.hasClass("showing")) dropdownfield.showDropdownMenuItems();
    })
    dropdownfield.$target.find(".zn-dropdownfield-input").on("focus", (evt)=>
    {
      dropdownfield.$target.addClass("focused");
    })
    .on("blur", (evt)=>
    {
      dropdownfield.$target.removeClass("focused");
    })
    .on("click", (evt)=>
    {
      dropdownfield.showDropdownMenuItems();
    })

  }

  DropdownField.prototype.showDropdownMenuItems=function()
  {
    let dropdownfield=this;
    dropdownfield.$items.html(component.html.dropdownMenu(dropdownfield.options.items));
    dropdownfield.$items.addClass("showing");

    var $body=$("body");
    let hide=()=>
    {
      $body.off("mousedown.zn.ui.components.dropdownfield.itemspopup");
      $body.off("keydown.zn.ui.components.dropdownfield.itemspopup");
      dropdownfield.$items.hide();
      dropdownfield.$items.removeClass("showing");
    }
    $body.on("mousedown.zn.ui.components.dropdownfield.itemspopup",(evt)=>
    {
      if(!component.pointInContent({x:evt.pageX,y:evt.pageY}, dropdownfield.$items)) hide();
    });
    $body.on("keydown.zn.ui.components.dropdownfield.itemspopup",(evt)=>
    {
      if(evt.keyCode==27) hide();
    });

    dropdownfield.$items.find(".zn-popup-menu-item").click((evt)=>
    {
      let $menuItem=$(evt.currentTarget);
      let newValue=$menuItem.attr("zn-value");
      let oldValue=dropdownfield.getValue();
      hide();
      dropdownfield.setValue(newValue);
      dropdownfield.fireEvent("change", {newValue: newValue, oldValue: oldValue});
    })

    let p=dropdownfield.$input.position();
    let w=dropdownfield.$input.width() + 3;
    let h=dropdownfield.$input.height();
    let top=p.top + h + 12;
    let left=p.left + 3;
    let ch=$(document).height();

    if(top+dropdownfield.$items.height() > ch) top=ch-dropdownfield.$items.height()-20;

    dropdownfield.$items.width(w)
                        .css("top", top+"px")
                        .css("left", left+"px")
                        .show();

  }

  component.html={};

  component.html.dropdownfield=(options)=>
  {
    return `
    ${options.label ? component.html.label(options.label) : ''}
    <div class="zn-dropdownfield-input" tabindex="0"><span class="value"></span><span class="action"><i class="fas fa-caret-down"></i></span></div>
    <div class="zn-dropdownfield-msg">${options.error || options.message || ''}</div>
    <div class="zn-dropdownfield-items zn-popup-menu-items"></div>
    `;
  };

  component.html.icon=(icon)=>
  {
    return `<i class="icon ${icon}"></i>`
  }

  component.html.label=(label)=>
  {
    return `<div class="zn-dropdownfield-label">${label}</div>`
  }

  component.html.dropdownMenu=(items)=>
  {
    if(!items) return "";
    return items.reduce((a, item)=> a + `<a class="zn-popup-menu-item" zn-value='${item.value}' title='${item.label}'><span class="zn-popup-menu-item-text">${item.label}</span></a>`, "");
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
    if(!items) return null;
    
    let result=items.filter((i)=>{return i.value==value});
    return result.length==0 ? null : result[0];
  }

  component.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[component.name]=component;

})(window);

