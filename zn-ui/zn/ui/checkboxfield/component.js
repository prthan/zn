(function(window)
{
  let __package = "zn.ui.components";
  let __name = "CheckboxField";

 
  class CheckboxField
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
      let checkboxfield = this;
      checkboxfield.$target = $(checkboxfield.options.target);

      checkboxfield.$target.addClass("zn-checkboxfield");
      checkboxfield.$target.attr("zn-checkboxfield", checkboxfield.options.name);
      if (checkboxfield.options.error) checkboxfield.$target.addClass("error");

      checkboxfield.setupUI();
      checkboxfield.setupEventHandlers();

      checkboxfield.$target.get()[0].znc = checkboxfield;
      checkboxfield.setValue(checkboxfield.options.value);
      checkboxfield.fireEvent("init");
    }

    on(eventName, eventHandler)
    {
      let checkboxfield = this;
      (checkboxfield.eventHandlers[eventName] = checkboxfield.eventHandlers[eventName] || []).push(eventHandler);
    }

    fireEvent(eventName, event)
    {
      let checkboxfield = this;
      let evt = event || {};
      evt.source = checkboxfield;
      evt.name = eventName;
      (checkboxfield.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }

    setValue(value)
    {
      let checkboxfield = this;
      checkboxfield.value = value;
      checkboxfield.$input.attr("data-state", value && checkboxfield.options.values.on == value ? "on" : "off");
    }

    getValue() { return this.value; }
    
    message(msg, type)
    {
      let checkboxfield = this;
      if (msg != "")
      {
        checkboxfield.$msg.text(msg);
        if (type == "error") checkboxfield.$target.addClass("error");
        else checkboxfield.$target.addClass("message");
      }
      else
      {
        checkboxfield.$msg.text("");
        checkboxfield.$target.removeClass("error").removeClass("message");
      }
    }

    setupUI()
    {
      let checkboxfield = this;
      checkboxfield.$target.html(CheckboxField.html(checkboxfield.options));
      checkboxfield.$input = checkboxfield.$target.find(".zn-checkboxfield-input");
      checkboxfield.$msg = checkboxfield.$target.find(".zn-checkboxfield-msg");
    }
    
    setupEventHandlers()
    {
      let checkboxfield = this;
      checkboxfield.$target.find(".zn-checkboxfield-input")
      .on("click", (evt) =>
      {
        let $input = $(evt.currentTarget);
        let state = $input.attr("data-state") == "on" ? "off" : "on";
        $input.attr("data-state", state);

        let oldValue = checkboxfield.value;
        let newValue = checkboxfield.options.values[state];
        checkboxfield.value = newValue;
        checkboxfield.fireEvent("change", { newValue: newValue, oldValue: oldValue });
      })
      .on("keypress", (evt) =>
      {
        if (evt.keyCode != 32)
          return;
        let $input = $(evt.currentTarget);
        let state = $input.attr("data-state") == "on" ? "off" : "on";
        $input.attr("data-state", state);

        let oldValue = checkboxfield.value;
        let newValue = checkboxfield.options.values[state];
        checkboxfield.value = newValue;
        checkboxfield.fireEvent("change", { newValue: newValue, oldValue: oldValue });
      });

      checkboxfield.$target.find(".zn-checkboxfield-input").on("focus", (evt) =>
      {
        checkboxfield.$target.addClass("focused");
      });
    
      checkboxfield.$target.find(".zn-checkboxfield-input").on("blur", (evt) =>
      {
        checkboxfield.$target.removeClass("focused");
      });
    }

    static get(name)
    {
      return $(`[zn-checkboxfield='${name}']`).get()[0].znc;
    }

    static html(options)
    {
      return `
      ${options.label ? CheckboxField.htmlLabel(options.label) : ''}
      <div class="zn-checkboxfield-input" tabindex="0" data-state="off">
        <i class="state-off far fa-square"></i><i class="state-on fas fa-check-square"></i>
        <span class="text">${options.text || ''}</span>
      </div>
      <div class="zn-checkboxfield-msg">${options.error || options.message || ''}</div>
      `;
    };
  
    static htmlIcon(icon)
    {
      return `<i class="icon ${icon}"></i>`
    }
  
    static htmlLabel(label)
    {
      return `<div class="zn-checkboxfield-label">${label}</div>`
    }
  
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = CheckboxField;

})(window);

