(function(window)
{
  var component =
  {
    name: "popup",
    package: "zn.ui.components",

    instances: []
  }

  component.create=(options)=>
  {
    let znc=new Popup(options);
    component.instances.push(znc);
    znc.init();
    return znc;
  }

  component.get=(name)=>
  {
    return $(`[zn-popup='${name}']`).get()[0].znc;
  }

  component.hide=()=>
  {
    component.instances.forEach(popup=>popup.hide());
  } 

  let Popup=function(options)
  {
    this.options=options;
    this.eventHandlers={};
  }

  Popup.prototype.init=function()
  {
    let popup=this;

    popup.setupUI();

    popup.$target.get()[0].znc=popup;
    popup.fireEvent("init");
  }

  Popup.prototype.on=function(eventName, eventHandler)
  {
    let popup=this;
    (popup.eventHandlers[eventName]=popup.eventHandlers[eventName] || []).push(eventHandler);
  }

  Popup.prototype.fireEvent=function(eventName, event)
  {
    let popup=this;
    let evt=event || {};
    evt.source=popup;
    (popup.eventHandlers[eventName] || []).forEach((eh)=>eh(evt));
  }

  Popup.prototype.show=function(showAtLoc)
  {
    let popup=this;

    let top=0;
    let left=0;

    popup.$target.show();
    popup.setupEventHandlers();

    if(showAtLoc)
    {
      left=showAtLoc.left;
      top=showAtLoc.top;
    }
    else if(popup.options.showAt)
    {
      let $source=$(popup.options.source);
      let sourceExtent=component.extent($source);
      let popupExtent=component.extent(popup.$target);

      top=sourceExtent.top;
      left=sourceExtent.left;

      //console.log(popup.options.showAt, top, sourceExtent.height + popupExtent.height);
      if(popup.options.showAt=="bottom") top+=sourceExtent.height+3;
      if(popup.options.showAt=="top") top-=popupExtent.height+3;
      if(popup.options.showAt=="right") left+=sourceExtent.width+3;
      if(popup.options.showAt=="left") left-=popupExtent.width+3;
      if(popup.options.snap) popup.$target.width($source.width());

      popupExtent=component.extent(popup.$target);
      let bodyExtent=component.extent($('body'));

      if(top + popupExtent.height > bodyExtent.height) top = bodyExtent.height - popupExtent.height - 10;
      if(left + popupExtent.width > bodyExtent.width) left = bodyExtent.width - popupExtent.width - 10;
    }

    popup.$target.css("left", left+"px");
    popup.$target.css("top", top+"px");

    popup.$target.addClass("showing");
  }

  Popup.prototype.hide=function()
  {
    let popup=this;

    popup.removeEventHandlers();
    popup.$target.hide();
    popup.$target.removeClass("showing");
  }

  Popup.prototype.setupEventHandlers=function()
  {
    let popup=this;

    var $body=$("body");
    $body.on(`mousedown.zn.ui.components.popup.${popup.options.name}`,(evt)=>
    {
      let p={x:evt.pageX, y:evt.pageY};
      let $a=popup.$target;
      let $b=popup.$source || popup.$target;
      
      if(!component.pointInContent(p, $a) && !component.pointInContent(p, $b)) popup.hide();
    });
    $body.on(`keydown.zn.ui.components.popup.${popup.options.name}`,(evt)=>
    {
      if(evt.keyCode==27) popup.hide();
    });
  }

  Popup.prototype.removeEventHandlers=function()
  {
    let popup=this;

    var $body=$("body");
    $body.off(`mousedown.zn.ui.components.popup.${popup.options.name}`);
    $body.off(`keydown.zn.ui.components.popup.${popup.options.name}`);
  }

  Popup.prototype.setupUI=function()
  {
    let popup=this;
    popup.$target=$(popup.options.target);
    popup.$target.addClass("zn-popup");
    popup.$target.attr("zn-popup", popup.options.name);
    
  }

  component.html={};

  component.html.popup=function()
  {
    return ``;
  };

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

  component.extent = (e)=>
  {
    let dim={};
    let $e=$(e);
   
    let htmlElement=$e.get()[0];
    dim.left=htmlElement.offsetLeft;
    dim.top=htmlElement.offsetTop;
    dim.width=htmlElement.offsetWidth;
    dim.height=htmlElement.offsetHeight;

    /*dim.width=$e.width();
    dim.height=$e.height();
    dim.left=$e.position().left;
    dim.top=$e.position().top;*/

    return dim;
  }

  component.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[component.name]=component;

})(window);

