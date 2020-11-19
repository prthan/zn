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
    this.data=
    {
      shapeComponents: {},
      lineComponents: {},
      graph: {}
    };
    
    this.shapeClasses=
    {
      "rectangle": "zn.designer.shape.Rectangle",
      "diamond": "zn.designer.shape.Diamond",
      "ellipse": "zn.designer.shape.Ellipse",
      "pill": "zn.designer.shape.Pill",
      "list": "zn.designer.shape.List"
    }
  }

  Surface.prototype.init=function()
  {
    let surface=this;
    surface.$target=$(surface.options.target);
    surface.$target.addClass("zn-surface");
    surface.$target.attr("zn-surface", surface.options.name);

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

    surface.stage.batchDraw();
  }

  Surface.prototype.setupEventHandlers=function()
  {
    let surface=this;

    surface.stage.on("mousedown", (event)=>
    {
      if(surface.mode=="position")
      {
        surface.fireEvent("position", {x: event.evt.layerX, y: event.evt.layerY});
        surface.mode="select";
      }
      else if(surface.operation) surface.operation.start(event.evt.layerX, event.evt.layerY);
    })

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
        surface.mode="select";
      }
    })

    surface.stage.on("shape-select", (event)=>surface.onShapeSelect(event));
    surface.stage.on("shape-transform", (event)=>surface.onShapeTransform(event));
    surface.stage.on("grid-select", (event)=>surface.onGridSelect(event));
    surface.stage.on("connector-select", (evt)=>surface.onConnectorSelect(evt));
    surface.stage.on("connection-select", (evt)=>surface.onConnectionSelect(evt));
    surface.stage.on("points-connected", (evt)=>surface.onPointsConnected(evt));
    surface.stage.on("select-objects", (evt)=>surface.onSelectObjects(evt));
    surface.stage.on("selection-set-modify", (evt)=>surface.onSelectionSetModify(evt));
    surface.stage.on("draw-object", (evt)=>surface.onDrawObject(evt));

    surface.$stage.on("keydown", (evt)=>surface.handleKeyEvents(evt));
  }

  Surface.prototype.handleKeyEvents=function(evt)
  {
    let surface=this;
    if(evt.key=="Delete") surface.onDelete();
  }

  Surface.prototype.onShapeSelect=function(evt)
  {
    let surface=this;
    if(surface.currentTransformer)
    {
      surface.currentTransformer.destroy();
      surface.currentTransformer=null;
    }
    base.resetConnectorLineSelection(surface.connectorsLayer);
    surface.data.currentSelection={obj: evt.source.ctx.name};
    surface.fireEvent("obj-select", {obj: evt.source.ctx});
  } 

  Surface.prototype.onShapeTransform=function(evt)
  {
    let surface=this;
    let source=evt.source;
    let group=source.$shape;

    surface.currentTransformer=new zn.designer.shape.Transformer(surface.dragLayer, source);
    surface.dragLayer.batchDraw();
  }

  Surface.prototype.onGridSelect=function(event)
  {
    let surface=this;
    let selectedItems=surface.shapesLayer.find(".selected").toArray();
    base.resetSelection(surface.shapesLayer);
    if(surface.currentTransformer)
    {
      surface.currentTransformer.destroy();
      surface.currentTransformer=null;
    }
    if(selectedItems.length>0) surface.fireEvent("selection-set-change", {selection: []});
    base.resetConnectorLineSelection(surface.connectorsLayer);

    if(surface.mode=="position") surface.operation=new zn.designer.op.DrawObject(surface);
    if(surface.mode=="draw") surface.operation=new zn.designer.op.DrawObject(surface)
    else surface.operation=new zn.designer.op.SelectObjects(surface);
    surface.operation.start(event.mouseEvent.evt.layerX, event.mouseEvent.evt.layerY);

    surface.data.currentSelection={}
  } 

  Surface.prototype.onConnectorSelect=function(event)
  {
    let surface=this;
    let source=event.source;
    let ctx=source.$shape.getAttr("zn-ctx");
    let parentCtx=source.$shape.getParent().getAttr("zn-ctx");

    surface.operation=new zn.designer.op.DrawConnector(surface, source.$shape);
    surface.operation.start();
  }

  Surface.prototype.onPointsConnected=function(event)
  {
    let surface=this;

    let from=event.p0.getAttr("zn-ctx");
    let to=event.p1.getAttr("zn-ctx");

    surface.addConnection(from, to);
    surface.fireEvent("rel-create", {from: from, to: to});
  }

  Surface.prototype.onConnectionSelect=function(evt)
  {
    let surface=this;
    let source=evt.source;
    let ctx=source.getAttr("zn-ctx");

    let selectedItems=surface.shapesLayer.find(".selected").toArray();
    base.resetSelection(surface.shapesLayer);
    if(selectedItems.length>0) surface.fireEvent("selection-set-change", {selection: []});
    surface.data.currentSelection={rel: ctx.name}
    surface.fireEvent("rel-select", {rel: ctx});
  }

  Surface.prototype.onSelectObjects=function(evt)
  {
    let surface=this;
    base.resetSelection(surface.shapesLayer);
    let selection=[];
    Object.values(surface.data.shapeComponents)
          .filter((shapeComponent)=>utils.intersect(evt.rect, shapeComponent.getRect()))
          .forEach((shapeComponent)=>
          {
            let shape=shapeComponent.$shape;
            base.showSelection(shape, true)
            shape.addName("selected");
            selection.push(shapeComponent.ctx);
          });
    surface.data.currentSelection={set: selection}

    surface.fireEvent("selection-set-change", {selection: selection});
  }

  Surface.prototype.onSelectionSetModify=function(evt)
  {
    let surface=this;
    let selection=[];
    
    surface.shapesLayer.find(".selected").each((shape)=>
    {
      selection.push(shape.getAttr("zn-ctx"));
    });

    surface.data.currentSelection={set: selection};

    surface.fireEvent("selection-set-change", {selection: selection});
  }

  Surface.prototype.onDrawObject=function(evt)
  {
    let surface=this;
    surface.fireEvent("draw-object", {rect: evt.rect});
  }
  
  Surface.prototype.onDelete=function()
  {
    let surface=this;
    let objs=[];
    let rels=[];

    if(!surface.data.currentSelection) return;

    if(surface.data.currentSelection.obj)
    {
      objs.push(surface.data.shapeComponents[surface.data.currentSelection.obj].ctx);
      rels.push(...surface.getShapeConnections([surface.data.currentSelection.obj]));
      surface.deleteShape(surface.data.currentSelection.obj);
    }

    if(surface.data.currentSelection.rel)
    {
      rels.push(surface.data.lineComponents[surface.data.currentSelection.rel].ctx)
      surface.deleteConnection(surface.data.currentSelection.rel);
    }
    
    if(surface.data.currentSelection.set)
    {
      let shapeNames=surface.data.currentSelection.set.map((v)=>{return v.name});
      rels.push(...surface.getShapeConnections(shapeNames));
      surface.deleteShapes(shapeNames);
    }
    surface.data.currentSelection={};

    if(surface.currentTransformer)
    {
      surface.currentTransformer.destroy();
      surface.currentTransformer=null;
    }

    surface.fireEvent("delete", {objs: objs, rels: rels});
  }

  Surface.prototype.reset=function()
  {
    let surface=this;
    surface.shapesLayer.destroyChildren();
    surface.connectorsLayer.destroyChildren();

    surface.shapesLayer.batchDraw();
    surface.connectorsLayer.batchDraw();

    surface.data=
    {
      shapeComponents: {},
      lineComponents: {},
      graph: {}
    }
  }

  Surface.prototype.addShapeComponent=function(shapeComponent)
  {
    let surface=this;
    surface.shapesLayer.add(shapeComponent.$shape);
    surface.shapesLayer.batchDraw();
    surface.data.shapeComponents[shapeComponent.ctx.name]=shapeComponent;
  }

  Surface.prototype.addShape=function(type, rect, ctx)
  {
    let surface=this;
    let clazz=utils.findClass(surface.shapeClasses[type]);
    if(clazz==null)
    {
      console.error(`class ${surface.shapeClasses[type]} not found for shape type ${type}`);
      return;
    }

    let x=rect.x;
    let y=rect.y;
    let w=rect.width;
    let h=rect.height;

    let shapeComponent=new clazz(x, y, w, h, ctx);
    surface.addShapeComponent(shapeComponent);
  }

  Surface.prototype.deleteShape=function(name, redraw)
  {
    let surface=this;
    if(!surface.data.shapeComponents[name]) return;
    let shapeComponent=surface.data.shapeComponents[name];
    let shapeConnections=shapeComponent.connectorLines();
    
    shapeComponent.destroy();
    delete surface.data.shapeComponents[name];
    if(redraw!=="N") surface.shapesLayer.batchDraw();

    surface.deleteConnections(shapeConnections);
  }
  
  Surface.prototype.deleteShapes=function(names)
  {
    let surface=this;
    names.forEach((name)=> surface.deleteShape(name, "N"));
    surface.shapesLayer.batchDraw();
  }

  Surface.prototype.addConnectionComponent=function(connectorLineComponent)
  {
    let surface=this;
    surface.connectorsLayer.add(connectorLineComponent.$shape);
    surface.connectorsLayer.batchDraw();
    surface.data.lineComponents[connectorLineComponent.ctx.name]=connectorLineComponent;
  }

  Surface.prototype.addConnection=function(from, to)
  {
    let surface=this;
    let fromCpData=surface.cpData(from);
    let toCpData=surface.cpData(to);

    let ctx=
    {
      name: `${fromCpData.name}-${toCpData.name}`,
      from: fromCpData.cp.ctx,
      to: toCpData.cp.ctx
    }

    let connectorLine=new zn.designer.shape.ConnectorLine(fromCpData.cp.$shape, toCpData.cp.$shape, ctx);
    surface.addConnectionComponent(connectorLine);
  }

  Surface.prototype.getShapeConnections=function(shapeNames)
  {
    let surface=this;
    let connections=[];
    shapeNames.forEach((shapeName)=>
    {
      let shapeComponent=surface.data.shapeComponents[shapeName];
      let connectNames=shapeComponent.connectorLines();
      connectNames.forEach((name)=>connections.push(surface.data.lineComponents[name].ctx));
    });

    return connections;
  }

  Surface.prototype.deleteConnection=function(name, redraw)
  {
    let surface=this;
    if(!surface.data.lineComponents[name]) return;

    let lineComponent=surface.data.lineComponents[name];
    lineComponent.destroy();
    delete surface.data.lineComponents[name];
    if(redraw!=="N") surface.connectorsLayer.batchDraw();
  }

  Surface.prototype.deleteConnections=function(names)
  {
    let surface=this;
    names.forEach((name)=>surface.deleteConnection(name, "N"));
    surface.connectorsLayer.batchDraw();
  }

  Surface.prototype.setMode=function(mode)
  {
    let surface=this;
    surface.mode=mode;
  }

  Surface.prototype.cpData=function(ctx)
  {
    let surface=this;
    let parent=ctx.parent;
    let map=surface.data.shapeComponents;

    let obj=map[parent.name];
    if(parent.type=="list-item") obj=map[parent.list].nodes[parent.index];
    if(parent.type=="list-header") obj=map[parent.list].headerNode;

    let cp=obj.connectorPoints[ctx.name];
    return {cp: cp, name: `${parent.list ? '/'+parent.list : ''}/${parent.name}/${ctx.name}`};
  }

  Surface.prototype.exportToJson=function()
  {
    let component=this;
    let jsonData={shapes: [], lines:[]};
    
    Object.values(component.data.shapeComponents)
          .forEach((shapeComponent)=>jsonData.shapes.push({type: shapeComponent.$type, rect: shapeComponent.getRect(), ctx: shapeComponent.ctx}));

    Object.values(component.data.lineComponents)
          .forEach((lineComponent)=>jsonData.lines.push(lineComponent.ctx));

    return JSON.stringify(jsonData);
  }

  Surface.prototype.importFromJson=function(jsonDataStr)
  {
    let jsonData=JSON.parse(jsonDataStr);
    let surface=this;
    surface.reset();

    jsonData.shapes.forEach((shapeData)=>surface.addShape(shapeData.type, shapeData.rect, shapeData.ctx));
    jsonData.lines.forEach((lineData)=>surface.addConnection(lineData.from, lineData.to));
  }

  Surface.prototype.downloadAsImage=function()
  {
    let surface=this;
    let dataURL=surface.stage.toDataURL({pixelRatio: 1});

    var downloadLink = document.createElement('a');
    downloadLink.download = "surface-drawing.png";
    downloadLink.href = dataURL;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    delete downloadLink;
  }

  component.html=function()
  {
    return `<div class="zn-surface-stage" tabindex="1"></div>`;
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=component;

})(window);

