(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "RectangleArea";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  class Component
  {
    constructor(x, y, w, h, ctx, oid)
    {
      let component = this;
      component.$class = `${__package}.${__name}`;
      component.$type = "rectangle-area";

      component.ctx = ctx;
      component.oid = oid || zn.shortid();

      if(h==-1) h=this.computeHeight(ctx.subtext, w) + 35;
      if(h<50) h=50;
      
      component.$shape = new Konva.Group({ x: x, y: y, width: w, height: h, draggable: true });
      component.$shape.setAttr("zn-ctx", ctx);
      component.$shape.setAttr("zn-oid", component.oid);
      component.$shape.addName("rectangle-area");

      component.addHitRegion(w, h, ctx);
      component.addSelectArea(w, h, ctx);
      component.addConnectorPoints();
      component.addShapeDetails(w, h, ctx);
      component.addText(w, h, ctx);
      component.setupEventHandlers();
    }

    addHitRegion(w, h, ctx)
    {
      let component = this;
      let group = component.$shape;

      let hitSize = props["connector.size"] * 2;
      let hitRegion = new Konva.Rect({
        x: -hitSize + 0.5,
        y: -hitSize + 0.5,
        width: w + hitSize * 2,
        height: h + hitSize * 2,
        strokeWidth: 0,
        fill: props["hitregion.fill"]
      });
      hitRegion.addName("hit-region");
      group.add(hitRegion);
      component.hitRegion = hitRegion;
    }

    addShapeDetails(w, h, ctx)
    {
      let component = this;
      let group = component.$shape;

      let rect = new Konva.Rect({
        x: 0.5, y: 0.5,
        width: w, height: h,
        fill: props["rect.fill"],
        stroke: props["rect.stroke"],
        strokeWidth: 3,
        cornerRadius: 5,
        listening: false
      });
      rect.addName("rect");
      group.add(rect);
      component.rect = rect;

      let headerRect=new Konva.Rect({
        x: 0, y: 0,
        width: w, height: 25,
        cornerRadius: [5, 5, 0, 0],
        fill: props["rect.header.fill"]
      })
      headerRect.addName("text-background");
      group.add(headerRect);
      component.headerRect=headerRect;
    }

    addSelectArea(w, h, ctx)
    {
      let component = this;
      let group = component.$shape;

      let size = props["shape.select.offset"];
      let selection = new Konva.Rect({
        x: -size + 0,
        y: -size + 0,
        width: w + size * 2,
        height: h + size * 2,
        fill: props["shape.select.fill"],
        strokeWidth: props["shape.select.stroke.size"],
        stroke: props["shape.select.stroke"],
        dash: [4, 4],
        visible: false,
        listening: false,
        cornerRadius: 5
      });
      selection.addName("selection");
      group.add(selection);
      component.selection = selection;
    }

    addText(w, h, ctx)
    {
      let component = this;
      let group = component.$shape;

      if (!component.ctx.text) return;

      let text = new Konva.Text({
        x: 10, y: 2,
        width: w - 20, height: 25,
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
      if(props["text.stroke"]) text.stroke(props["text.color"])
      else text.fill(props["text.color"]);
      text.addName("text");
      group.add(text);
      component.text = text;
      
      let subtext = new Konva.Text({
        x: 10, y: 30,
        width: w - 20, height: h - 35,
        strokeWidth: 1,
        text: ctx.subtext,
        align: "left",
        verticalAlign: "top",
        fontFamily: props["subtext.family"],
        fontSize: props["subtext.size"],
        fontStyle: props["subtext.style"],
        lineHeight: props["subtext.lineheight"],
        shadowForStrokeEnabled: false,
        listening: false
      });
      if(props["text.stroke"]) subtext.stroke(props["text.color"])
      else subtext.fill(props["text.color"]);
      subtext.addName("subtext");
      group.add(subtext);
      component.subtext=subtext;

      let headerLine = new Konva.Line({
        points: [0, 25, w, 25],
        stroke: props["rect.stroke"],
        strokeWidth: 1,
        listening: false
      });
      group.add(headerLine);
      component.headerLine = headerLine;

    }

    addConnectorPoints()
    {
      let component = this;
      let group = component.$shape;

      component.connectorPoints = zn.designer.shape.ConnectorPoint.generateForRectangularShape(group);
      Object.values(component.connectorPoints).forEach(point => group.add(point.$shape));
    }

    updateShape(w, h)
    {
      let component = this;
      let group = component.$shape;
      let s = { width: w, height: h };

      group.setSize(s);

      let hitSize = props["connector.size"] * 2;
      component.hitRegion.size({ width: w + hitSize * 2, height: h + hitSize * 2 });
      component.rect.size(s);

      let offset = props["shape.select.offset"];
      component.selection.size({ width: w + offset * 2, height: h + offset * 2 });

      component.text.size({width: w - 20, height: 25});
      component.headerRect.size({width: w, height: 25});
      component.subtext.size({width: w - 20, height: h - 35});
      component.headerLine.points([0, 25, w, 25]);

      zn.designer.shape.ConnectorPoint.updateForRectangularShape(component);
    }

    getRect()
    {
      let component = this;
      let size = component.$shape.getSize();
      let pos = component.$shape.getPosition();
      let hitSize = props["connector.size"] * 2;

      return { x: pos.x, y: pos.y, width: size.width, height: size.height };
    }

    setRect(rect)
    {
      let component=this;
      component.$shape.setPosition({x: rect.x, y: rect.y});
      component.updateShape(rect.width, rect.height);
      component.$shape.getLayer().batchDraw();
    }

    setText(text)
    {
      let component=this;
      component.ctx.text=text;
      component.text.text(text);
      component.$shape.getLayer().batchDraw();
    }

    setSubText(text)
    {
      let component=this;
      let rect=component.getRect();
      component.ctx.subtext=text;
      component.subtext.text(text);
      component.$shape.getLayer().batchDraw();
    }

    move(dx, dy)
    {
      let component = this;
      let $shape=component.$shape;
      $shape.x($shape.x()+dx);
      $shape.y($shape.y()+dy);
      base.handleShapeDragEnd(component)
    }

    computeHeight(text, w)
    {
      let subtext = new Konva.Text({
        x: 0, y: 0,
        width: w - 20,
        strokeWidth: 1,
        text: text,
        align: "left",
        verticalAlign: "top",
        fontFamily: props["subtext.family"],
        fontSize: props["subtext.size"],
        fontStyle: props["subtext.style"],
        lineHeight: props["subtext.lineheight"],
        shadowForStrokeEnabled: false,
        listening: false
      });      
      let h=subtext.height();
      subtext.destroy();

      return h;
    }

    setupEventHandlers()
    {
      let component = this;
      let group = component.$shape;

      group.on("dragend", () => base.handleShapeDragEnd(component));
      group.on("dragmove", (event) => base.handleShapeDragMove(component, event));
      group.on("mouseenter", () => base.handleShapeHover(component));
      group.on("mousedown", (event) =>
      {
        if (!event.evt.ctrlKey)
          base.handleShapeMouseDown(component);
      });
      group.on("click", (event) =>
      {
        if (!event.evt.ctrlKey)
          base.handleShapeClick(component);
        else
          base.handleShapeSelectAdd(component);
      });
    }

    destroy()
    {
      let component = this;
      component.$shape.destroy();
    }

    connectorLines()
    {
      let component = this;
      return base.getConnetorLines(component);
    }
  }
  
  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

