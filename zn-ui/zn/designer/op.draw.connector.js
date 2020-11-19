(function(window)
{
  let __package  = "zn.designer.op";
  let __name     = "DrawConnector";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  let Operation=function(surface, cp)
  {
    let op=this;
    op.cp0=cp;
    op.cpdir=cp.getAttr("zn-ctx").direction;
    op.p0=base.pointOf(cp);
    op.p1={x: op.p0.x, y: op.p0.y};
    op.surface=surface;
  }

  Operation.prototype.start=function(x, y)
  {
    let op=this;
    let points=[op.p0.x, op.p0.y, op.p1.x, op.p1.y];
    op.line=new Konva.Line({
      points: points,
      bezier: false,
      fill: props["connector.fill"],
      stroke: props["connector.fill"],
      strokeWidth: 2,
      hitStrokeWidth: 10,
      dash: [5, 5],
    });
    op.surface.dragLayer.add(op.line);
    op.surface.dragLayer.batchDraw();
  }

  Operation.prototype.update=function(x, y)
  {
    let op=this;
    op.p1.x=x;
    op.p1.y=y;
    let points=[op.p0.x, op.p0.y, op.p1.x, op.p1.y];
    op.line.points(points);
    op.surface.dragLayer.batchDraw();

    let connectorPoint=op.surface.stage.getIntersection({x: x, y: y}, ".connector");
    if(connectorPoint!=null)
    {
      op.cp1=connectorPoint;
    }
  }

  Operation.prototype.end=function(x, y)
  {
    let op=this;
    op.p1.x=x;
    op.p1.y=y;
    op.line.destroy();
    op.surface.dragLayer.batchDraw();
    
    if(op.cp0 && op.cp1 && op.cp0!=op.cp1) op.surface.stage.fire("points-connected", {p0: op.cp0, p1: op.cp1});
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Operation;

})(window);

