(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "Text";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  class Component
  {
    constructor(x, y, w, h, ctx, oid)
    {
      let component = this;
      component.$class = `${__package}.${__name}`;
      component.$type = "text";

      component.ctx = ctx;
      component.oid = oid || zn.shortid();
      
      component.alignments=
      [
        ["left", "top"], ["center", "top"], ["right", "top"],
        ["right", "top"], ["right", "middle"], ["right", "bottom"],
        ["right", "bottom"], ["center", "bottom"], ["left", "bottom"],
        ["left", "bottom"], ["left", "middle"], ["left", "top"],
      ]

      component.$shape = new Konva.Group({ x: x, y: y, width: w, height: h, draggable: true });
      component.$shape.setAttr("zn-ctx", ctx);
      component.$shape.setAttr("zn-oid", component.oid);
      component.$shape.addName("text");

      component.addHitRegion(w, h, ctx);
      component.addSelectArea(w, h, ctx);
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
        stroke: props["rect.stroke"],
        strokeWidth: 1,
        listening: false
      });
      rect.addName("rect");
      group.add(rect);
      component.rect = rect;*/
      
      let sideLinePoints=component.generateSideLinePoints(w,h);

      component.sideLines=[];
      sideLinePoints.forEach((points, i)=>
      {
        let sideLine=new Konva.Line({
          points: utils.adjust(points),
          stroke: props["text-area.stroke"],
          strokeWidth: 1,
          visible: false
        });
        sideLine.addName(`line-${i+1}`);
        component.sideLines.push(sideLine);
        group.add(sideLine);
      })
      
      let markerPoints=component.generateMarkerPoints(w, h, props["text-area.marker.size"]);

      component.markers=[];
      markerPoints.forEach((points, i)=>
      {
        let marker=new Konva.Line({
          points: utils.adjust(points),
          closed: true,
          fill: props["text-area.stroke"],
          stroke: props["text-area.stroke"],
          strokeWidth: 1,
          visible: false
        });
        marker.addName(`marker-${i+1}`);
        component.markers.push(marker);
        group.add(marker);
      })

      let alignment=ctx.alignment || 1;
      component.sideLines[Math.floor((alignment-1)/3)].visible(true);
      component.markers[alignment-1].visible(true);
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
      let alignment=ctx.alignment || 1;

      if (!component.ctx.text) return;

      let text = new Konva.Text({
        x: 4, y: 2,
        width: w-8, height: h-4,
        text: ctx.text,
        align: component.alignments[alignment-1][0],
        verticalAlign: component.alignments[alignment-1][1],
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

    generateSideLinePoints(w, h)
    {
      let points=
      [
        [0, 0, w, 0],
        [w, 0, w, h],
        [w, h, 0, h],
        [0, h, 0, 0],
      ]
      return points;
    }

    generateMarkerPoints(w, h, ms)
    {
      let points=
      [
        [10-ms, 0, 10, -ms, 10+ms, 0],
        [w/2-ms, 0, w/2, -ms, w/2+ms, 0],
        [w-10-ms, 0, w-10, -ms, w-10+ms, 0],
        [w, 10-ms, w+ms, 10, w, 10+ms],
        [w, h/2-ms, w+ms, h/2, w, h/2+ms],
        [w, h-10-ms, w+ms, h-10, w, h-10+ms],
        [w-10-ms, h, w-10, h+ms, w-10+ms, h],
        [w/2-ms, h, w/2, h+ms, w/2+ms, h],
        [10-ms, h, 10, h+ms, 10+ms, h],
        [0, h-10-ms, -ms, h-10, 0, h-10+ms],
        [0, h/2-ms, -ms, h/2, 0, h/2+ms],
        [0, 10-ms, -ms, 10, 0, 10+ms],
      ];

      return points;
    }

    updateShape(w, h)
    {
      let component = this;
      let group = component.$shape;
      let s = { width: w, height: h };

      group.setSize(s);

      let hitSize = props["connector.size"] * 2;
      component.hitRegion.size({ width: w + hitSize * 2, height: h + hitSize * 2 });
      //component.rect.size(s);

      component.generateSideLinePoints(w, h).forEach((points, i)=>component.sideLines[i].points(points));
      component.generateMarkerPoints(w, h, props["text-area.marker.size"]).forEach((points, i)=>component.markers[i].points(points));

      let offset = props["shape.select.offset"];
      component.selection.size({ width: w + offset * 2, height: h + offset * 2 });

      component.text.size({width: w-8, height: h-4});
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

    setAlignment(alignment)
    {
      let component=this;

      component.sideLines[Math.floor((component.ctx.alignment-1)/3)].visible(false);
      component.markers[component.ctx.alignment-1].visible(false);
      
      component.ctx.alignment=alignment;
      component.sideLines[Math.floor((alignment-1)/3)].visible(true);
      component.markers[alignment-1].visible(true);

      component.text.align(component.alignments[alignment-1][0]);
      component.text.verticalAlign(component.alignments[alignment-1][1]);
      component.$shape.getLayer().batchDraw();
    }

    setColor(type, colorVal)
    {
      let component=this;
      if(type=="stroke-color")
      {
        component.sideLines.forEach((line)=>line.stroke(colorVal));
        component.markers.forEach((line)=>
        {
          line.stroke(colorVal); 
          line.fill(colorVal)
        });
      }
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
      if(type=="stroke-color") return component.sideLines[0].stroke();
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

