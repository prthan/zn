(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "List";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  let Component=function(x, y, w, h, ctx)
  {
    let component=this;
    component.ctx=ctx;

    component.list=utils.flattenList(ctx.list);
    component.ch=25 + component.list.length * props["node.height"];
    if(h>component.ch) component.ch=h;

    component.$shape=new Konva.Group({x: x, y: y, width: w, height: h, draggable: true});
    component.$shape.setAttr("zn-ctx", ctx);
    component.$shape.addName("list");

    component.addHitRegion(w, h, ctx);
    component.addSelectArea(w, h, ctx);
    component.addShapeBackground(w, h, ctx);
    component.addHeader(w, ctx);
    component.addShapeDetails(w, h, ctx);
    component.addShapeForeground(w, h, ctx);
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
      height: component.ch + hitSize * 2,
      strokeWidth: 0,
      fill: "rgba(255,0,0,0)"
    });
    hitRegion.addName("hit-region");
    group.add(hitRegion);
    component.hitRegion=hitRegion;
  }

  Component.prototype.addShapeBackground=function(w, h, ctx)
  {
    let component=this;
    let group=component.$shape;

    let background=new Konva.Rect({
      x: 0, y: 0, 
      width: w, 
      height: component.ch,
      fill: props["rect.fill"], 
      cornerRadius: 5,
      listening: false
    });
    background.addName("background");
    group.add(background);
    component.background=background;
  }

  Component.prototype.addShapeForeground=function(w, h, ctx)
  {
    let component=this;
    let group=component.$shape;

    let foreground=new Konva.Rect({
      x: 0, y: 0, 
      width: w, 
      height: component.ch,
      stroke: props["rect.stroke"],
      strokeWidth: 3,
      cornerRadius: 5,
      listening: false
    });
    foreground.addName("foreground");
    group.add(foreground);
    component.foreground=foreground;

    let line=new Konva.Line({
      points: [0, 25, w, 25],
      stroke: props["rect.stroke"],
      strokeWidth: 1,
      listening: false
    })
    group.add(line);
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
      height: component.ch + size * 2,
      fill: props["shape.select.fill"],
      strokeWidth: props["shape.select.stroke.size"],
      stroke: props["shape.select.stroke"],
      dash: [4 , 4],
      visible: false,
      listening: false,
      cornerRadius: 5
    });
    selection.addName("selection");
    group.add(selection);
    component.selection=selection;
  }

  Component.prototype.addHeader=function(w, ctx)
  {
    let component=this;
    let group=component.$shape;
    
    let headerRect=new Konva.Rect({
      x: 0, 
      y: 0, 
      width: w, 
      height: 30,
      fill:props["rect.stroke"],
      listening: false,
      cornerRadius: 5
    });
    headerRect.addName(`headerrect`);
    group.add(headerRect);
    component.headerRect=headerRect;

    let headerText=new Konva.Text({
      x: 10, y: 1, 
      width: w, height: 25, 
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
    headerText.addName(`headertext`);
    group.add(headerText);
    component.headerText=headerText;
  }

  Component.prototype.addShapeDetails=function(w, h, ctx)
  {
    let component=this;
    let group=component.$shape;

    let x=0;
    let y=25;
    let dy=25;

    component.nodes=[];
    component.list.forEach((e,i)=>
    {
      let node=new zn.designer.shape.Node(x, y, w, props["node.height"], {name: `item$${i}`, index: i, parent: ctx, type: "list-item", ...e});
      component.nodes.push(node);
      group.add(node.$shape);
      y+=dy;
    })
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
    
    let offset=props["shape.select.offset"];
    component.selection.size({width: w + offset * 2, height: h + offset * 2});

    component.text.size(s);

    zn.designer.shape.ConnectorPoint.updateForRectangularShape(component);
  }

  Component.prototype.setupEventHandlers=function()
  {
    let component=this;
    let group=component.$shape;

    group.on("dragend", ()=>
    {
      base.snap(group);
      component.nodes.forEach((node)=>base.fireConnectorPointUpdateEvent(node.$shape));
    });
    group.on("dragmove", ()=>
    {
      component.nodes.forEach((node)=>base.fireConnectorPointUpdateEvent(node.$shape));
    });
    group.on("click", ()=>base.handleShapeSelect(component));
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

