(function(window)
{
  let __package = "zn.ui.components";
  let __name = "Button";

  class Button
  {
    constructor(options)
    {
      this.options = options;
      this.eventHandlers = {};
    }

    init()
    {
      let button = this;
      button.$target = $(button.options.target);
      button.$target.addClass("zn-button");
      button.$target.attr("title", button.options.title);
      button.$target.attr("data-type", button.options.type);
      button.$target.attr("zn-button", button.options.name);
      button.setupUI();
      button.setupEventHandlers();
      button.$target.get()[0].znc = button;
      button.fireEvent("init");
    }
    
    on(eventName, eventHandler)
    {
      let button = this;
      (button.eventHandlers[eventName] = button.eventHandlers[eventName] || []).push(eventHandler);
    }
    
    fireEvent(eventName, event)
    {
      let button = this;
      let evt = event || {};
      evt.source = button;
      (button.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }
    
    setValue(v) { this.value = value; }
    getValue() { return this.value; }
    
    setupUI()
    {
      let button = this;
      button.$target.html(Button.html(button.options));
    }
    
    setupEventHandlers()
    {
      let button = this;
      button.$target.on("click", (evt) =>
      {
        button.fireEvent("action", { action: button.options.action });
      });
    }

    static get(name)
    {
      return $(`[zn-button='${name}']`).get()[0].znc;
    }

    static html(options)
    {
      return `${options.icon ? Button.htmlIcon(options.icon) : ''}<span class="text">${options.text || ''}</span>`;
    };
  
    static htmlIcon(icon)
    {
      return `<i class="icon ${icon}"></i>`
    }
  
  
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = Button;

})(window);

