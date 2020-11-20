(function(window)
{
  let __package = "zn.ui.components";
  let __name = "RadioGroup";

  class RadioGroup
  {
    constructor(options)
    {
      this.options = options;
      this.value = options.value;
      this.eventHandlers = {};
      this.options.values = this.options.values || { on: true, off: false };
    }

    init()
    {
      let radiogroup = this;
      radiogroup.$target = $(radiogroup.options.target);

      radiogroup.$target.addClass("zn-radiogroup");
      radiogroup.$target.attr("zn-radiogroup", radiogroup.options.name);
      if (radiogroup.options.layout === "horizontal") radiogroup.$target.addClass("horizontal");
      if (radiogroup.options.error) radiogroup.$target.addClass("error");

      radiogroup.setupUI();
      radiogroup.setupEventHandlers();

      radiogroup.$target.get()[0].znc = radiogroup;
      radiogroup.setValue(radiogroup.options.value);
      radiogroup.fireEvent("init");
    }

    on(eventName, eventHandler)
    {
      let radiogroup = this;
      (radiogroup.eventHandlers[eventName] = radiogroup.eventHandlers[eventName] || []).push(eventHandler);
    }

    fireEvent(eventName, event)
    {
      let radiogroup = this;
      let evt = event || {};
      evt.source = radiogroup;
      evt.name = eventName;
      (radiogroup.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }

    setValue(value)
    {
      let radiogroup = this;
      radiogroup.options.value = value;
      radiogroup.value = value;
      radiogroup.$input.find(`.zn-radiogroup-item[data-state='on']`).attr("data-state", "off");
      if (radiogroup.value) radiogroup.$input.find(`.zn-radiogroup-item[data-value='${radiogroup.value}']`).attr("data-state", "on");
    }

    getValue() { return this.value; }

    message(msg, type)
    {
      let radiogroup = this;
      if (msg != "")
      {
        radiogroup.$msg.text(msg);
        if (type == "error") radiogroup.$target.addClass("error");
        else radiogroup.$target.addClass("message");
      }
      else
      {
        radiogroup.$msg.text("");
        radiogroup.$target.removeClass("error").removeClass("message");
      }
    }

    setupUI()
    {
      let radiogroup = this;
      radiogroup.$target.html(RadioGroup.html(radiogroup.options));
      radiogroup.$input = radiogroup.$target.find(".zn-radiogroup-input");
      radiogroup.$msg = radiogroup.$target.find(".zn-radiogroup-msg");
    }

    setupEventHandlers()
    {
      let radiogroup = this;
      radiogroup.$target.find(".zn-radiogroup-input")
      .on("click", ".zn-radiogroup-item", (evt) =>
      {
        radiogroup.$target.find(".zn-radiogroup-input .zn-radiogroup-item[data-state='on']").attr("data-state", "off");
        let $item = $(evt.currentTarget);
        $item.attr("data-state", "on");

        let oldValue = radiogroup.value;
        let newValue = RadioGroup.itemForValue(radiogroup.options.items, $item.attr("data-value")).value;
        radiogroup.value = newValue;
        radiogroup.fireEvent("change", { newValue: newValue, oldValue: oldValue });
      })
      .on("keypress", ".zn-radiogroup-item", (evt) =>
      {
        if (evt.keyCode != 32) return;
        radiogroup.$target.find(".zn-radiogroup-input .zn-radiogroup-item[data-state='on']").attr("data-state", "off");
        let $item = $(evt.currentTarget);
        $item.attr("data-state", "on");

        let oldValue = radiogroup.value;
        let newValue = RadioGroup.itemForValue(radiogroup.options.items, $item.attr("data-value")).value;
        radiogroup.value = newValue;
        radiogroup.fireEvent("change", { newValue: newValue, oldValue: oldValue });

      });

      radiogroup.$target.find(".zn-radiogroup-input").on("focus", ".zn-radiogroup-item", (evt) =>
      {
        let $item = $(evt.currentTarget);
        $item.addClass("focused");
      });
      
      radiogroup.$target.find(".zn-radiogroup-input").on("blur", ".zn-radiogroup-item", (evt) =>
      {
        let $item = $(evt.currentTarget);
        $item.removeClass("focused");
      });
    }

    static get(name)
    {
      return $(`[zn-radiogroup='${name}']`).get()[0].znc;
    }
  
    static html(options)
    {
      return `
      ${options.label ? RadioGroup.htmlLabel(options.label) : ''}
      <div class="zn-radiogroup-input">
        ${RadioGroup.htmlItems(options.items, options.value)}
      </div>
      <div class="zn-radiogroup-msg">${options.error || options.message || ''}</div>
      `;
    };
  
    static htmlIcon(icon)
    {
      return `<i class="icon ${icon}"></i>`
    }
  
    static htmlLabel(label)
    {
      return `<div class="zn-radiogroup-label">${label}</div>`
    }
  
    static htmlItems(items, value)
    {
      return items.reduce((a,c) => a + RadioGroup.htmlItem(c, value), "");
    }
  
    static htmlItem(item, value)
    {
      return `
      <div class="zn-radiogroup-item" tabindex="0" data-state="${item.value==value ? 'on' : 'off'}" data-value="${item.value}">
        <i class="state-off far fa-circle"></i><i class="state-on fas fa-check-circle"></i>
        <span class="text">${item.label}</span>
      </div>
      `
    }

    static itemForValue(items, value)
    {
      let result=items.filter((i)=>{return i.value==value});
      return result.length==0 ? null : result[0];
    }
  }
 
  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = RadioGroup;

})(window);

