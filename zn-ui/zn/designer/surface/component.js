(function(window)
{
  let __package  = "zn.designer";
  let __name     = "surface";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

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

    surface.stage.setAttr("snap", props["grid.snap.size"]);

    surface.setupLayers();
  }


  Surface.prototype.setupLayers=function()
  {
    let surface=this;

    surface.gridLayer=new zn.designer.layer.Grid(surface.stage).$layer;
    surface.stage.add(surface.gridLayer);

    surface.connectorsLayer=new Konva.Layer({name: "connectors-layer"});
    surface.stage.add(surface.connectorsLayer);

    surface.shapesLayer=new Konva.Layer({name: "shapes-layer"});
    surface.stage.add(surface.shapesLayer);

    surface.dragLayer=new Konva.Layer({name: "drag-layer"});
    surface.stage.add(surface.dragLayer);

    //surface.test();

    surface.stage.batchDraw();
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
        surface.operation.end(event.evt.layerX, event.evt.layerY);
        surface.operation=null;
      }
    })

    surface.stage.on("shape-select", (event)=>surface.onShapeSelect(event));
    surface.stage.on("shape-transform", (event)=>surface.onShapeTransform(event));
    surface.stage.on("grid-select", (event)=>surface.onGridSelect(event));
    surface.stage.on("connector-select", (evt)=>surface.onConnectorSelect(evt));
    surface.stage.on("connection-select", (evt)=>surface.onConnectionSelect(evt));
    surface.stage.on("points-connected", (evt)=>surface.onPointsConnected(evt));
  }

  Surface.prototype.addShape=function(shapeComponent)
  {
    let surface=this;
    surface.shapesLayer.add(shapeComponent.$shape);
  }

  Surface.prototype.addConnectorLine=function(connectorLineComponent)
  {
    let surface=this;
    surface.connectorsLayer.add(connectorLineComponent.$shape);
    surface.connectorsLayer.batchDraw();
  }

  Surface.prototype.onShapeSelect=function(evt)
  {
    let surface=this;
    if(surface.currentTransformer)
    {
      surface.currentTransformer.destroy();
      surface.currentTransformer=null;
    }
  } 

  Surface.prototype.onShapeTransform=function(evt)
  {
    let surface=this;
    let source=evt.source;
    let group=source.$shape;

    surface.currentTransformer=new zn.designer.shape.Transformer(surface.dragLayer, source);
    surface.dragLayer.batchDraw();
  }

  Surface.prototype.onGridSelect=function(evt)
  {
    let surface=this;
    base.resetSelection(surface.shapesLayer);
    if(surface.currentTransformer)
    {
      surface.currentTransformer.destroy();
      surface.currentTransformer=null;
    }
  } 

  Surface.prototype.onConnectorSelect=function(evt)
  {
    let surface=this;
    let source=evt.source;
    let ctx=source.$shape.getAttr("zn-ctx");
    let parentCtx=source.$shape.getParent().getAttr("zn-ctx");

    surface.operation=new DrawConnectorOperation(surface, source.$shape);
    surface.operation.start();
    console.log("connector-select", `[${parentCtx.name}]$[${ctx.name}]`);
  }

  Surface.prototype.onPointsConnected=function(event)
  {
    let surface=this;

    let source=event.p0.getAttr("zn-ctx");
    let target=event.p1.getAttr("zn-ctx");

    let ctx=
    {
      name: "connection",
      source: source,
      target: target
    }

    let connectorLine=new zn.designer.shape.ConnectorLine(event.p0, event.p1, ctx);
    surface.addConnectorLine(connectorLine);

    surface.fireEvent("points-connected", {connection: {source: source, target: target}});
    console.log("source:", source);
    console.log("target:", target);
  }

  Surface.prototype.onConnectionSelect=function(evt)
  {
    let surface=this;
    let source=evt.source;
    let ctx=source.getAttr("zn-ctx");

    console.log("connection-select", `[${ctx.source}]$[${ctx.sourcePoint}] >>> [${ctx.targetPoint}]$[${ctx.target}]`);
  }
  
  Surface.prototype.test=function()
  {
    let surface=this;

    let group=new Konva.Group({
      x: 700, y:100,
      width: 300, height: 200
    })

    let text=new Konva.Text({
      x: 0, y: 0,
      text: "This a sample text",
      fontFamily: "Courier",
      fontSize: 11,
      fontStyle: "normal",
      stroke: "#376d8a",
      strokeWidth: 1,
      width: 300, height: 200
    });
    group.add(text);

    surface.shapesLayer.add(group);
    
  }
  let DrawConnectorOperation=function(surface, cp)
  {
    let op=this;
    op.cp0=cp;
    op.cpdir=cp.getAttr("zn-ctx").direction;
    op.p0=base.pointOf(cp);
    op.p1={x: op.p0.x, y: op.p0.y};
    op.surface=surface;
  }

  DrawConnectorOperation.prototype.start=function()
  {
    let op=this;
    //let points=utils.blinePoints(op.p0.x, op.p0.y, op.p1.x, op.p1.y, op.cpdir);
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

  DrawConnectorOperation.prototype.update=function(x, y)
  {
    let op=this;
    op.p1.x=x;
    op.p1.y=y;
    //let points=utils.blinePoints(op.p0.x, op.p0.y, op.p1.x, op.p1.y, op.cpdir);
    let points=[op.p0.x, op.p0.y, op.p1.x, op.p1.y];
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
    
    if(op.cp0 && op.cp1 && op.cp0!=op.cp1) op.surface.stage.fire("points-connected", {p0: op.cp0, p1: op.cp1});
  }

  component.html=function()
  {
    return `<div class="zn-surface-stage"></div>`;
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=component;

})(window);

