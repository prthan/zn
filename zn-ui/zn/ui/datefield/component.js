(function(window)
{
  var component =
  {
    name: "datefield",
    package: "zn.ui"
  }

  component.create=(options)=>
  {
    let znc=new DateField(options);
    return znc;
  }

  component.get=(name)=>
  {
    return $(`[zn-datefield='${name}']`).get()[0].znc;
  }

  let DateField=function(options)
  {
    this.options=options;
    this.name=options.name;
    this.eventHandlers={};
    this.options.format = this.options.format || "DD/MM/YYYY";
  }

  DateField.prototype.init=function()
  {
    let datefield=this;
    datefield.$target=$(datefield.options.target);

    datefield.$target.addClass("zn-datefield");
    datefield.$target.attr("zn-datefield", datefield.options.name);
    if(datefield.options.error) datefield.$target.addClass("error");

    datefield.setupUI();
    datefield.setupEventHandlers();

    datefield.$target.znc=datefield;
    datefield.setValue(datefield.options.value);
    datefield.fireEvent("init");
  }

  DateField.prototype.on=function(eventName, eventHandler)
  {
    let datefield=this;
    (datefield.eventHandlers[eventName]=datefield.eventHandlers[eventName] || []).push(eventHandler);
  }

  DateField.prototype.fireEvent=function(eventName, event)
  {
    let datefield=this;
    let evt=event || {};
    evt.source=datefield;
    evt.name=eventName;
    (datefield.eventHandlers[eventName] || []).forEach((eh)=>eh(evt));
  }

  DateField.prototype.setValue=function(value)
  {
    let datefield=this;
    datefield.value=value;
    if(value) datefield.$input.val(component.format(value, "date", datefield.options.format));
  }

  DateField.prototype.getValue=function() {return this.value;}

  DateField.prototype.message=function(msg, type)
  {
    let datefield=this;
    if(!msg) return;
    if(msg!="")
    {
      datefield.$msg.text(msg);
      if(type=="error") datefield.$target.addClass("error");
      else datefield.$target.addClass("message");
    }
    else if(msg=="")
    {
      datefield.$msg.text("");
      datefield.$target.removeClass("error").removeClass("message");
    }
  }

  DateField.prototype.setupUI=function()
  {
    let datefield=this;
    datefield.$target.html(component.html.datefield(datefield.options));
    datefield.$input=datefield.$target.find(".zn-datefield-input input");
    datefield.$calendar=datefield.$target.find(".calendar");
    datefield.$msg=datefield.$target.find(".zn-datefield-msg");
  }

  DateField.prototype.setupEventHandlers=function()
  {
    let datefield=this;
    datefield.$target.find(".zn-datefield-input input").on("change", (evt)=>
    {
      let $input=$(evt.currentTarget);
      let oldValue=datefield.getValue();
      let newValue=$input.val();
      datefield.value=newValue;
      datefield.fireEvent("change", {oldValue: oldValue, newValue: newValue});
    })
    datefield.$target.find(".zn-datefield-input input").on("keydown", (evt)=>
    {
      if(evt.keyCode!=13) return;
      datefield.fireEvent("action");
    })
    datefield.$target.find(".zn-datefield-input input").on("focus", (evt)=>
    {
      datefield.$target.addClass("focused");
    })
    datefield.$target.find(".zn-datefield-input input").on("blur", (evt)=>
    {
      datefield.$target.removeClass("focused");
    })
    datefield.$target.find(".zn-datefield-input .action").on("click", (evt)=>
    {
      datefield.$input.focus();
      datefield.showCalendar();
    })

  }

  DateField.prototype.showCalendar=function()
  {
    let datefield=this;
    datefield.$calendar.addClass("showing");
    var $body=$("body");
    let hide=()=>
    {
      $body.off("mousedown.zn.ui.datefield.calendarpopup");
      $body.off("keydown.zn.ui.datefield.calendarpopup");
      datefield.$calendar.hide();
      datefield.$calendar.removeClass("showing");
      datefield.$input.focus();
    }
    $body.on("mousedown.zn.ui.datefield.calendarpopup",(evt)=>
    {
      if(!component.pointInContent({x:evt.pageX,y:evt.pageY}, datefield.$calendar)) hide();
    });
    $body.on("keydown.zn.ui.datefield.calendarpopup",(evt)=>
    {
      if(evt.keyCode==27) hide();
    });

    let calendar=zn.ui.calendar.create({
      name: datefield.name,
      target: datefield.$calendar,
      date: datefield.value || new Date()
    });
    calendar.on("date-select", (evt) => 
    {
      let oldValue=datefield.getValue();
      let newValue=evt.date;
      datefield.setValue(evt.date);
      datefield.fireEvent("change", {oldValue: oldValue, newValue: newValue});
      datefield.fireEvent("date-select", {date: newValue});
      hide();
    });
    calendar.init();

    let p=datefield.$input.position();
    let w=datefield.$input.width() + 3;
    let h=datefield.$input.height();
    let top=p.top + h + 9;
    let left=p.left + w - datefield.$calendar.width() + 13;

    let ch=$(document).height();
    let cw=$(document).width();
    if(top+datefield.$calendar.height() > ch) top=ch-datefield.$calendar.height()-20;
    if(left+datefield.$calendar.width() > cw) left=cw-datefield.$calendar.width()-20;

    datefield.$calendar.css("top", top+"px")
                    .css("left", left+"px")
                    .show();

  }

  component.html={};

  component.html.datefield=(options)=>
  {
    return `
    ${options.label ? component.html.label(options.label) : ''}
    <div class="zn-datefield-input">
      ${options.icon ? component.html.icon(options.icon) : ''}
      <input type="text" placeholder="${options.placeholder || ''}" ${options.readonly ? 'readonly' : ''}/>
      <span class="action"><i class="far fa-calendar-alt"></i></span>
    </div>
    <div class="zn-datefield-msg">${options.error || options.message || ''}</div>
    <div class="calendar zn-calendar"></div>
    `;
  };

  component.html.icon=(icon)=>
  {
    return `<i class="icon ${icon}"></i>`
  }

  component.html.label=(label)=>
  {
    return `<div class="zn-datefield-label">${label}</div>`
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

  component.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[component.name]=component;

})(window);

