(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "Callout";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  class Component
  {
    constructor(x, y, w, h, ctx, oid)
    {
      let component = this;
      component.$class = `${__package}.${__name}`;
      component.$type = "callout";

      component.ctx = ctx;
      component.oid = oid || zn.shortid();

      component.$shape = new Konva.Group({ x: x, y: y, width: w, height: h, draggable: true });
      component.$shape.setAttr("zn-ctx", ctx);
      component.$shape.setAttr("zn-oid", component.oid);
      component.$shape.addName("callout");

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

      /*let rect = new Konva.Rect({
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
      component.rect = rect;*/
      
      /*let points=component.generatePathPoints(w, h);
      let path=new Konva.Line({
        points: points,
        closed: true,
        fill: props["rect.fill"],
        stroke: props["rect.stroke"],
        strokeWidth: 3
      });
      path.addName("path");
      group.add(path);
      component.path=path;*/

      let w1=w-10;
      let w2=(w-22)/2;
      let h1=h-16;
      
      let path = new Konva.Path({
        x: 0.5, y: 0.5,
        data: `M 5 0 l ${w1} 0 a 5 5 0 0 1 5 5 l 0 ${h1} a 5 5 0 0 1 -5 5 l -${w2} 0 l -5 5 l -2 0 l -5 -5 l -${w2} 0 a 5 5 0 0 1 -5 -5 l 0 -${h1} a 5 5 0 0 1 5 -5`,
        fill: props["callout.fill"],
        stroke: props["callout.stroke"],
        strokeWidth: 3,
        listening: false
      });
      path.addName("path");
      group.add(path);
      component.path = path;
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
      let dp=props["text.padding"];

      let text = new Konva.Text({
        x: dp, y: 1+dp,
        width: w-2*dp, height: h-2*dp-4,
        text: ctx.text || "",
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
      if(props["text.stroke"]) text.stroke(props["text.color"])
      else text.fill(props["text.color"]);
      text.addName("text");
      group.add(text);
      component.text = text;
    }

    addConnectorPoints()
    {
      let component = this;
      let group = component.$shape;

      component.connectorPoints = zn.designer.shape.ConnectorPoint.generateForRectangularShape(group);
      Object.values(component.connectorPoints).forEach(point => group.add(point.$shape));
    }

    generatePathPoints(w, h)
    {
      let points=[5, 0, w, 0, w, h, 0, h, 0, 5];
      return points;
    }

    updateShape(w, h)
    {
      let component = this;
      let group = component.$shape;
      let s = { width: w, height: h };
      let dp=props["text.padding"];

      group.setSize(s);

      let hitSize = props["connector.size"] * 2;
      component.hitRegion.size({ width: w + hitSize * 2, height: h + hitSize * 2 });
      //component.rect.size(s);
      //component.path.points(component.generatePathPoints(w, h));

      let w1=w-10;
      let w2=(w-22)/2;
      let h1=h-16;
      component.path.data(`M 5 0 l ${w1} 0 a 5 5 0 0 1 5 5 l 0 ${h1} a 5 5 0 0 1 -5 5 l -${w2} 0 l -5 5 l -2 0 l -5 -5 l -${w2} 0 a 5 5 0 0 1 -5 -5 l 0 -${h1} a 5 5 0 0 1 5 -5`);

      let offset = props["shape.select.offset"];
      component.selection.size({ width: w + offset * 2, height: h + offset * 2 });
      component.text.size({width: w-2*dp, height: h-2*dp-4});

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

    setColor(type, colorVal)
    {
      let component=this;
      if(type=="stroke-color") component.path.stroke(colorVal);
      if(type=="fill-color") component.path.fill(colorVal);
      if(type=="text-color")
      {
        if(props["text.stroke"]) component.text.stroke(colorVal)
        else component.text.fill(colorVal);
      }
      component.$shape.getLayer().batchDraw();
    }

    getColor(type)
    {
      let component=this;
      if(type=="stroke-color") return component.path.stroke();
      if(type=="fill-color") return component.path.fill();
      if(type=="text-color")
      {
        if(props["text.stroke"]) return component.text.stroke()
        else return component.text.fill();
      }
      return "";
    }

    move(dx, dy)
    {
      let component = this;
      let $shape=component.$shape;
      $shape.x($shape.x()+dx);
      $shape.y($shape.y()+dy);
      base.handleShapeDragEnd(component)
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

