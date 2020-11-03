(function(window)
{
  var component =
  {
    name: "textarea",
    package: "zn.ui"
  }

  component.create=(options)=>
  {
    let znc=new TextArea(options);
    return znc;
  }

  component.get=(name)=>
  {
    return $(`[zn-textarea='${name}']`).get()[0].znc;
  }

  let TextArea=function(options)
  {
    this.options=options;
    this.value=options.value;
    this.eventHandlers={};
  }

  TextArea.prototype.init=function()
  {
    let textarea=this;
    textarea.$target=$(textarea.options.target);

    textarea.$target.addClass("zn-textarea");
    textarea.$target.attr("zn-textarea", textarea.options.name);
    if(textarea.options.error) textarea.$target.addClass("error");

    textarea.setupUI();
    textarea.setupEventHandlers();

    textarea.$target.znc=textarea;
    textarea.setValue(textarea.options.value);
    textarea.fireEvent("init");
  }

  TextArea.prototype.on=function(eventName, eventHandler)
  {
    let textarea=this;
    (textarea.eventHandlers[eventName]=textarea.eventHandlers[eventName] || []).push(eventHandler);
  }

  TextArea.prototype.fireEvent=function(eventName, event)
  {
    let textarea=this;
    let evt=event || {};
    evt.source=textarea;
    evt.name=eventName;
    (textarea.eventHandlers[eventName] || []).forEach((eh)=>eh(evt));
  }

  TextArea.prototype.setValue=function(value) 
  {
    let textarea=this;
    textarea.value=value;
    if(value) textarea.$textarea.val(value);
  }

  TextArea.prototype.getValue=function() {return this.value;}

  TextArea.prototype.message=function(msg, type)
  {
    let textarea=this;
    if(!msg) return;
    if(msg!="")
    {
      textarea.$msg.text(msg);
      if(type=="error") textarea.$target.addClass("error");
      else textarea.$target.addClass("message");
    }
    else if(msg=="")
    {
      textarea.$msg.text("");
      textarea.$target.removeClass("error").removeClass("message");
    }
  }

  TextArea.prototype.setupUI=function()
  {
    let textarea=this;
    textarea.$target.html(component.html.textarea(textarea.options));
    textarea.$textarea=textarea.$target.find(".zn-textarea-input textarea");
    textarea.$msg=textarea.$target.find(".zn-textarea-msg");
  }

  TextArea.prototype.setupEventHandlers=function()
  {
    let textarea=this;
    textarea.$target.find(".zn-textarea-input textarea").on("change", (evt)=>
    {
      let $input=$(evt.currentTarget);
      let oldValue=textarea.getValue();
      let newValue=$input.val();
      textarea.value=newValue;
      textarea.fireEvent("change", {oldValue: oldValue, newValue: newValue});
    })
    textarea.$target.find(".zn-textarea-input textarea").on("focus", (evt)=>
    {
      textarea.$target.addClass("focused");
    })
    textarea.$target.find(".zn-textarea-input textarea").on("blur", (evt)=>
    {
      textarea.$target.removeClass("focused");
    })
  }

  component.html={};

  component.html.textarea=(options)=>
  {
    return `
    ${options.label ? component.html.label(options.label) : ''}
    <div class="zn-textarea-input"><textarea value="${options.value || ''}" placeholder="${options.placeholder || ''}" ${options.readonly ? 'readonly' : ''}></textarea></div>
    <div class="zn-textarea-msg">${options.error || options.message || ''}</div>
    `;
  };

  component.html.label=(label)=>
  {
    return `<div class="zn-textarea-label">${label}</div>`
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

