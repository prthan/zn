(function(window)
{
  let __package = "zn.ui.components";
  let __name = "Popup";

  class Popup
  {
    constructor(options)
    {
      this.options = options;
      this.eventHandlers = {};
      Popup.instances.push(this);
    }

    init()
    {
      let popup = this;

      popup.setupUI();

      popup.$target.get()[0].znc = popup;
      popup.fireEvent("init");
    }

    on(eventName, eventHandler)
    {
      let popup = this;
      (popup.eventHandlers[eventName] = popup.eventHandlers[eventName] || []).push(eventHandler);
    }

    fireEvent(eventName, event)
    {
      let popup = this;
      let evt = event || {};
      evt.source = popup;
      (popup.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }

    show(showAtLoc)
    {
      let popup = this;

      let top = 0;
      let left = 0;

      popup.$target.show();
      popup.setupEventHandlers();

      if (showAtLoc)
      {
        left = showAtLoc.left;
        top = showAtLoc.top;
      }
      else if (popup.options.showAt)
      {
        let $source = $(popup.options.source);
        let sourceExtent = Popup.extent($source);
        let popupExtent = Popup.extent(popup.$target);

        top = sourceExtent.top;
        left = sourceExtent.left;

        //console.log(popup.options.showAt, top, sourceExtent.height + popupExtent.height);
        if (popup.options.showAt == "bottom") top += sourceExtent.height + 3;
        if (popup.options.showAt == "top") top -= popupExtent.height + 3;
        if (popup.options.showAt == "right") left += sourceExtent.width + 3;
        if (popup.options.showAt == "left") left -= popupExtent.width + 3;
        if (popup.options.snap) popup.$target.width($source.width());

        popupExtent = Popup.extent(popup.$target);
        let bodyExtent = Popup.extent($('body'));

        if (top + popupExtent.height > bodyExtent.height) top = bodyExtent.height - popupExtent.height - 10;
        if (left + popupExtent.width > bodyExtent.width) left = bodyExtent.width - popupExtent.width - 10;
      }

      popup.$target.css("left", left + "px");
      popup.$target.css("top", top + "px");

      popup.$target.addClass("showing");
    }

    hide()
    {
      let popup = this;

      popup.removeEventHandlers();
      popup.$target.hide();
      popup.$target.removeClass("showing");
    }

    setupEventHandlers()
    {
      let popup = this;

      var $body = $("body");
      $body.on(`mousedown.zn.ui.components.popup.${popup.options.name}`, (evt) =>
      {
        let p = { x: evt.pageX, y: evt.pageY };
        let $a = popup.$target;
        let $b = popup.$source || popup.$target;

        if (!Popup.pointInContent(p, $a) && !Popup.pointInContent(p, $b))
          popup.hide();
      });

      $body.on(`keydown.zn.ui.components.popup.${popup.options.name}`, (evt) =>
      {
        if (evt.keyCode == 27)
          popup.hide();
      });
    }

    removeEventHandlers()
    {
      let popup = this;

      var $body = $("body");
      $body.off(`mousedown.zn.ui.components.popup.${popup.options.name}`);
      $body.off(`keydown.zn.ui.components.popup.${popup.options.name}`);
    }

    setupUI()
    {
      let popup = this;
      popup.$target = $(popup.options.target);
      popup.$target.addClass("zn-popup");
      popup.$target.attr("zn-popup", popup.options.name);
    }

    static instances=[];

    static get(name)
    {
      return $(`[zn-popup='${name}']`).get()[0].znc;
    }

    static hide=()=>
    {
      Popup.instances.forEach(popup=>popup.hide());
    } 

    static htmlPopup=function()
    {
      return ``;
    };
  
    static pointInContent = function(point,content)
    {
      var offset=content.offset();
      return point.x >= offset.left && 
             point.x <= (offset.left+content.width()) && 
             point.y >= offset.top &&
             point.y <= (offset.top+content.height());
    }
  
    static extent = (e)=>
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

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = Popup;

})(window);

