(function (window)
{
  let __package = "zn.ui.components";
  let __name = "ChipsField";

  class ChipsField
  {
    constructor(options)
    {
      this.options = options;
      this.items=options.items || [];
      this.eventHandlers = {};
    }
    
    init()
    {
      let chipsfield = this;
      chipsfield.$target = $(chipsfield.options.target);

      chipsfield.$target.addClass("zn-chipsfield");
      chipsfield.$target.attr("zn-chipsfield", chipsfield.options.name);
      if (chipsfield.options.error) chipsfield.$target.addClass("error");

      chipsfield.setupUI();
      chipsfield.setupEventHandlers();

      chipsfield.$target.get()[0].znc = chipsfield;
      chipsfield.fireEvent("init");
    }
    
    on(eventName, eventHandler)
    {
      let chipsfield = this;
      (chipsfield.eventHandlers[eventName] = chipsfield.eventHandlers[eventName] || []).push(eventHandler);
    }
    
    fireEvent(eventName, event)
    {
      let chipsfield = this;
      let evt = event || {};
      evt.source = chipsfield;
      evt.name = eventName;
      (chipsfield.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }
    
    setValue(value)
    {
      let chipsfield = this;
      chipsfield.value = value;
      chipsfield.$input.val(value);
    }
    
    getValue() { return this.value; }
    
    message(msg, type)
    {
      let chipsfield = this;
      if (msg != "")
      {
        chipsfield.$msg.text(msg);
        if (type == "error") chipsfield.$target.addClass("error");
        else chipsfield.$target.addClass("message");
      }
      else
      {
        chipsfield.$msg.text("");
        chipsfield.$target.removeClass("error").removeClass("message");
      }
    }

    setupUI()
    {
      let chipsfield = this;
      chipsfield.$target.html(ChipsField.html(chipsfield.options));
      chipsfield.$input = chipsfield.$target.find(".zn-chipsfield-input input");
      chipsfield.$buffer = chipsfield.$target.find(".zn-chipsfield-buffer");
      chipsfield.$msg = chipsfield.$target.find(".zn-chipsfield-msg");
      chipsfield.$deleteIcon = chipsfield.$target.find(".delete-icon");
    }

    setupEventHandlers()
    {
      let chipsfield = this;
      chipsfield.$target.find(".zn-chipsfield-input input").on("input", (evt) =>
      {
        let text=chipsfield.$input.val();
        chipsfield.$buffer.text(text);
        let w=chipsfield.$buffer.width()+3;
        chipsfield.$input.width(Math.round(w+0.5));
      });

      chipsfield.$target.find(".zn-chipsfield-input input").on("keydown", (evt) =>
      {
        if(evt.keyCode==8)
        {
          if(evt.target.selectionStart==0)
          {
            if(chipsfield.items.length==0) return;
            let chips=chipsfield.$target.find(".chip");
            chips[chips.length-1].remove();
            chipsfield.items.pop();
            chipsfield.fireEvent("items-changed", {items: chipsfield.items});
          }
        }
        if (evt.keyCode == 13) chipsfield.addChipInput();
      });

      chipsfield.$target.find(".zn-chipsfield-input, .zn-chipsfield-input input").on("focus", (evt) =>
      {
        chipsfield.$target.addClass("focused");
      });
      
      chipsfield.$target.find(".zn-chipsfield-input, .zn-chipsfield-input input").on("blur", (evt) =>
      {
        chipsfield.$target.removeClass("focused");
      });

      chipsfield.$target.on("click", ".zn-chipsfield-input", (evt)=>
      {
        chipsfield.$input.focus();
      })

      chipsfield.$target.on("click", ".zn-chipsfield-input .delete-icon", (evt)=>
      {
        let $deleteIcon=$(evt.currentTarget);
        let $chipToDelete=$deleteIcon.parent();
        let chipToDeleteElement=$chipToDelete.get()[0];
        //$chip.remove();
        let chips=chipsfield.$target.find(".chip");
        let index=chips.get().findIndex(x=>x==chipToDeleteElement);
        $chipToDelete.remove();
        chipsfield.items.splice(index, 1);
        chipsfield.fireEvent("items-changed", {items: chipsfield.items});
      })

    }
    
    getChipValue(text)
    {
      let impl=(res$, rej$)=>
      {
        res$(text);
      }
      return new Promise(impl);
    }

    async addChipInput()
    {
      let chipsfield = this;
      let chipText=chipsfield.$input.val();
      if(chipText=="") return;

      let chipValue=await chipsfield.getChipValue(chipText);
      let item={label: chipText, value: chipValue};

      this.items.push(item);
      chipsfield.$input.before(ChipsField.htmlChip(item));
      chipsfield.$input.val("");
      chipsfield.$input.width("1ch");
      chipsfield.fireEvent("items-changed", {items: chipsfield.items});
      chipsfield.fireEvent("item-added", {item: item});
    }

    setItems(items)
    {
      let chipsfield=this;
      chipsfield.items=items;
      let chips=chipsfield.$target.find(".chip");
      chips.remove();
      chipsfield.items.forEach((item)=>
      {
        chipsfield.$input.before(ChipsField.htmlChip(item));
      })
    }

    static get(name)
    {
      return $(`[zn-chipsfield='${name}']`).get()[0].znc;
    }

    static html(options)
    {
      return `
      ${options.label ? ChipsField.htmlLabel(options.label) : ''}
      <div class="zn-chipsfield-input" tabindex="0">
        <div class="buffer">&nbsp;</div>
        ${options.icon ? ChipsField.htmlIcon(options.icon) : ''}
        ${options.items ? options.items.reduce((a,c,i)=>{a+=ChipsField.htmlChip(c,i); return a}, "") : ""}
        <input type="text" value="" placeholder="${options.placeholder || ''}" ${options.readonly ? 'readonly' : ''} size="1"/>
        <span class="zn-chipsfield-buffer">&nbsp;</span>
      </div>
      <div class="zn-chipsfield-msg">${options.error || options.message || ''}</div>
      `;
    };
  
    static htmlIcon(icon)
    {
      return `<i class="icon ${icon}"></i>`
    }
  
    static htmlLabel(label)
    {
      return `<div class="zn-chipsfield-label">${label}</div>`
    }
  
    static htmlChip(item, index)
    {
      let label=item.label || item;
      let value=item.value || item;
      return `<div class="chip" data-value='${value}'>${label}<div class="delete-icon"><i class="far fa-times-circle"></i></div></div>`
    }    
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = ChipsField;

})(window);

