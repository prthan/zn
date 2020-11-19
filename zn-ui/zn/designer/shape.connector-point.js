(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "ConnectorPoint";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  let Component=function(x, y, ctx)
  {
    let component=this;
    component.$class=`${__package}.${__name}`;
    component.$type="point";
    component.ctx=ctx;

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
      point.getLayer().batchDraw();
    });

    point.on("mouseout", ()=>
    {
      point.setFill(props["connector.fill"]);
      point.getLayer().batchDraw();
    });

    point.on("mousedown", (evt)=>
    {
      evt.cancelBubble=true;
      point.getStage().fire("connector-select", {source: component});
    })
    
  }

  Component.prototype.destroy=function()
  {
    let component=this;
    component.$shape.destroy();
  }
  
  Component.generateForRectangularShape=function(shape)
  {
    return {
      top    : Component.generateForShape(shape, "top"),
      right  : Component.generateForShape(shape, "right"),
      bottom : Component.generateForShape(shape, "bottom"),
      left   : Component.generateForShape(shape, "left")
    }
  }

  Component.generateForShape=function(shape, location)
  {
    let w=shape.width();
    let h=shape.height();
    let parentCtx=shape.getAttr("zn-ctx");

    if(location=="top") return new Component(w/2, -1, {name: `top`, text:"Top", parent: parentCtx, direction: "top"});
    if(location=="right") return new Component(w+1, h/2, {name: `right`, text:"Right", parent: parentCtx, direction: "right"});
    if(location=="bottom") return new Component(w/2, h+1, {name: `bottom`, text:"Bottom", parent: parentCtx, direction: "bottom"});
    if(location=="left") return new Component(-1, h/2, {name: `left`, text:"Left", parent: parentCtx, direction: "left"})
    
    return null;
  }

  Component.updateForRectangularShape=function(rectangularComponent)
  {
    let w=rectangularComponent.$shape.width();
    let h=rectangularComponent.$shape.height();
    let cps=rectangularComponent.connectorPoints;
    
    if(!cps) return;
    if(cps.top) cps.top.$shape.position({x: w/2, y: -1});
    if(cps.right) cps.right.$shape.position({x: w+1, y: h/2});
    if(cps.bottom) cps.bottom.$shape.position({x: w/2, y: h+1});
    if(cps.left) cps.left.$shape.position({x: -1, y: h/2});

    base.fireConnectorPointUpdateEvent(rectangularComponent.$shape);
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

