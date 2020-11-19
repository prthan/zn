(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "Pill";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  let Component=function(x, y, w, h, ctx)
  {
    let component=this;
    component.$class=`${__package}.${__name}`;
    component.$type="pill";

    component.ctx=ctx;
    component.$shape=new Konva.Group({x: x, y: y, width: w, height: h, draggable: true});
    component.$shape.setAttr("zn-ctx", ctx);
    component.$shape.addName("pill");


    component.addHitRegion(w, h, ctx);
    component.addSelectArea(w, h, ctx);
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

    let pill=new Konva.Rect({
      x: 0, y:0,
      width: w, height: h,
      fill: props["pill.fill"], 
      stroke: props["pill.stroke"],
      strokeWidth: 3,
      cornerRadius: h/2,
      listening: false
    })
    pill.addName("pill");
    group.add(pill);
    component.pill=pill;
  }

  Component.prototype.addSelectArea=function(w, h, ctx)
  {
    let component=this;
    let group=component.$shape;

    let size=props["shape.select.offset"];
    let selection=new Konva.Rect({
      x: -size + 0, 
      y: -size + 0, 
      width: w + size * 2, 
      height: h + size * 2,
      fill: props["shape.select.fill"],
      strokeWidth: props["shape.select.stroke.size"],
      stroke: props["shape.select.stroke"],
      cornerRadius: h/2 + size,
      dash: [4 , 4],
      visible: false,
      listening: false
    });
    selection.addName("selection");
    group.add(selection);
    component.selection=selection;
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
    component.text=text;
  }

  Component.prototype.addConnectorPoints=function()
  {
    let component=this;
    let group=component.$shape;

    component.connectorPoints=zn.designer.shape.ConnectorPoint.generateForRectangularShape(group);
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
    component.pill.size(s);
    component.pill.cornerRadius(h/2);
    
    let offset=props["shape.select.offset"];
    component.selection.size({width: w + offset * 2, height: h + offset * 2});
    component.selection.cornerRadius(h/2 + offset);

    component.text.size(s);

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

    group.on("dragend", ()=>base.handleShapeDragEnd(component));
    group.on("dragmove", (event)=>base.handleShapeDragMove(component, event));
    group.on("mouseenter", ()=>base.handleShapeHover(component));
    group.on("mousedown", (event)=>
    {
      if(!event.evt.ctrlKey) base.handleShapeMouseDown(component)
    });
    group.on("click", (event)=>
    {
      if(!event.evt.ctrlKey) base.handleShapeClick(component);
      else base.handleShapeSelectAdd(component);
    });
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

