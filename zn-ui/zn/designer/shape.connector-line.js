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

      let p0 = base.pointOf(cp0);
      let p1 = base.pointOf(cp1);

      component.startPointDirection = component.cp0.getAttr("zn-ctx").direction;
      component.endPointDirection = component.cp1.getAttr("zn-ctx").direction;

      let bounds=component.bounds(p0, p1);
      component.$shape = new Konva.Group({ x: bounds.x, y: bounds.y, width: bounds.w, height: bounds.h});
      component.$shape.setAttr("zn-ctx", ctx);
      component.$shape.setAttr("zn-oid", component.oid);

      component.line = new Konva.Arrow({
        points: utils.blinePoints(bounds.p1.x, bounds.p1.y, bounds.p2.x, bounds.p2.y, component.startPointDirection, component.endPointDirection),
        bezier: true,
        fill: props["connector.line.stroke"],
        stroke: props["connector.line.stroke"],
        strokeWidth: 2,
        pointerLength: 5,
        pointerWidth: 4,
        hitStrokeWidth: 20
      });
      component.$shape.add(component.line);

      /*let linePoints=component.generateLinePoints(bounds.p1.x, bounds.p1.y, bounds.p2.x, bounds.p2.y, component.startPointDirection, component.endPointDirection);
      component.lineSegments=[];
      linePoints.forEach((pts, i)=>
      {
        let shape=null
        if(i<=5)
        {
          shape = new Konva.Line({
            points: pts,
            bezier: i%2==1,
            fill: props["connector.line.stroke"],
            stroke: props["connector.line.stroke"],
            strokeWidth: 2,
            pointerLength: 5,
            pointerWidth: 4,
            hitStrokeWidth: 20
          });
        }
        else
        {
          shape = new Konva.Arrow({
            points: pts,
            bezier: true,
            fill: props["connector.line.stroke"],
            stroke: props["connector.line.stroke"],
            strokeWidth: 2,
            pointerLength: 5,
            pointerWidth: 4,
            hitStrokeWidth: 20
          });
        }
        component.lineSegments.push(shape);
        component.$shape.add(shape);
      })*/

      component.cp0.$lines = (component.cp0.$lines || []);
      component.cp0.$lines.push(component.oid);

      component.cp1.$lines = (component.cp1.$lines || []);
      component.cp1.$lines.push(component.oid);

      component.setupEventHandlers();
    }

    setupEventHandlers()
    {
      let component = this;
      let $shape=component.$shape;
      let line = component.line;

      let updateLine = () =>
      {
        let p0 = base.pointOf(component.cp0);
        let p1 = base.pointOf(component.cp1);
        let bounds=component.bounds(p0, p1);
        component.$shape.position(bounds);
        component.$shape.size(bounds);
        let blinePoints = utils.blinePoints(bounds.p1.x, bounds.p1.y, bounds.p2.x, bounds.p2.y, component.startPointDirection, component.endPointDirection);
        line.points(blinePoints);
        line.getLayer().batchDraw();

        //let linePoints=component.generateLinePoints(bounds.p1.x, bounds.p1.y, bounds.p2.x, bounds.p2.y, component.startPointDirection, component.endPointDirection);
        //linePoints.forEach((pts, i)=>component.lineSegments[i].points(pts))
        //component.lineSegments[0].getLayer().batchDraw();
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
        line.getStage().fire("connection-select", { source: $shape });
      });
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

    bounds(p1, p2)
    {
      let x1=p1.x, y1=p1.y;
      let x2=p2.x, y2=p2.y;
      if(p2.x<x1) x1=p2.x;
      if(p2.x>x2) x2=p2.x;
      if(p2.y<y1) y1=p2.y;
      if(p2.y>y1) y2=p2.y;

      return {x: x1, y: y1, w:x2-x1, h:y2-y1, p1: {x: p1.x-x1, y: p1.y-y1}, p2: {x: p2.x-x1, y: p2.y-y1}};
    }

    direction(lp)
    {
      let [x1, y1, x2, y2]=lp;
      if(y1==y2 && x2>x1) return "R";
      if(x1==x2 && y2>y1) return "D";
      if(y1==y2 && x2<x1) return "L";
      if(x1==x2 && y2<y1) return "U";
      if(x1==x2 && y1==y2) return "";
    }
  
    offsetPoint(dir, x, y, d)
    {
      let dx=x, dy=y;
      if(dir=="top") dy-=d;
      if(dir=="right") dx+=d;
      if(dir=="bottom") dy+=d;
      if(dir=="left") dx-=d;
      
      return {x: dx, y: dy};
    }
  
    pointOnLine(lp, px, py)
    {
      let rval=false;
      let lx1=lp[0], ly1=lp[1], lx2=lp[2], ly2=lp[3];
      if(lx1>lx2) [lx1, lx2]=[lx2, lx1];
      if(ly1>ly2) [ly1, ly2]=[ly2, ly1];
  
      rval=px>=lx1 && px<=lx2 && py>=ly1 && py<=ly2;
      
      return rval;
    }
  
    pointsOnLine(lp, ps)
    {
      let component=this;

      let rval=false;
      ps.forEach((p)=>
      {
        if(component.pointOnLine(lp, p.x, p.y)) rval=true;
      });
  
      return rval;
    }
  
    countDirectionChanges(lps)
    {
      let component=this;

      let c=0;
      let dir="";
      lps.forEach((lp)=>
      {
        let d=component.direction(lp);
        if(d!="" && d!=dir)
        {
          dir=d;
          c++;
        }
      });
  
      return c;
    }
  
    breakLineSegment(lp, s, e)
    {
      let component=this;

      let [x1, y1, x2, y2]=lp;
      let dir=component.direction(lp);
  
      let rval=null;
      if(dir=="") rval=[[x1, y1, x1, y1], [x1, y1, x1, y1], [x1, y1, x1, y1]];
      if(dir=="R") rval=[[x1, y1, x1+s, y1], [x1+s, y1, x2-e, y1], [x2-e, y1, x2, y1]];
      if(dir=="D") rval=[[x1, y1, x1, y1+s], [x1, y1+s, x1, y2-e], [x1, y2-e, x1, y2]];
      if(dir=="L") rval=[[x1, y1, x1-s, y1], [x1-s, y1, x2+e, y1], [x2+e, y1, x2, y1]];
      if(dir=="U") rval=[[x1, y1, x1, y1-s], [x1, y1-s, x1, y2+e], [x1, y2+e, x1, y2]];
      
      if(s==0) rval.shift();
      if(e==0) rval.pop();
  
      return rval;
    }
  
    combineLineSegments(ls1, ls2)
    {
      return [ls1[0], ls1[1], ls1[2], ls1[3], ls1[2], ls1[3], ls2[2], ls2[3]];
    }
  
    generateLinePoints(x1, y1, x2, y2, startDir, endDir)
    {
      let component=this;

      let d=20;
      let ox1, oy1, ox2, oy2;
      ({x: ox1, y: oy1}=component.offsetPoint(startDir, x1, y1, d));
      ({x: ox2, y: oy2}=component.offsetPoint(endDir, x2, y2, d));
  
      let possiblePaths=
      [
        [[x1, y1, ox1, oy1], [ox1,oy1,ox1,oy2], [ox1,oy2,ox2,oy2], [ox2, oy2, x2, y2]],
        [[x1, y1, ox1, oy1], [ox1,oy1,ox2,oy1], [ox2,oy1,ox2,oy2], [ox2, oy2, x2, y2]]
      ];
  
      let points=[{x: x1, y: y1}, {x: y2, y:y2}];
      let spl=null;
      
      possiblePaths.forEach((pathLines)=>
      {
        if(!component.pointsOnLine(pathLines[1], points) && !component.pointsOnLine(pathLines[2], points))
        {
          pathLines.directions=component.countDirectionChanges(pathLines);
          if(spl==null) spl=pathLines;
          else if(pathLines.directions<spl.directions) spl=pathLines;
        }
      });
      
      let bd=10;
      let [ls1, ls2]=component.breakLineSegment(spl[0], 0, bd);
      let [ls3, ls4, ls5]=component.breakLineSegment(spl[1], bd, bd);
      let [ls6, ls7, ls8]=component.breakLineSegment(spl[2], bd, bd);
      let [ls9, ls10]=component.breakLineSegment(spl[3], bd, 0);
  
      let lineSegments=[ls1, component.combineLineSegments(ls2, ls3), ls4, component.combineLineSegments(ls5, ls6), ls7, component.combineLineSegments(ls8, ls9), ls10];
      return lineSegments;
    }

    getLinePoints(x1, y1, x2, y2, startDir, endDir)
    {
      let component=this;
  
      let d=20;
      let ox1, oy1, ox2, oy2;
      ({x: ox1, y: oy1}=component.offsetPoint(startDir, x1, y1, d));
      ({x: ox2, y: oy2}=component.offsetPoint(endDir, x2, y2, d));
  
      let possiblePaths=
      [
        [[x1, y1, ox1, oy1], [ox1,oy1,ox1,oy2], [ox1,oy2,ox2,oy2], [ox2, oy2, x2, y2]],
        [[x1, y1, ox1, oy1], [ox1,oy1,ox2,oy1], [ox2,oy1,ox2,oy2], [ox2, oy2, x2, y2]]
      ];
  
      let points=[{x: x1, y: y1}, {x: y2, y:y2}];
      let spl=null;
      
      possiblePaths.forEach((pathLines)=>
      {
        if(!component.pointsOnLine(pathLines[1], points) && !component.pointsOnLine(pathLines[2], points))
        {
          pathLines.directions=component.countDirectionChanges(pathLines);
          if(spl==null) spl=pathLines;
          else if(pathLines.directions<spl.directions) spl=pathLines;
        }
      });
      
      return [...spl[0], spl[2][0], spl[2][1], ...spl[3]];
    }    
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

