(function(window)
{
  let __package = "zn.ui.components";
  let __name = "DropdownField";


  class DropdownField
  {
    constructor(options)
    {
      this.options = options;
      this.value = options.value;
      this.eventHandlers = {};
    }

    init()
    {
      let dropdownfield = this;
      dropdownfield.$target = $(dropdownfield.options.target);

      dropdownfield.$target.addClass("zn-dropdownfield");
      dropdownfield.$target.attr("zn-dropdownfield", dropdownfield.options.name);
      if (dropdownfield.options.error)
        dropdownfield.$target.addClass("error");

      dropdownfield.setupUI();
      dropdownfield.setupEventHandlers();

      dropdownfield.$target.get()[0].znc = dropdownfield;
      dropdownfield.setValue(dropdownfield.options.value);
      dropdownfield.fireEvent("init");
    }
    on(eventName, eventHandler)
    {
      let dropdownfield = this;
      (dropdownfield.eventHandlers[eventName] = dropdownfield.eventHandlers[eventName] || []).push(eventHandler);
    }
    fireEvent(eventName, event)
    {
      let dropdownfield = this;
      let evt = event || {};
      evt.source = dropdownfield;
      evt.name = eventName;
      (dropdownfield.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }
    setValue(value)
    {
      let dropdownfield = this;
      dropdownfield.value = value;
      let item = DropdownField.itemForValue(dropdownfield.options.items, dropdownfield.value);
      if (item) dropdownfield.$value.text(item.label).removeClass("placeholder");
      else dropdownfield.$value.text(dropdownfield.options.placeholder || "").addClass("placeholder");
    }
    getValue()
    {
      return this.value;
    }
    message(msg, type)
    {
      let dropdownfield = this;
      if (msg != "")
      {
        dropdownfield.$msg.text(msg);
        if (type == "error") dropdownfield.$target.addClass("error");
        else dropdownfield.$target.addClass("message");
      }
      else
      {
        dropdownfield.$msg.text("");
        dropdownfield.$target.removeClass("error").removeClass("message");
      }
    }
    setupUI()
    {
      let dropdownfield = this;
      dropdownfield.$target.html(DropdownField.html(dropdownfield.options));
      dropdownfield.$value = dropdownfield.$target.find(".value");
      dropdownfield.$input = dropdownfield.$target.find(".zn-dropdownfield-input");
      dropdownfield.$items = dropdownfield.$target.find(".zn-dropdownfield-items");
      dropdownfield.$msg = dropdownfield.$target.find(".zn-dropdownfield-msg");
    }
    setupEventHandlers()
    {
      let dropdownfield = this;
      dropdownfield.$target.find(".zn-dropdownfield-input").on("keydown", (evt) =>
      {
        if (evt.keyCode != 40)
          return;
        if (!dropdownfield.$items) dropdownfield.showDropdownMenuItems();
      });
      dropdownfield.$target.find(".zn-dropdownfield-input").on("focus", (evt) =>
      {
        dropdownfield.$target.addClass("focused");
      })
      .on("blur", (evt) =>
      {
        dropdownfield.$target.removeClass("focused");
      })
      .on("click", (evt) =>
      {
        dropdownfield.showDropdownMenuItems();
      });

    }
    showDropdownMenuItems()
    {
      let dropdownfield = this;
      $("body").append(`<div class="zn-dropdownfield-items"></div>`);
      dropdownfield.$items=$(".zn-dropdownfield-items");
      dropdownfield.$items.html(DropdownField.htmlDropdownMenu(dropdownfield.options.items));

      var $body = $("body");
      let hide = () =>
      {
        $body.off("mousedown.zn.ui.components.dropdownfield.itemspopup");
        $body.off("keydown.zn.ui.components.dropdownfield.itemspopup");
        //dropdownfield.$items.hide();
        //dropdownfield.$items.removeClass("showing");
        dropdownfield.$items.remove();
        dropdownfield.$items=null;
      };
      $body.on("mousedown.zn.ui.components.dropdownfield.itemspopup", (evt) =>
      {
        if (!DropdownField.pointInContent({ x: evt.pageX, y: evt.pageY }, dropdownfield.$items)) hide();
      });
      $body.on("keydown.zn.ui.components.dropdownfield.itemspopup", (evt) =>
      {
        if (evt.keyCode == 27) hide();
      });

      dropdownfield.$items.find(".zn-dropdownfield-item").click((evt) =>
      {
        let $menuItem = $(evt.currentTarget);
        let newValue = $menuItem.attr("zn-value");
        let oldValue = dropdownfield.getValue();
        hide();
        if(newValue!=oldValue)
        {
          dropdownfield.setValue(newValue);
          dropdownfield.fireEvent("change", { newValue: newValue, oldValue: oldValue });
        }
      });

      dropdownfield.$items.show();
      let inputRect=dropdownfield.$input.get()[0].getBoundingClientRect();
      let itemsRect=dropdownfield.$items.get()[0].getBoundingClientRect();

      let left=inputRect.x;
      let top= inputRect.y + inputRect.height + 1;
      let wh = $(window).height();
      if (top + itemsRect.height > wh) top =  wh - itemsRect.height;
      top += $(window).scrollTop();
      dropdownfield.$items.css("top", top + "px").css("left", left + "px").css("width", (inputRect.width > 100 ? inputRect.width : 100) + "px");

    }

    static get(name)
    {
      return $(`[zn-dropdownfield='${name}']`).get()[0].znc;
    }
  
    static html(options)
    {
      return `
      ${options.label ? DropdownField.htmlLabel(options.label) : ''}
      <div class="zn-dropdownfield-input" tabindex="0"><span class="value placeholder">${options.placeholder}</span><span class="action"><i class="fas fa-caret-down"></i></span></div>
      <div class="zn-dropdownfield-msg">${options.error || options.message || ''}</div>
      `;
    };
  
    static htmlIcon(icon)
    {
      return `<i class="icon ${icon}"></i>`
    }
  
    static htmlLabel(label)
    {
      return `<div class="zn-dropdownfield-label">${label}</div>`
    }
  
    static htmlDropdownMenu(items)
    {
      if(!items) return "";
      return items.reduce((a, item)=> a + `<a class="zn-dropdownfield-item" zn-value='${item.value}' title='${item.label}'><span class="zn-dropdownfield-item-text">${item.label}</span></a>`, "");
    }
  
    static pointInContent(point,content)
    {
      let offset=content.offset();
      let w=content.get()[0].offsetWidth;
      return point.x >= offset.left && 
             point.x <= (offset.left+w) && 
             point.y >= offset.top &&
             point.y <= (offset.top+content.height());
    }
  
    static itemForValue(items, value)
    {
      if(!items) return null;
      
      let result=items.filter((i)=>{return i.value==value});
      return result.length==0 ? null : result[0];
    }
  
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = DropdownField;

})(window);

