(function(window)
{
  let __package = "diagrams.view";
  let __name = "Editor";

  class View extends zn.Base
  {
    constructor(options)
    {
      super(options);
      this.toolActions=
      [
        {icon: "rect.png", action: "add-rectangle", descr: "Rectangle", text: "Rectangle"},
        {icon: "ellipse.png", action: "add-ellipse", descr: "Ellipse", text: "Ellipse"},
        {icon: "diamond.png", action: "add-diamond", descr: "Diamond", text: "Diamond"},
        {icon: "pill.png", action: "add-pill", descr: "Pill", text: "Pill"},
        {icon: "list.png", action: "add-list", descr: "List", text: "List"}
      ],
      this.shapeCount=0;
    }

    init()
    {
      let view=this;
      view.setupUI();
      view.setupEventHandlers();
    }
    
    setupUI()
    {
      let view=this;
      view.surface=zn.designer.Surface.get("surface");
    }

    setupEventHandlers()
    {
      let view=this;
    }

    onToolAction($event, action)
    {
      let view=this;
      $event.preventDefault();
      view.toolAction=action;
      view.surface.setMode("position");
    }
    
    onSurfacePosition($event)
    {
      let view=this;
      if(view[view.toolAction]) view[view.toolAction]($event);
    }

    ["add-rectangle"](evt)
    {
      let view=this;
      let ctx={name: "shape-"+(view.shapeCount++), text: "[Text]"};
      view.surface.addShape("rectangle", {x: evt.x - 50, y: evt.y - 25, width: 100, height: 50}, ctx);
    }

    ["add-ellipse"](evt)
    {
      let view=this;
      let ctx={name: "shape-"+(view.shapeCount++), text: "[Text]"};
      view.surface.addShape("ellipse", {x: evt.x - 35, y: evt.y - 35, width: 70, height: 70}, ctx);
    }

    ["add-pill"]=(evt)=>
    {
      let view=this;
      let ctx={name: "shape-"+(view.shapeCount++), text: "[Text]"};
      view.surface.addShape("pill", {x: evt.x - 50, y: evt.y - 20, width: 100, height: 40}, ctx);
    }

    ["add-diamond"]=(evt)=>
    {
      let view=this;
      let ctx={name: "shape-"+(view.shapeCount++), text: "[Text]"};
      view.surface.addShape("diamond", {x: evt.x - 45, y: evt.y - 45, width: 90, height: 90}, ctx);
    }

  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = View;

})(window);

