(function(window)
{
  let __package  = "zn.designer";
  let __name     = "Utils";

  let Component={}

  Component.snap=(shape)=>
  {
    let stage=shape.getStage();
    let snap=stage.getAttr("snap");
    if(!snap) return;

    let v=shape.x();
    shape.x(v -(v % snap));
    v=shape.y();
    shape.y(v -(v % snap));

    shape.getLayer().draw();
  }

  Component.showConnectors=(shape, state)=>
  {
    shape.find(".connector").each((connector)=>connector.visible(state));
    shape.getLayer().batchDraw();
  }
  
  Component.fireConnectorPointUpdateEvent=(shape)=>
  {
    let shapeCtx=shape.getAttr("zn-ctx");
    shape.find(".connector").each((connector)=>
    {
      let connectorCtx=connector.getAttr("zn-ctx");
      connector.fire("connector-update", {source: connector, shape: shapeCtx.name, point: connectorCtx.name});
    });
  }

  Component.pointOf=(connector)=>
  {
    let shape=connector.getParent();
    return {x: shape.x() + connector.x(), y: shape.y() + connector.y()}    
  }

  Component.addGridLines=(layer, s, e, l, i, c, d)=>
  {
    s+=0.5;
    while(s<e)
    {
      var line=new Konva.Line({
        points:[s*(1-d),s*d,s*(1-d)+l*d,l*(1-d)+s*d],
        strokeWidth: 1,
        stroke: c,
        listening: false
      })
      layer.add(line);
      s+=i;
    }
  }

  Component.blinePoints=(x1, y1, x2, y2, direction)=>
  {
    let dx=x2-x1;
    let dy=y2-y1;
    let points=[x1, y1];

    if(direction=="top") points.push(x1, y1+dy/2, x2, y1+dy/2, x2, y2);
    else if(direction=="right") points.push(x1+dx/2, y1, x1+dx/2, y2, x2, y2);
    else if(direction=="bottom") points.push(x1, y1+dy/2, x2, y1+dy/2, x2, y2);
    else if(direction=="left") points.push(x1+dx/2, y1, x1+dx/2, y2, x2, y2);
    else
    {
      if(Math.abs(dx) < Math.abs(dy)) points.push(x1+dx/4, y1, x1+dx/4, y2, x2, y2);
      else points.push(x1, y1+dy/4, x2, y1+dy/4, x2, y2);
    }

    return points;
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

