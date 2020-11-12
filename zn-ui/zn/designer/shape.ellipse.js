(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "Ellipse";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;

  let Component=function(x, y, w, h, ctx)
  {
    let component=this;
    component.ctx=ctx;
    component.$shape=new Konva.Group({x: x, y: y, width: w, height: h, draggable: true});
    component.$shape.setAttr("zn-ctx", ctx);
    component.$shape.addName("ellipse");


    component.addHitRegion(w, h, ctx);
    component.addConnectorPoints();
    component.addShapeDetails(w, h, ctx);
    component.addText(w, h, ctx);
    component.setupEventHandlers();
  }

  Component.prototype.addHitRegion=function(w, h, ctx)
  {
    let component=this;
    let group=component.$shape;

    let hitSize=props["connector.size"] * 2;
    let hitRegion=new Konva.Rect({
      x: -hitSize + 0.5, 
      y: -hitSize + 0.5, 
      width: w + hitSize * 2, 
      height: h + hitSize * 2,
      strokeWidth: 0,
      fill: props["hitregion.fill"]
    });
    hitRegion.addName("hit-region");
    group.add(hitRegion);
    component.hitRegion=hitRegion;
  }

  Component.prototype.addShapeDetails=function(w, h, ctx)
  {
    let component=this;
    let group=component.$shape;

    let ellipse=new Konva.Ellipse({
      x: w/2 + 0.5, y: h/2 + 0.5, 
      radius: {x: w/2, y: h/2},
      fill: props["ellipse.fill"], 
      stroke: props["ellipse.stroke"],
      strokeWidth: 3,
      listening: false
    });
    ellipse.addName("ellipse");
    group.add(ellipse);
  }

  Component.prototype.addText=function(w, h, ctx)
  {
    let component=this;
    let group=component.$shape;

    if(!component.ctx.text) return;

    let text=new Konva.Text({
      x: 0, y: 0, 
      width: w, height: h, 
      stroke: props["text.color"],
      text: ctx.text,
      align: "center",
      verticalAlign: "middle",
      strokeWidth: 1,
      fontFamily: props["text.family"],
      fontSize: props["text.size"],
      fontStyle: props["text.style"],
      lineHeight: props["text.lineheight"],
      shadowForStrokeEnabled: false,
      listening: false
    });
    text.addName("text");
    group.add(text);
  }

  Component.prototype.addConnectorPoints=function()
  {
    let component=this;
    let group=component.$shape;

    component.connectorPoints=zn.designer.shape.ConnectorPoint.generateForRectangularShape(group);
    Object.values(component.connectorPoints).forEach(point=>group.add(point.$shape));
  }

  Component.prototype.setupEventHandlers=function()
  {
    let component=this;
    let group=component.$shape;

    group.on("dragend", ()=>
    {
      utils.snap(group);
      utils.fireConnectorPointUpdateEvent(group);
    });

    group.on("dragmove", ()=>
    {
      utils.fireConnectorPointUpdateEvent(group);
    });

    component.hitRegion.on("mouseenter", ()=>
    {
      group.getStage().fire("shape-select", {source: group});
    });
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

