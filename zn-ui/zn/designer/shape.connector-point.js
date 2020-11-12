(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "ConnectorPoint";

  let props=zn.designer.Properties;

  let Component=function(x, y, ctx)
  {
    let component=this;
    let size=props["connector.size"];
    component.$shape=new Konva.Circle({
      x: x + 0.5, 
      y: y + 0.5, 
      radius: size/2,
      width: size, height: size,
      fill: props["connector.fill"],
      stroke: props["connector.stroke"],
      strokeWidth: 0,
      visible: false,
      hitStrokeWidth: 10
    });
    component.$shape.setAttr("zn-ctx", ctx);
    component.$shape.addName("connector");
    
    component.setupEventHandlers();
  }

  Component.prototype.setupEventHandlers=function()
  {
    let component=this;
    let point=component.$shape;
    
    point.on("mouseenter", ()=>
    {
      point.setFill(props["connector.hilight"]);
      //point.setStroke(props["connector.hilight"]);
      point.getLayer().batchDraw();
    });

    point.on("mouseout", ()=>
    {
      point.setFill(props["connector.fill"]);
      //point.setStroke(props["connector.fill"]);
      point.getLayer().batchDraw();
    });

    point.on("mousedown", (evt)=>
    {
      evt.cancelBubble=true;
      point.getStage().fire("connector-select", {source: point});
    })
    
  }

  Component.prototype.handleHover=function(event)
  {
    let component=this;
    let point=component.$shape;

    let x=event.evt.clientX;
    let y=event.evt.clientY;
    let p=point.absolutePosition();
    let r=point.radius();

    if(x>=p.x && x<=p.x+2*r && y>=p.y &&y<=p.y+2*r)
    {
      point.setFill(props["connector.hilight"]);
      point.setStroke(props["connector.hilight"]);
    }
    else
    {
      point.setFill(props["connector.fill"]);
      point.setStroke(props["connector.fill"]);
    }
  }

  Component.generateForRectangularShape=function(shape)
  {
    let w=shape.width();
    let h=shape.height();

    return {
      top    : new Component(w/2, -1, {name: "top", text:"Top", parent: shape, direction: "top"}),
      right  : new Component(w+1, h/2, {name: "right", text:"Right", parent: shape, direction: "right"}),
      bottom : new Component(w/2, h+1, {name: "bottom", text:"Bottom", parent: shape, direction: "bottom"}),
      left   : new Component(-1, h/2, {name: "left", text:"Left", parent: shape, direction: "left"})
    }
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

