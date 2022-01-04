(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "ConnectorLine";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  class Component
  {
    constructor(cp0, cp1, ctx, oid)
    {
      let component = this;
      component.$class = `${__package}.${__name}`;
      component.$type = "line";

      component.cp0 = cp0;
      component.cp1 = cp1;
      component.ctx = ctx;
      component.oid = oid || zn.shortid();

      component.startPointDirection = component.cp0.getAttr("zn-ctx").direction;
      component.endPointDirection = component.cp1.getAttr("zn-ctx").direction;

      let {x, y, w, h}=component.boundingBox();

      component.$shape = new Konva.Group({ x: x, y: y, width: w, height: h, draggable: false });
      component.$shape.setAttr("zn-ctx", ctx);
      component.$shape.setAttr("zn-oid", component.oid);
      component.$shape.addName("connector-line");

      component.lineSegments=[];
      component.addShapeDetails(x, y, w, h, ctx);
      
      component.cp0.$lines = (component.cp0.$lines || []);
      component.cp0.$lines.push(component.oid);

      component.cp1.$lines = (component.cp1.$lines || []);
      component.cp1.$lines.push(component.oid);

      component.setupEventHandlers();
    }

    addShapeDetails(x, y, w, h, ctx)
    {
      let component=this;
      let group = component.$shape;
      let p0 = base.pointOf(component.cp0);
      let p1 = base.pointOf(component.cp1);

      let lineSegments=component.generateLineSegments(p0.x - x, p0.y - y, p1.x - x, p1.y - y);
      lineSegments.forEach((segment, i)=>
      {
        segment.addName("line-segment-"+i);
        group.add(segment);
      })

      component.lineSegments=lineSegments;
    }

    updateShapeDetails(x, y, w, h)
    {
      let component=this;
      let group = component.$shape;
      group.position({x: x, y: y});
      group.size({width: w, height: h});

      let p0 = base.pointOf(component.cp0);
      let p1 = base.pointOf(component.cp1);

      component.lineSegments.forEach((segment)=>segment.destroy())
      
      let lineSegments=component.generateLineSegments(p0.x - x, p0.y - y, p1.x - x, p1.y - y);
      lineSegments.forEach((segment, i)=>
      {
        segment.addName("line-segment-"+i);
        group.add(segment);
      })

      component.lineSegments=lineSegments;
      group.getLayer().batchDraw();
    }

    hilightLine()
    {
      let component=this;
      let group=component.$shape;
      component.lineSegments.forEach((segment)=>segment.stroke(props["connector.line.hilight"]));
      group.getLayer().batchDraw();
    }

    dehilightLine()
    {
      let component=this;
      let group=component.$shape;
      let color=group.hasName("selected") ? props["connector.line.select"] : props["connector.line.stroke"]
      component.lineSegments.forEach((segment)=>segment.stroke(color));
      group.getLayer().batchDraw();
    }

    selectLine()
    {
      let component=this;
      let group=component.$shape;
      base.resetConnectorLineSelection(group.getLayer());
      group.addName("selected");
      component.lineSegments.forEach((segment)=>segment.stroke(props["connector.line.select"]));
      group.getLayer().batchDraw();
      group.getStage().fire("connection-select", { source: group });
    }

    setupEventHandlers()
    {
      let component = this;
      let updateLine = () =>
      {
        let {x, y, w, h}=component.boundingBox();
        component.updateShapeDetails(x, y, w, h);
      };

      component.ehname = `eh${new Date().getTime()}`;
      component.cp0.on(`connector-update.${component.ehname}`, updateLine);
      component.cp1.on(`connector-update.${component.ehname}`, updateLine);
    }

    removePointUpdateEventHandlers()
    {
      let component = this;
      component.cp0.off(`connector-update.${component.ehname}`);
      component.cp1.off(`connector-update.${component.ehname}`);
    }
    
    boundingBox()
    {
      let component = this;
      let p0 = base.pointOf(component.cp0);
      let p1 = base.pointOf(component.cp1);

      let rect=
      {
        x: p0.x<p1.x ? p0.x : p1.x, 
        y: p0.y<p1.y ? p0.y : p1.y,
        w: Math.abs(p0.x-p1.x),
        h: Math.abs(p0.y-p1.y)
      }
      
      return rect;
    }

    generateLineSegments(x1, y1, x2, y2)
    {
      let component = this;
      let group=component.$shape;
      let poffset=30;
      let color=group.hasName("selected") ? props["connector.line.select"] : props["connector.line.stroke"]
      
      let {x: p1x, y: p1y}=component.adjustPoint(x1, y1, component.startPointDirection, poffset);
      let {x: p2x, y: p2y}=component.adjustPoint(x2, y2, component.endPointDirection, poffset);
      let segments=[];

      /*let seg0 = new Konva.Line({
        points: [x1, y1, p1x, p1y],
        fill: props["connector.line.stroke"], stroke: color,
        strokeWidth: 2, hitStrokeWidth: 20
      });
      seg0.addName("line-segment");
      segments.push(seg0);

      let seg1 = new Konva.Line({
        points: [p1x, p1y, p2x, p2y],
        bezier: false,
        //points: utils.blinePoints(x1, y1, x2, y2, component.startPointDirection, component.endPointDirection),
        //bezier: true,
        fill: props["connector.line.stroke"], stroke: color, 
        strokeWidth: 2, hitStrokeWidth: 20
      });
      seg1.addName("line-segment");
      segments.push(seg1);*/

      let seg0 = new Konva.Path({
        x: 0, y: 0,
        data: `M ${x1} ${y1} L ${p1x} ${p1y} L ${p2x} ${p2y} L ${x2} ${y2}`,
        stroke: color,
        strokeWidth: 2, hitStrokeWidth: 20
      });
      seg0.addName("line-segment");
      segments.push(seg0);

      /*let seg2 = new Konva.Arrow({
        points: [p2x, p2y, x2, y2],
        fill: props["connector.line.stroke"], stroke: color,
        strokeWidth: 2, pointerLength: 5, pointerWidth: 4, hitStrokeWidth: 20
      });
      seg2.addName("line-segment");
      segments.push(seg2);*/


      segments.forEach((segment)=>
      {
        segment.on("mouseover", () =>component.hilightLine());
        segment.on("mouseout", () =>component.dehilightLine());
        segment.on("mousedown", () =>component.selectLine());
      })

      return segments;

    }

    adjustPoint(x, y, dir, offset)
    {
      if(dir=="top") return {x: x, y: y-offset};
      if(dir=="right") return {x: x+offset, y: y};
      if(dir=="bottom") return {x: x, y: y+offset};
      if(dir=="left") return {x: x-offset, y: y};
    }

    destroy()
    {
      let component = this;
      component.removePointUpdateEventHandlers();
      component.cp0.$lines = component.cp0.$lines.filter((id) => id != component.oid);
      component.cp1.$lines = component.cp1.$lines.filter((id) => id != component.oid);
      component.$shape.destroy();
    }
  }




  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

