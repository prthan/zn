(function(window)
{
  let __package = "zn.ui.components";
  let __name = "TextArea";

  class TextArea
  {
    constructor(options)
    {
      this.options = options;
      this.value = options.value;
      this.eventHandlers = {};
    }

    init()
    {
      let textarea = this;
      textarea.$target = $(textarea.options.target);

      textarea.$target.addClass("zn-textarea");
      textarea.$target.attr("zn-textarea", textarea.options.name);
      if (textarea.options.error) textarea.$target.addClass("error");

      textarea.setupUI();
      textarea.setupEventHandlers();

      textarea.$target.get()[0].znc = textarea;
      textarea.setValue(textarea.options.value);
      textarea.fireEvent("init");
    }

    on(eventName, eventHandler)
    {
      let textarea = this;
      (textarea.eventHandlers[eventName] = textarea.eventHandlers[eventName] || []).push(eventHandler);
    }

    fireEvent(eventName, event)
    {
      let textarea = this;
      let evt = event || {};
      evt.source = textarea;
      evt.name = eventName;
      (textarea.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }

    setValue(value)
    {
      let textarea = this;
      textarea.value = value;
      textarea.$textarea.val(value);
    }

    getValue() { return this.value; }

    message(msg, type)
    {
      let textarea = this;
      if (msg != "")
      {
        textarea.$msg.text(msg);
        if (type == "error")
          textarea.$target.addClass("error");
        else
          textarea.$target.addClass("message");
      }

      else
      {
        textarea.$msg.text("");
        textarea.$target.removeClass("error").removeClass("message");
      }
    }

    setupUI()
    {
      let textarea = this;
      textarea.$target.html(TextArea.html(textarea.options));
      textarea.$textarea = textarea.$target.find(".zn-textarea-input textarea");
      textarea.$msg = textarea.$target.find(".zn-textarea-msg");
    }

    setupEventHandlers()
    {
      let textarea = this;
      textarea.$target.find(".zn-textarea-input textarea").on("change", (evt) =>
      {
        let $input = $(evt.currentTarget);
        let oldValue = textarea.getValue();
        let newValue = $input.val();
        textarea.value = newValue;
        textarea.fireEvent("change", { oldValue: oldValue, newValue: newValue });
      });
      textarea.$target.find(".zn-textarea-input textarea").on("focus", (evt) =>
      {
        textarea.$target.addClass("focused");
      });
      textarea.$target.find(".zn-textarea-input textarea").on("blur", (evt) =>
      {
        textarea.$target.removeClass("focused");
      });
    }

    static get(name)
    {
      return $(`[zn-textarea='${name}']`).get()[0].znc;
    }

    static html(options)
    {
      return `
      ${options.label ? TextArea.htmlLabel(options.label) : ''}
      <div class="zn-textarea-input"><textarea value="${options.value || ''}" placeholder="${options.placeholder || ''}" ${options.readonly ? 'readonly' : ''}></textarea></div>
      <div class="zn-textarea-msg">${options.error || options.message || ''}</div>
      `;
    };
  
    static htmlLabel(label)
    {
      return `<div class="zn-textarea-label">${label}</div>`
    }
  
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = TextArea;

})(window);

