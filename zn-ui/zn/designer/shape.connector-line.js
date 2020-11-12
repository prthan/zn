(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "ConnectorLine";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;

  let Component=function(cp0, cp1, ctx)
  {
    let component=this;
    component.cp0=cp0;
    component.cp1=cp1;
    component.ctx=ctx;

    let p0=utils.pointOf(cp0);
    let p1=utils.pointOf(cp1);

    component.cp0Direction=component.cp0.getAttr("zn-ctx").direction;
    component.$shape=new Konva.Arrow({
      points: utils.blinePoints(p0.x, p0.y, p1.x, p1.y, component.cp0Direction),
      bezier: true,
      fill: props["connector.fill"],
      stroke: props["connector.fill"],
      strokeWidth: 2,
      pointerLength: 5,
      pointerWidth: 4,
      hitStrokeWidth: 10,
      listening: false
    });
    component.$shape.setAttr("zn-ctx", ctx);
    component.$shape.addName("connector-line");
    
    component.setupEventHandlers();
  }

  Component.prototype.setupEventHandlers=function()
  {
    let component=this;
    let line=component.$shape;
    
    let updateLine=()=>
    {
      let p0=utils.pointOf(component.cp0);
      let p1=utils.pointOf(component.cp1);
      let blinePoints=utils.blinePoints(p0.x, p0.y, p1.x, p1.y, component.cp0Direction);
      line.points(blinePoints);
      line.getLayer().batchDraw();
    }

    component.cp0.on("connector-update", updateLine);
    component.cp1.on("connector-update", updateLine);

  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

