(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "Node";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  let Component=function(x, y, w, h, ctx)
  {
    let component=this;
    component.ctx=ctx;
    component.$shape=new Konva.Group({x: x, y: y, width: w, height: h});
    component.$shape.setAttr("zn-ctx", ctx);
    component.$shape.addName("rectangle");

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
      x: -hitSize, 
      y: 0, 
      width: w + hitSize * 2, 
      height: h,
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

    let rect=new Konva.Rect({
      x: 0, y: 0, 
      width: w, height: h, 
      fill: props["rect.fill"], 
      strokeWidth: 0,
      listening: false
    });
    rect.addName("rect");
    group.add(rect);
    component.rect=rect;
  }

  Component.prototype.addText=function(w, h, ctx)
  {
    let component=this;
    let group=component.$shape;

    let offset=((ctx.$level || 0) + 1 ) * props["node.level.offset"] ;
    
    let text=new Konva.Text({
      x: offset, y: 0, 
      width: w - offset, height: h, 
      stroke: props["text.color"],
      text: ctx.text,
      align: "left",
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
    component.text=text;
  }

  Component.prototype.addConnectorPoints=function()
  {
    let component=this;
    let group=component.$shape;

    component.connectorPoints=
    {
      left: zn.designer.shape.ConnectorPoint.generateForShape(group, "left"),
      right: zn.designer.shape.ConnectorPoint.generateForShape(group, "right")
    }
    
    Object.values(component.connectorPoints).forEach(point=>group.add(point.$shape));
  }

  Component.prototype.updateShape=function(w, h)
  {
    let component=this;
    let group=component.$shape;
    let s={width: w, height: h};

    group.setSize(s);

    let hitSize=props["connector.size"] * 2;
    component.hitRegion.size({width: w + hitSize * 2, height: h + hitSize * 2});
    component.rect.size(s);
    
    component.text.size(s);

    zn.designer.shape.ConnectorPoint.updateForRectangularShape(component);
  }

  Component.prototype.setupEventHandlers=function()
  {
    let component=this;
    let group=component.$shape;
    group.on("mouseenter", ()=>base.handleShapeHover(component));
  }

  Component.prototype.mark=function(state)
  {
    let component=this;
    if(state) component.text.stroke(props["node.mark.color"]);
    else component.text.stroke(props["text.color"]);
    component.$shape.getLayer().batchDraw();
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

