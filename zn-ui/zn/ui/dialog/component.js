(function(window)
{
  let __package = "zn.ui.components";
  let __name = "Dialog";

  class Dialog
  {
    constructor(options)
    {
      this.options = options;
      this.eventHandlers = {};
      (Dialog.instances=Dialog.instances||[]).push(this);
    }

    init()
    {
      let dialog = this;

      dialog.setupUI();
      dialog.setupEventHandlers();
      dialog.$target.get()[0].znc = dialog;
      dialog.fireEvent("init");
    }

    on(eventName, eventHandler)
    {
      let dialog = this;
      (dialog.eventHandlers[eventName] = dialog.eventHandlers[eventName] || []).push(eventHandler);
    }

    fireEvent(eventName, event)
    {
      let dialog = this;
      let evt = event || {};
      evt.source = dialog;
      (dialog.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }

    show(showAtLoc)
    {
      let dialog = this;

      let top = 0;
      let left = 0;

      if (dialog.options.centered) dialog.$target.css("display", "flex");
      else dialog.$target.show();
      dialog.setupDialogCloseEventHandlers();

      dialog.$target.addClass("showing");
      dialog.bodyOverFlow = $("body").css("overflow");
      $('body').css("overflow", "hidden");
    }

    hide()
    {
      let dialog = this;

      dialog.removeDialogCloseEventHandlers();
      dialog.$target.hide();
      dialog.$target.removeClass("showing");
      $('body').css("overflow", dialog.bodyOverFlow);

    }

    setupEventHandlers()
    {
      let dialog = this;

      dialog.$target.on("click", ".zn-dialog-footer .zn-action", (evt) =>
      {
        evt.preventDefault();
        let $action = $(evt.currentTarget);
        let action = $action.attr("data-action");
        let index = parseInt($action.attr("data-index"));
        dialog.fireEvent("action", { action: action });
        if (dialog.options.actions[index].autohide !== false) dialog.hide();
      });
    }
    setupDialogCloseEventHandlers()
    {
      let dialog = this;

      var $body = $("body");
      $body.on(`keydown.zn.ui.components.dialog.${dialog.options.name}`, (evt) =>
      {
        if (evt.keyCode == 27) dialog.hide();
      });
    }

    removeDialogCloseEventHandlers()
    {
      let dialog = this;

      var $body = $("body");
      $body.off(`keydown.zn.ui.components.dialog.${dialog.options.name}`);
    }

    setupUI()
    {
      let dialog = this;
      dialog.$target = $(dialog.options.target);
      dialog.$target.addClass("zn-dialog");
      dialog.$target.attr("zn-dialog", dialog.options.name);
      if (dialog.options.centered) dialog.$target.addClass("centered");
      if (dialog.options.wrap !== "N") dialog.wrap(dialog.options);

      //console.log(dialog.$target.html());
      dialog.$wrapper = dialog.$target.find(".zn-dialog-wrapper");
      dialog.$header = dialog.$target.find(".zn-dialog-header");
      if (dialog.options.title) dialog.$header.text(dialog.options.title);
      else dialog.$target.addClass("title-none");

      dialog.$content = dialog.$target.find(".zn-dialog-content");
      dialog.$footer = dialog.$target.find(".zn-dialog-footer");
      if (dialog.options.actions) dialog.setActions(dialog.options.actions);
      else dialog.$target.addClass("actions-none");
    }

    setTitle(title)
    {
      let dialog=this;
      dialog.options.title=title;
      dialog.$header.text(dialog.options.title);      
    }
    
    wrap()
    {
      let dialog = this;
      let content = dialog.$target.html();
      dialog.$target.html(Dialog.html());
      dialog.$target.find(".zn-dialog-content").html(content);
    }

    setActions(actions)
    {
      let dialog = this;
      dialog.options.actions = actions;
      dialog.options.actions.forEach((a, i) => { a.index = i; });
      dialog.$footer.find(".right-actions").html(Dialog.htmlActions(dialog.options.actions.filter((a) => a.slot == null || a.slot === "right")));
      dialog.$footer.find(".left-actions").html(Dialog.htmlActions(dialog.options.actions.filter((a) => a.slot === "left")));
      dialog.$target.removeClass("actions-none");
    }
  
    static get(name)
    {
      return $(`[zn-dialog='${name}']`).get()[0].znc;
    }
  
    static hide()
    {
      Dialog.instances && Dialog.instances.forEach(dialog=>dialog.hide());
    } 
  
    static html(options)
    {
      return `
      <div class="zn-dialog-wrapper">
        <div class="zn-dialog-header"></div>
        <div class="zn-dialog-content"></div>
        <div class="zn-dialog-footer">
          <div class="zn-actions left-actions"></div>
          <div class="zn-actions right-actions"></div>
        </div>
      </div>`;
    };
  
    static htmlIcon(icon)
    {
      return `<i class="icon ${icon}"></i>`
    }
  
    static htmlAction(item)
    {
      return `
      <a class="zn-action" data-action="${item.action}" data-index="${item.index}">
        ${item.icon ? Dialog.htmlIcon(item.icon) : ''}<span class="text">${item.label || ''}</span>
      </a>`;
    }
  
    static htmlActions(actions)
    {
      return actions.reduce((a,c) => a + Dialog.htmlAction(c), '');
    }
  
    static format(v, t, f)
    {
      if(t==null || f == null || f == "") return v;
      if(t=="number") return numeral(v).format(f);
      if(t=="date") return moment(v).format(f);
      return v;
    }
  
    static pointInContent(point,content)
    {
      var offset=content.offset();
      return point.x >= offset.left && 
             point.x <= (offset.left+content.width()) && 
             point.y >= offset.top &&
             point.y <= (offset.top+content.height());
    }
  
    static extent(e)
    {
      let dim={};
      let $e=$(e);
     
      let htmlElement=$e.get()[0];
      dim.left=htmlElement.offsetLeft;
      dim.top=htmlElement.offsetTop;
      dim.width=htmlElement.offsetWidth;
      dim.height=htmlElement.offsetHeight;
  
      return dim;
    }  
  
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = Dialog;

})(window);

