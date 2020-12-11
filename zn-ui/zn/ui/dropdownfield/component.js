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
        if (!dropdownfield.$items.hasClass("showing"))
          dropdownfield.showDropdownMenuItems();
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
      dropdownfield.$items.html(DropdownField.htmlDropdownMenu(dropdownfield.options.items));
      dropdownfield.$items.addClass("showing");

      var $body = $("body");
      let hide = () =>
      {
        $body.off("mousedown.zn.ui.components.dropdownfield.itemspopup");
        $body.off("keydown.zn.ui.components.dropdownfield.itemspopup");
        dropdownfield.$items.hide();
        dropdownfield.$items.removeClass("showing");
      };
      $body.on("mousedown.zn.ui.components.dropdownfield.itemspopup", (evt) =>
      {
        if (!DropdownField.pointInContent({ x: evt.pageX, y: evt.pageY }, dropdownfield.$items))
          hide();
      });
      $body.on("keydown.zn.ui.components.dropdownfield.itemspopup", (evt) =>
      {
        if (evt.keyCode == 27)
          hide();
      });

      dropdownfield.$items.find(".zn-popup-menu-item").click((evt) =>
      {
        let $menuItem = $(evt.currentTarget);
        let newValue = $menuItem.attr("zn-value");
        let oldValue = dropdownfield.getValue();
        hide();
        dropdownfield.setValue(newValue);
        dropdownfield.fireEvent("change", { newValue: newValue, oldValue: oldValue });
      });

      let p = dropdownfield.$input.position();
      let w = dropdownfield.$input.width() + 3;
      let h = dropdownfield.$input.height();
      let top = p.top + h + 12;
      let left = p.left + 3;
      let ch = $(document).height();

      if (top + dropdownfield.$items.height() > ch)
        top = ch - dropdownfield.$items.height() - 20;

      dropdownfield.$items.width(w)
        .css("top", top + "px")
        .css("left", left + "px")
        .show();

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
      <div class="zn-dropdownfield-items zn-popup-menu-items"></div>
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
      return items.reduce((a, item)=> a + `<a class="zn-popup-menu-item" zn-value='${item.value}' title='${item.label}'><span class="zn-popup-menu-item-text">${item.label}</span></a>`, "");
    }
  
    static pointInContent(point,content)
    {
      var offset=content.offset();
      return point.x >= offset.left && 
             point.x <= (offset.left+content.width()) && 
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

