(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "HeaderNode";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  let Component=function(x, y, w, h, ctx)
  {
    let component=this;
    component.$class=`${__package}.${__name}`;
    component.$type="header-node";    
    
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
      fill: props["list.header.fill"], 
      strokeWidth: 0,
      listening: false
    });
    rect.addName("rect");
    group.add(rect);
    component.rect=rect;

    let line=new Konva.Line({
      points: [0, h, w, h],
      stroke: props["rect.stroke"],
      strokeWidth: 1,
      listening: false
    })
    group.add(line);
    component.line=line;

  }

  Component.prototype.addText=function(w, h, ctx)
  {
    let component=this;
    let group=component.$shape;

    let offset=props["node.level.offset"] ;
    
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
    component.line.points([0,h,w,h]);

    zn.designer.shape.ConnectorPoint.updateForRectangularShape(component);
  }

  Component.prototype.getRect=function()
  {
    let component=this;
    let size=component.$shape.getSize();
    let pos=component.$shape.getPosition();

    return {x: pos.x, y: pos.y, width: size.width, height: size.height};
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

  Component.prototype.destroy=function()
  {
    let component=this;
    component.$shape.destroy();
  }

  Component.prototype.connectorLines=function()
  {
    let component=this;
    return base.getConnetorLines(component);
  }
    
  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

