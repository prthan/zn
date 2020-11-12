(function(window)
{
  let __package  = "zn.designer";
  let __name     = "surface";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;

  let component = {};

  component.create=(options)=>
  {
    let znc=new Surface(options);
    return znc;
  }

  component.get=(name)=>
  {
    return $(`[zn-surface='${name}']`).get()[0].znc;
  }
  
  let Surface=function(options)
  {
    this.options=options;
    this.eventHandlers={};
    this.data={};
  }

  Surface.prototype.init=function()
  {
    let surface=this;
    surface.$target=$(surface.options.target);
    surface.$target.addClass("zn-surface");

    surface.options.width=surface.options.width || 2000;
    surface.options.height=surface.options.height || 2000;
    surface.options.minorTick=surface.options.minorTick || 10;
    surface.options.majorTick=surface.options.majorTick || 100;
    surface.options.snapSize=surface.options.snapSize || 5;

    surface.setupUI();
    surface.setupEventHandlers();
    surface.$target.get()[0].znc=surface;
    surface.fireEvent("init");
  }

  Surface.prototype.on=function(eventName, eventHandler)
  {
    let surface=this;
    (surface.eventHandlers[eventName]=surface.eventHandlers[eventName] || []).push(eventHandler);
  }

  Surface.prototype.fireEvent=function(eventName, event)
  {
    let surface=this;
    let evt=event || {};
    evt.source=surface;
    (surface.eventHandlers[eventName] || []).forEach((eh)=>eh(evt));
  }
  
  Surface.prototype.setupUI=function()
  {
    let surface=this;
    surface.$target.html(component.html());
    surface.$stage=surface.$target.find(".zn-surface-stage");
    surface.$stage.css("width", surface.options.width).css("height", surface.options.height);

    surface.stage=new Konva.Stage({
      container: surface.$stage.get()[0],
      width: surface.options.width,
      height: surface.options.height
    });

    surface.stage.setAttr("majorTick", surface.options.majorTick);
    surface.stage.setAttr("minorTick", surface.options.minorTick);
    surface.stage.setAttr("snap", surface.options.snapSize);

    surface.setupLayers();
  }


  Surface.prototype.setupLayers=function()
  {
    let surface=this;

    surface.setupGridLayer();

    surface.connectorsLayer=new Konva.Layer();
    surface.stage.add(surface.connectorsLayer);

    surface.shapesLayer=new Konva.Layer();
    surface.stage.add(surface.shapesLayer);

    surface.dragLayer=new Konva.Layer();
    surface.stage.add(surface.dragLayer);
  }

  Surface.prototype.setupGridLayer=function()
  {
    let surface=this;
    let layer=surface.gridLayer=new Konva.Layer();
    surface.stage.add(surface.gridLayer);

    let w=surface.stage.width();
    let h=surface.stage.height();
    let background=new Konva.Rect({
      x:0,
      y:0,
      width: w,
      height: h,
      fill: '#f9f9f9'
    })
    layer.add(background);
    utils.addGridLines(layer,0,w,h,surface.options.minorTick,"#efefef",0);
    utils.addGridLines(layer,0,h,w,surface.options.minorTick,"#efefef",1);
    utils.addGridLines(layer,0,w,h,surface.options.majorTick,"#dfdfdf",0);
    utils.addGridLines(layer,0,h,w,surface.options.majorTick,"#dfdfdf",1);
    surface.gridLayer.batchDraw();
    background.addName("grid");
    background.on("mouseenter", ()=>
    {
      surface.stage.fire("grid-select", {});
    })
  }

  Surface.prototype.setupEventHandlers=function()
  {
    let surface=this;

    surface.stage.on("mousemove", (event)=>
    {
      if(surface.operation) surface.operation.update(event.evt.layerX, event.evt.layerY);
    })

    surface.stage.on("mouseup", (event)=>
    {
      if(surface.operation)
      {
        surface.operation.end(event.evt.clientX, event.evt.clientY);
        surface.operation=null;
      }
    })

    surface.stage.on("shape-select", (event)=>surface.onShapeSelect(event));
    surface.stage.on("grid-select", (event)=>surface.onGridSelect(event));
    surface.stage.on("connector-select", (evt)=>surface.onConnectorSelect(evt));
    surface.stage.on("points-connected", (evt)=>surface.onPointsConnected(evt));
  }

  Surface.prototype.addShape=function(shape)
  {
    let surface=this;
    surface.shapesLayer.add(shape);
  }

  Surface.prototype.addConnectorLine=function(shape)
  {
    let surface=this;
    surface.connectorsLayer.add(shape);
    surface.connectorsLayer.batchDraw();
  }

  Surface.prototype.onShapeSelect=function(evt)
  {
    let surface=this;

    if(surface.currentShape) utils.showConnectors(surface.currentShape, false);
    let source=evt.source;
    utils.showConnectors(source, true);
    surface.currentShape=source;
  }

  Surface.prototype.onGridSelect=function(evt)
  {
    let surface=this;
    if(surface.currentShape)
    {
      utils.showConnectors(surface.currentShape, false);
      surface.currentShape=false;
    }
  } 

  Surface.prototype.onConnectorSelect=function(evt)
  {
    let surface=this;
    let source=evt.source;
    let ctx=source.getAttr("zn-ctx");
    let parentCtx=ctx.parent.getAttr("zn-ctx");
    
    surface.operation=new DrawConnectorOperation(surface, source);
    surface.operation.start();
    console.log("select", parentCtx.name, ctx.name, utils.pointOf(source));
  }

  Surface.prototype.onPointsConnected=function(event)
  {
    let surface=this;
    let connectorLine=new zn.designer.shape.ConnectorLine(event.p0, event.p1, {name: "connection"});
    surface.addConnectorLine(connectorLine.$shape);

    let sourcePt=event.p0.getAttr("zn-ctx");
    let source=sourcePt.parent.getAttr("zn-ctx");

    let targetPt=event.p1.getAttr("zn-ctx");
    let target=targetPt.parent.getAttr("zn-ctx");

    console.log(source, sourcePt);
    console.log(target, targetPt);
  }

  let DrawConnectorOperation=function(surface, cp)
  {
    let op=this;
    op.cp0=cp;
    op.cpdir=cp.getAttr("zn-ctx").direction;
    op.p0=utils.pointOf(cp);
    op.p1={x: op.p0.x, y: op.p0.y};
    op.surface=surface;
  }

  DrawConnectorOperation.prototype.start=function()
  {
    let op=this;
    let points=utils.blinePoints(op.p0.x, op.p0.y, op.p1.x, op.p1.y, op.cpdir);
    op.line=new Konva.Line({
      points: points,
      bezier: true,
      fill: props["connector.fill"],
      stroke: props["connector.fill"],
      strokeWidth: 2,
      hitStrokeWidth: 10,
      dash: [5, 5],
    });
    op.surface.dragLayer.add(op.line);
    op.surface.dragLayer.batchDraw();
  }

  DrawConnectorOperation.prototype.update=function(x, y)
  {
    let op=this;
    op.p1.x=x;
    op.p1.y=y;
    let points=utils.blinePoints(op.p0.x, op.p0.y, op.p1.x, op.p1.y, op.cpdir);
    op.line.points(points);
    op.surface.dragLayer.batchDraw();

    let connectorPoint=op.surface.stage.getIntersection({x: x, y: y}, ".connector");
    if(connectorPoint!=null)
    {
      op.cp1=connectorPoint;
    }
  }

  DrawConnectorOperation.prototype.end=function(x, y)
  {
    let op=this;
    op.p1.x=x;
    op.p1.y=y;
    op.line.destroy();
    op.surface.dragLayer.batchDraw();
    
    if(op.cp0!=op.cp1) op.surface.stage.fire("points-connected", {p0: op.cp0, p1: op.cp1});
  }

  component.html=function()
  {
    return `<div class="zn-surface-stage"></div>`;
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=component;

})(window);

