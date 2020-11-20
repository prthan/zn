(function (window)
{
  let __package = "zn.ui.components";
  let __name = "TextField";

  class TextField
  {
    constructor(options)
    {
      this.options = options;
      this.value = options.value;
      this.eventHandlers = {};
    }
    
    init()
    {
      let textfield = this;
      textfield.$target = $(textfield.options.target);

      textfield.$target.addClass("zn-textfield");
      textfield.$target.attr("zn-textfield", textfield.options.name);
      if (textfield.options.error) textfield.$target.addClass("error");

      textfield.setupUI();
      textfield.setupEventHandlers();

      textfield.$target.get()[0].znc = textfield;
      textfield.fireEvent("init");
    }
    
    on(eventName, eventHandler)
    {
      let textfield = this;
      (textfield.eventHandlers[eventName] = textfield.eventHandlers[eventName] || []).push(eventHandler);
    }
    
    fireEvent(eventName, event)
    {
      let textfield = this;
      let evt = event || {};
      evt.source = textfield;
      evt.name = eventName;
      (textfield.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }
    
    setValue(value)
    {
      let textfield = this;
      textfield.value = value;
      textfield.$input.val(value);
    }
    
    getValue() { return this.value; }
    
    message(msg, type)
    {
      let textfield = this;
      if (msg != "")
      {
        textfield.$msg.text(msg);
        if (type == "error") textfield.$target.addClass("error");
        else textfield.$target.addClass("message");
      }
      else
      {
        textfield.$msg.text("");
        textfield.$target.removeClass("error").removeClass("message");
      }
    }

    setupUI()
    {
      let textfield = this;
      textfield.$target.html(TextField.html(textfield.options));
      textfield.$input = textfield.$target.find(".zn-textfield-input input");
      textfield.$msg = textfield.$target.find(".zn-textfield-msg");
    }

    setupEventHandlers()
    {
      let textfield = this;
      textfield.$target.find(".zn-textfield-input input").on("change", (evt) =>
      {
        let $input = $(evt.currentTarget);
        let oldValue = textfield.getValue();
        let newValue = $input.val();
        textfield.value = newValue;
        textfield.fireEvent("change", { oldValue: oldValue, newValue: newValue });
      });

      textfield.$target.find(".zn-textfield-input input").on("keydown", (evt) =>
      {
        if (evt.keyCode != 13) return;
        textfield.fireEvent("action");
      });

      textfield.$target.find(".zn-textfield-input input").on("focus", (evt) =>
      {
        textfield.$target.addClass("focused");
      });
      
      textfield.$target.find(".zn-textfield-input input").on("blur", (evt) =>
      {
        textfield.$target.removeClass("focused");
      });
    }
    
    static get(name)
    {
      return $(`[zn-textfield='${name}']`).get()[0].znc;
    }

    static html(options)
    {
      return `
      ${options.label ? TextField.htmlLabel(options.label) : ''}
      <div class="zn-textfield-input">
        ${options.icon ? TextField.htmlIcon(options.icon) : ''}
        <input type="${options.password ? 'password' : 'text'}" value="${options.value || ''}" placeholder="${options.placeholder || ''}" ${options.readonly ? 'readonly' : ''} size="1"/>
      </div>
      <div class="zn-textfield-msg">${options.error || options.message || ''}</div>
      `;
    };
  
    static htmlIcon(icon)
    {
      return `<i class="icon ${icon}"></i>`
    }
  
    static htmlLabel(label)
    {
      return `<div class="zn-textfield-label">${label}</div>`
    }
  
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = TextField;

})(window);

