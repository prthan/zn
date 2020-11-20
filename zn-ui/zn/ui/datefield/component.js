(function(window)
{
  let __package = "zn.ui.components";
  let __name = "DateField";

  class DateField
  {
    constructor(options)
    {
      this.options = options;
      this.name = options.name;
      this.eventHandlers = {};
      this.options.format = this.options.format || "DD/MM/YYYY";
    }

    init()
    {
      let datefield = this;
      datefield.$target = $(datefield.options.target);

      datefield.$target.addClass("zn-datefield");
      datefield.$target.attr("zn-datefield", datefield.options.name);
      if (datefield.options.error) datefield.$target.addClass("error");

      datefield.setupUI();
      datefield.setupEventHandlers();

      datefield.$target.get()[0].znc = datefield;
      datefield.setValue(datefield.options.value);
      datefield.fireEvent("init");
    }

    on(eventName, eventHandler)
    {
      let datefield = this;
      (datefield.eventHandlers[eventName] = datefield.eventHandlers[eventName] || []).push(eventHandler);
    }

    fireEvent(eventName, event)
    {
      let datefield = this;
      let evt = event || {};
      evt.source = datefield;
      evt.name = eventName;
      (datefield.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }

    setValue(value)
    {
      let datefield = this;
      datefield.value = value;
      if (value)
        datefield.$input.val(DateField.format(value, "date", datefield.options.format));
    }

    getValue() { return this.value; }

    message(msg, type)
    {
      let datefield = this;
      if (msg != "")
      {
        datefield.$msg.text(msg);
        if (type == "error") datefield.$target.addClass("error");
        else datefield.$target.addClass("message");
      }
      else
      {
        datefield.$msg.text("");
        datefield.$target.removeClass("error").removeClass("message");
      }
    }

    setupUI()
    {
      let datefield = this;
      datefield.$target.html(DateField.html(datefield.options));
      datefield.$input = datefield.$target.find(".zn-datefield-input input");
      datefield.$calendar = datefield.$target.find(".calendar");
      datefield.$msg = datefield.$target.find(".zn-datefield-msg");
    }

    setupEventHandlers()
    {
      let datefield = this;
      datefield.$target.find(".zn-datefield-input input").on("change", (evt) =>
      {
        let $input = $(evt.currentTarget);
        let oldValue = datefield.getValue();
        let newValue = $input.val();
        datefield.value = newValue;
        datefield.fireEvent("change", { oldValue: oldValue, newValue: newValue });
      });

      datefield.$target.find(".zn-datefield-input input").on("keydown", (evt) =>
      {
        if (evt.keyCode != 13) return;
        datefield.fireEvent("action");
      });

      datefield.$target.find(".zn-datefield-input input").on("focus", (evt) =>
      {
        datefield.$target.addClass("focused");
      });

      datefield.$target.find(".zn-datefield-input input").on("blur", (evt) =>
      {
        datefield.$target.removeClass("focused");
      });

      datefield.$target.find(".zn-datefield-input .action").on("click", (evt) =>
      {
        datefield.$input.focus();
        datefield.showCalendar();
      });
    }

    showCalendar()
    {
      let datefield = this;
      datefield.$calendar.addClass("showing");
      var $body = $("body");
      let hide = () =>
      {
        $body.off("mousedown.zn.ui.components.datefield.calendarpopup");
        $body.off("keydown.zn.ui.components.datefield.calendarpopup");
        datefield.$calendar.hide();
        datefield.$calendar.removeClass("showing");
        datefield.$input.focus();
      };
      $body.on("mousedown.zn.ui.components.datefield.calendarpopup", (evt) =>
      {
        if (!DateField.pointInContent({ x: evt.pageX, y: evt.pageY }, datefield.$calendar)) hide();
      });
      $body.on("keydown.zn.ui.components.datefield.calendarpopup", (evt) =>
      {
        if (evt.keyCode == 27) hide();
      });

      let calendar = new zn.ui.components.Calendar({
        name: datefield.name,
        target: datefield.$calendar,
        date: datefield.value || new Date()
      });

      calendar.on("date-select", (evt) =>
      {
        let oldValue = datefield.getValue();
        let newValue = evt.date;
        datefield.setValue(evt.date);
        datefield.fireEvent("change", { oldValue: oldValue, newValue: newValue });
        datefield.fireEvent("date-select", { date: newValue });
        hide();
      });

      calendar.init();

      let p = datefield.$input.position();
      let w = datefield.$input.width() + 3;
      let h = datefield.$input.height();
      let top = p.top + h + 9;
      let left = p.left + w - datefield.$calendar.width() + 13;

      let ch = $(document).height();
      let cw = $(document).width();
      if (top + datefield.$calendar.height() > ch) top = ch - datefield.$calendar.height() - 20;
      if (left + datefield.$calendar.width() > cw) left = cw - datefield.$calendar.width() - 20;

      datefield.$calendar.css("top", top + "px")
                         .css("left", left + "px")
                         .show();

    }

    static get(name)
    {
      return $(`[zn-datefield='${name}']`).get()[0].znc;
    }
  
    static html(options)
    {
      return `
      ${options.label ? DateField.htmlLabel(options.label) : ''}
      <div class="zn-datefield-input">
        ${options.icon ? DateField.htmlIcon(options.icon) : ''}
        <input type="text" placeholder="${options.placeholder || ''}" ${options.readonly ? 'readonly' : ''} size="1"/>
        <span class="action"><i class="far fa-calendar-alt"></i></span>
      </div>
      <div class="zn-datefield-msg">${options.error || options.message || ''}</div>
      <div class="calendar zn-calendar"></div>
      `;
    };
  
    static htmlIcon(icon)
    {
      return `<i class="icon ${icon}"></i>`
    }
  
    static htmlLabel(label)
    {
      return `<div class="zn-datefield-label">${label}</div>`
    }
  
    static format(v, t, f)
    {
      if(t==null || f == null || f == "") return v;
      if(t=="number") return numeral(v).format(f);
      if(t=="date") return moment(v).format(f);
      return v;
    }
  
    static pointInContent = function(point,content)
    {
      var offset=content.offset();
      return point.x >= offset.left && 
             point.x <= (offset.left+content.width()) && 
             point.y >= offset.top &&
             point.y <= (offset.top+content.height());
    }
  
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = DateField;

})(window);

