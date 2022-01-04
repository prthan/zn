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

      component.poffset=20;
      component.arrowSize={w: 2, h: 6};

      let p0 = base.pointOf(cp0);
      let p1 = base.pointOf(cp1);

      component.startPointDirection = component.cp0.getAttr("zn-ctx").direction;
      component.endPointDirection = component.cp1.getAttr("zn-ctx").direction;

      component.$shape = new Konva.Path({
        x: 0, y: 0,
        data: component.generatePathData(p0, p1, component.startPointDirection, component.endPointDirection),
        strokeWidth: 2, hitStrokeWidth: 20,
        stroke: props["connector.line.stroke"],
      });

      component.$shape.setAttr("zn-ctx", ctx);
      component.$shape.setAttr("zn-oid", component.oid);
      component.$shape.addName("connector-line");

      component.cp0.$lines = (component.cp0.$lines || []);
      component.cp0.$lines.push(component.oid);

      component.cp1.$lines = (component.cp1.$lines || []);
      component.cp1.$lines.push(component.oid);

      component.setupEventHandlers();
    }

    setupEventHandlers()
    {
      let component = this;
      let line = component.$shape;
      let updateLine = () =>
      {

        let p0 = base.pointOf(component.cp0);
        let p1 = base.pointOf(component.cp1);

        line.data(component.generatePathData(p0, p1, component.startPointDirection, component.endPointDirection));
        line.getLayer().batchDraw();
      };

      component.ehname = `eh${new Date().getTime()}`;
      component.cp0.on(`connector-update.${component.ehname}`, updateLine);
      component.cp1.on(`connector-update.${component.ehname}`, updateLine);

      line.on("mouseover", () =>
      {
        line.stroke(props["connector.line.hilight"]);
        line.getLayer().batchDraw();
      });

      line.on("mouseout", () =>
      {
        if (line.hasName("selected"))
          line.stroke(props["connector.line.select"]);
        else
          line.stroke(props["connector.line.stroke"]);
        line.getLayer().batchDraw();
      });

      line.on("mousedown", () =>
      {
        base.resetConnectorLineSelection(line.getLayer());
        line.addName("selected");
        line.stroke(props["connector.line.select"]);
        line.getLayer().batchDraw();
        line.getStage().fire("connection-select", { source: line });
      });
    }

    generatePathData(p0, p1, p0dir, p1dir)
    {
      let component=this;
      let {x: x1, y: y1}=component.adjustPoint(p0.x, p0.y, p0dir, component.poffset);
      let {x: x2, y: y2}=component.adjustPoint(p1.x, p1.y, p1dir, component.poffset);
      let pa=component.getPointAtDistance(x1, y1, p0.x, p0.y, 20);
      let pb=component.getPointAtDistance(x1, y1, x2, y2, 20);

      return `M ${p0.x} ${p0.y} L ${pa.x} ${pa.y} Q ${x1} ${y1} ${pb.x} ${pb.y} L ${x2} ${y2} L ${p1.x} ${p1.y}` + component.generateArrowHead(p1.x, p1.y, p1dir);
      //return `M ${p0.x} ${p0.y} L ${pa.x} ${pa.y}  Q ${x1} ${y1} ${pb.x} ${pb.y}`;
    }

    generateArrowHead(x, y, dir)
    {
      let component=this;
      let {w, h}=component.arrowSize;
      if(dir=="top") return `M ${x} ${y} l -${w} -${h} M ${x} ${y} l ${w} -${h}`;
      if(dir=="right") return `M ${x} ${y} l ${h} -${w} M ${x} ${y} l ${h} ${w}`;
      if(dir=="bottom") return `M ${x} ${y} l ${w} ${h} M ${x} ${y} l -${w} ${h}`;
      if(dir=="left") return `M ${x} ${y} l -${h} -${w} M ${x} ${y} l -${h} ${w}`;
    }

    adjustPoint(x, y, dir, offset)
    {
      if(dir=="top") return {x: x, y: y-offset};
      if(dir=="right") return {x: x+offset, y: y};
      if(dir=="bottom") return {x: x, y: y+offset};
      if(dir=="left") return {x: x-offset, y: y};
    }

    generatePoints(x1, y1, x2, y2, startDir, endDir)
    {
      let component=this;
      let dx=x2-x1;
      let dy=y2-y1;
      let points=[x1, y1];
      let o=component.poffset;

      if(startDir=="top") 
      {
        if(endDir=="left" || endDir=="right") points.push(x1, y2, x1, y2, x2, y2);
        else points.push(x1, y1+dy/2+o, x2, y1+dy/2-o, x2, y2);
      }
      else if(startDir=="right")
      {
        if(endDir=="bottom" || endDir=="top") points.push(x2, y1, x2, y1, x2, y2);
        else points.push(x1+dx/2-o, y1, x1+dx/2+o, y2, x2, y2);
      }
      else if(startDir=="bottom") 
      {
        if(endDir=="left" || endDir=="right") points.push(x1, y2, x1, y2, x2, y2);
        else points.push(x1, y1+dy/2-o, x2, y1+dy/2+o, x2, y2);
      }
      else if(startDir=="left") 
      {
        if(endDir=="bottom" || endDir=="top") points.push(x2, y1, x2, y1, x2, y2);
        else points.push(x1+dx/2+o, y1, x1+dx/2-o, y2, x2, y2);
      }
      else
      {
        if(Math.abs(dx) < Math.abs(dy)) points.push(x1+dx/4, y1, x1+dx/4, y2, x2, y2);
        else points.push(x1, y1+dy/4, x2, y1+dy/4, x2, y2);
      }
  
      return points;
    }
  
    getPointAtDistance(x1, y1, x2, y2, d)
    {
      let D=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
      let _d=d/D;
      let sx=x2-x1;
      let sy=y2-y2;
      console.log(d, _d);
      return {x: x1 + sx * _d, y: y1 + sy * _d}
    }

    removePointUpdateEventHandlers()
    {
      let component = this;
      component.cp0.off(`connector-update.${component.ehname}`);
      component.cp1.off(`connector-update.${component.ehname}`);
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

