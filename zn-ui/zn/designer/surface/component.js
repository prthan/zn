(function(window)
{
  let __package  = "zn.designer";
  let __name     = "Surface";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  class Surface
  {
    constructor(options)
    {
      this.options = options;
      this.eventHandlers = {};
      this.data =
      {
        shapeComponents: {},
        lineComponents: {}
      };

      this.shapeClasses =
      {
        "rectangle": "zn.designer.shape.Rectangle",
        "rectangle-area": "zn.designer.shape.RectangleArea",
        "diamond": "zn.designer.shape.Diamond",
        "ellipse": "zn.designer.shape.Ellipse",
        "pill": "zn.designer.shape.Pill",
        "list": "zn.designer.shape.List"
      };

      this.seq=0;
    }

    init()
    {
      let surface = this;
      surface.$target = $(surface.options.target);
      surface.$target.addClass("zn-surface");
      surface.$target.attr("zn-surface", surface.options.name);

      surface.options.width = surface.options.width || 1500;
      surface.options.height = surface.options.height || 1500;
      surface.setupUI();
      surface.setupEventHandlers();
      surface.$target.get()[0].znc = surface;
      surface.fireEvent("init");
    }

    on(eventName, eventHandler)
    {
      let surface = this;
      (surface.eventHandlers[eventName] = surface.eventHandlers[eventName] || []).push(eventHandler);
    }

    fireEvent(eventName, event)
    {
      let surface = this;
      let evt = event || {};
      evt.source = surface;
      (surface.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }

    setupUI()
    {
      let surface = this;
      surface.$target.html(Surface.html());
      surface.$stage = surface.$target.find(".zn-surface-stage");
      surface.$stage.css("width", surface.options.width).css("height", surface.options.height);

      surface.stage = new Konva.Stage({
        container: surface.$stage.get()[0],
        width: surface.options.width,
        height: surface.options.height
      });

      surface.stage.setAttr("snap", props["grid.snap.size"]);

      surface.setupLayers();
    }

    setupLayers()
    {
      let surface = this;

      surface.gridLayer = new zn.designer.layer.Grid(surface.stage, surface.options);
      surface.stage.add(surface.gridLayer.$layer);

      surface.connectorsLayer = new Konva.Layer({ name: "connectors-layer" });
      surface.stage.add(surface.connectorsLayer);

      surface.shapesLayer = new Konva.Layer({ name: "shapes-layer" });
      surface.stage.add(surface.shapesLayer);

      surface.dragLayer = new Konva.Layer({ name: "drag-layer" });
      surface.stage.add(surface.dragLayer);

      surface.stage.batchDraw();
    }

    setupEventHandlers()
    {
      let surface = this;

      surface.stage.on("mousedown", (event) =>
      {
        if (surface.mode == "position")
        {
          surface.fireEvent("position", { x: event.evt.layerX, y: event.evt.layerY });
          surface.mode = "select";
        }
        else if (surface.operation) surface.operation.start(event.evt.layerX, event.evt.layerY);
      });

      surface.stage.on("mousemove", (event) =>
      {
        if (surface.operation)
          surface.operation.update(event.evt.layerX, event.evt.layerY);
      });

      surface.stage.on("mouseup mouseleave", (event) =>
      {
        if (surface.operation)
        {
          surface.operation.end(event.evt.layerX, event.evt.layerY);
          surface.operation = null;
          surface.mode = "select";
        }
      });

      surface.stage.on("shape-select", (event) => surface.onShapeSelect(event));
      surface.stage.on("shape-transform", (event) => surface.onShapeTransform(event));
      surface.stage.on("grid-select", (event) => surface.onGridSelect(event));
      surface.stage.on("grid-click", (evt) => surface.fireEvent("stage-select", {event: evt}));
      surface.stage.on("connector-select", (evt) => surface.onConnectorSelect(evt));
      surface.stage.on("connection-select", (evt) => surface.onConnectionSelect(evt));
      surface.stage.on("points-connected", (evt) => surface.onPointsConnected(evt));
      surface.stage.on("select-objects", (evt) => surface.onSelectObjects(evt));
      surface.stage.on("selection-set-modify", (evt) => surface.onSelectionSetModify(evt));
      surface.stage.on("draw-object", (evt) => surface.onDrawObject(evt));
      surface.stage.on("shape-rect-update", (evt) => surface.fireEvent("obj-rect-update", {obj:{...evt.source.ctx, oid: evt.source.oid}}));
      surface.stage.on("delete-connections", (evt) => surface.deleteConnections(evt.ids));
      surface.$stage.on("keydown", (evt) => surface.handleKeyEvents(evt));
    }

    handleKeyEvents(evt)
    {
      let surface = this;
      if (evt.key == "Delete" || evt.key == "Backspace") surface.onDelete();
      if (evt.key == "c" && evt.ctrlKey) surface.onCopy();
      if (evt.key == "v" && evt.ctrlKey) surface.onPaste();
      if (evt.key == "ArrowLeft") surface.move(evt.ctrlKey ? -1 : -10, 0);
      if (evt.key == "ArrowRight") surface.move(evt.ctrlKey ? 1 : 10, 0);
      if (evt.key == "ArrowUp") surface.move(0, evt.ctrlKey ? -1 : -10, );
      if (evt.key == "ArrowDown") surface.move(0, evt.ctrlKey ? 1 : 10);
      if(["Delete", "Backspace", "c", "v", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(evt.key))
      {
        evt.preventDefault();
        evt.stopPropagation();
      }
    }

    onShapeSelect(evt)
    {
      let surface = this;
      if (surface.currentTransformer)
      {
        surface.currentTransformer.destroy();
        surface.currentTransformer = null;
      }
      base.resetConnectorLineSelection(surface.connectorsLayer);
      surface.data.currentSelection = { obj: evt.source.oid };
      surface.fireEvent("obj-select", { obj: {...evt.source.ctx, oid: evt.source.oid }});
    }

    onShapeTransform(evt)
    {
      let surface = this;
      let source = evt.source;
      let group = source.$shape;

      surface.currentTransformer = new zn.designer.shape.Transformer(surface.dragLayer, source);
      surface.dragLayer.batchDraw();
    }

    onGridSelect(event)
    {
      let surface = this;
      let selectedItems = surface.shapesLayer.find(".selected").toArray();
      base.resetSelection(surface.shapesLayer);
      if (surface.currentTransformer)
      {
        surface.currentTransformer.destroy();
        surface.currentTransformer = null;
      }
      if (selectedItems.length > 0) surface.fireEvent("selection-set-change", { selection: [] });
      base.resetConnectorLineSelection(surface.connectorsLayer);

      //if (surface.mode == "position") surface.operation = new zn.designer.op.DrawObject(surface);
      surface.data.currentSelection = {};
      if (surface.mode == "position") return;
      if (surface.mode == "draw") surface.operation = new zn.designer.op.DrawObject(surface);
      else surface.operation = new zn.designer.op.SelectObjects(surface);
      surface.operation.start(event.mouseEvent.evt.layerX, event.mouseEvent.evt.layerY);

      surface.data.currentSelection = {};
    }

    onConnectorSelect(event)
    {
      let surface = this;
      let source = event.source;
      let ctx = source.$shape.getAttr("zn-ctx");
      let parentCtx = source.$shape.getParent().getAttr("zn-ctx");

      surface.operation = new zn.designer.op.DrawConnector(surface, source.$shape);
      surface.operation.start();
    }

    onPointsConnected(event)
    {
      let surface = this;

      let from = event.p0.getAttr("zn-ctx");
      let to = event.p1.getAttr("zn-ctx");

      let oid=surface.addConnection({...from, oid: event.p0.getAttr("zn-oid")}, {...to, oid: event.p1.getAttr("zn-oid")});
      surface.fireEvent("rel-create", { from: {...from, oid: event.p0.getAttr("zn-oid")}, to: {...to, oid: event.p1.getAttr("zn-oid")}, oid: oid });
    }

    onConnectionSelect(evt)
    {
      let surface = this;
      let source = evt.source;
      let ctx = source.getAttr("zn-ctx");

      let selectedItems = surface.shapesLayer.find(".selected").toArray();
      base.resetSelection(surface.shapesLayer);
      if (selectedItems.length > 0)
        surface.fireEvent("selection-set-change", { selection: [] });
      surface.data.currentSelection = { rel: source.getAttr("zn-oid") };
      surface.fireEvent("rel-select", { rel: {...ctx, oid: source.getAttr("zn-oid")} });
    }

    onSelectObjects(evt)
    {
      let surface = this;
      base.resetSelection(surface.shapesLayer);
      let selection = [];
      Object.values(surface.data.shapeComponents)
            .filter((shapeComponent) => utils.intersect(evt.rect, shapeComponent.getRect()))
            .forEach((shapeComponent) =>
            {
              let shape = shapeComponent.$shape;
              base.showSelection(shape, true);
              shape.addName("selected");
              selection.push({...shapeComponent.ctx, oid: shapeComponent.oid});
            });
      surface.data.currentSelection = { set: selection };

      surface.fireEvent("selection-set-change", { selection: selection });
    }

    onSelectionSetModify(evt)
    {
      let surface = this;
      let selection = [];

      surface.shapesLayer.find(".selected").each((shape) =>
      {
        selection.push({...shape.getAttr("zn-ctx"), oid: shape.getAttr("zn-oid")});
      });

      surface.data.currentSelection = { set: selection };

      surface.fireEvent("selection-set-change", { selection: selection });
    }

    onDrawObject(evt)
    {
      let surface = this;
      surface.fireEvent("draw-object", { rect: evt.rect });
    }

    onDelete()
    {
      let surface = this;
      let objs = [];
      let rels = [];

      if (!surface.data.currentSelection) return;

      if (surface.data.currentSelection.obj)
      {
        let objctx=surface.data.shapeComponents[surface.data.currentSelection.obj].ctx;
        objs.push({...objctx, oid: surface.data.currentSelection.obj});
        rels.push(...surface.getShapeConnections([surface.data.currentSelection.obj]));
        surface.deleteShape(surface.data.currentSelection.obj);
      }

      if (surface.data.currentSelection.rel)
      {
        let relctx=surface.data.lineComponents[surface.data.currentSelection.rel].ctx;
        rels.push({...relctx, oid: surface.data.currentSelection.rel});
        surface.deleteConnection(surface.data.currentSelection.rel);
      }

      if (surface.data.currentSelection.set)
      {
        let shapeOids = surface.data.currentSelection.set.map((v) => { return v.oid; });
        rels.push(...surface.getShapeConnections(shapeOids));
        surface.deleteShapes(shapeOids);
      }
      surface.data.currentSelection = {};

      if (surface.currentTransformer)
      {
        surface.currentTransformer.destroy();
        surface.currentTransformer = null;
      }

      surface.fireEvent("delete", { objs: objs, rels: rels });
    }

    onCopy()
    {
      let surface=this;
      let selectedOids=surface.getSelection();
      if(selectedOids.length==0) return;

      surface.copyPaste={list:[], count:0};

      selectedOids.forEach((oid)=>
      {
        let shapeComponent=surface.data.shapeComponents[oid];
        surface.copyPaste.list.push(JSON.stringify(surface.shapeComponentData(shapeComponent)));
      });
    }

    onPaste()
    {
      let surface=this;
      if(!surface.copyPaste || surface.copyPaste.list.length==0) return;

      zn.designer.shape.Base.resetSelection(surface.shapesLayer);
      surface.copyPaste.count++;
      let newSelection=[];
      surface.copyPaste.list.forEach((item)=>
      {
        let shapeData=JSON.parse(item);
        let d=surface.copyPaste.count * 10;
        shapeData.rect.x += d;
        shapeData.rect.y += d;
        let oid=surface.addShape(shapeData.type, shapeData.rect, shapeData.ctx);
        let shapeComponent=surface.data.shapeComponents[oid];
        let $shape=shapeComponent.$shape;
        $shape.addName("selected");
        zn.designer.shape.Base.showSelection($shape, true);
        newSelection.push({...shapeComponent.ctx, oid: oid});
      });
      
      surface.data.currentSelection={set: newSelection};
      surface.fireEvent("obj-create", {set: newSelection});
    }

    move(dx, dy)
    {
      let surface=this;
      let selectedOids=surface.getSelection();
      selectedOids.forEach((oid)=>
      {
        let shapeComponent=surface.data.shapeComponents[oid];
        if(shapeComponent.move) shapeComponent.move(dx, dy);
      })
      surface.shapesLayer.batchDraw();
      surface.connectorsLayer.batchDraw();
    }

    reset()
    {
      let surface = this;
      surface.shapesLayer.destroyChildren();
      surface.connectorsLayer.destroyChildren();

      surface.shapesLayer.batchDraw();
      surface.connectorsLayer.batchDraw();

      surface.data =
      {
        shapeComponents: {},
        lineComponents: {}
      };
    }

    addShapeComponent(shapeComponent)
    {
      let surface = this;
      surface.shapesLayer.add(shapeComponent.$shape);
      surface.shapesLayer.batchDraw();
      surface.data.shapeComponents[shapeComponent.oid] = shapeComponent;
    }

    addShape(type, rect, ctx, oid, seq)
    {
      let surface = this;
      let clazz = zn.findClass(surface.shapeClasses[type]);
      if (clazz == null)
      {
        console.error(`class ${surface.shapeClasses[type]} not found for shape type ${type}`);
        return;
      }

      let x = rect.x;
      let y = rect.y;
      let w = rect.width;
      let h = rect.height;
      
      let shapeComponent = new clazz(x, y, w, h, ctx, oid);
      //base.snap(shapeComponent.$shape);
      shapeComponent.seq=seq || ++surface.seq;
      if(!oid) surface.fireEvent("obj-create", {obj: {...shapeComponent.ctx, oid: shapeComponent.oid}});
      surface.addShapeComponent(shapeComponent);

      return shapeComponent.oid;
    }

    deleteShape(id, redraw)
    {
      let surface = this;
      if (!surface.data.shapeComponents[id]) return;
      let shapeComponent = surface.data.shapeComponents[id];
      let shapeConnections = shapeComponent.connectorLines();

      shapeComponent.destroy();
      delete surface.data.shapeComponents[id];
      if (redraw !== "N") surface.shapesLayer.batchDraw();

      surface.deleteConnections(shapeConnections);
    }
    
    deleteShapes(ids)
    {
      let surface = this;
      ids.forEach((id) => surface.deleteShape(id, "N"));
      surface.shapesLayer.batchDraw();
    }

    addConnectionComponent(connectorLineComponent)
    {
      let surface = this;
      surface.connectorsLayer.add(connectorLineComponent.$shape);
      surface.connectorsLayer.batchDraw();
      surface.data.lineComponents[connectorLineComponent.oid] = connectorLineComponent;
    }

    addConnection(from, to, oid, cctx, seq)
    {
      let surface = this;
      let fromCpData = surface.cpData(from);
      let toCpData = surface.cpData(to);

      let ctx = {
        name: `${fromCpData.name}-${toCpData.name}`,
        from: fromCpData.cp.ctx,
        to: toCpData.cp.ctx,
        ctx: cctx || {}
      };

      let connectorLine = new zn.designer.shape.ConnectorLine(fromCpData.cp.$shape, toCpData.cp.$shape, ctx, oid);
      connectorLine.seq=seq || ++surface.seq;
      surface.addConnectionComponent(connectorLine);

      return connectorLine.oid;
    }

    getShapeConnections(shapeOids)
    {
      let surface = this;
      let connections = [];
      shapeOids.forEach((shapeOid) =>
      {
        let shapeComponent = surface.data.shapeComponents[shapeOid];
        let connectIds = shapeComponent.connectorLines();
        connectIds.forEach((coid) =>connections.push({...surface.data.lineComponents[coid].ctx, oid: coid}));
      });

      return connections;
    }

    deleteConnection(id, redraw)
    {
      let surface = this;
      if (!surface.data.lineComponents[id]) return;

      let lineComponent = surface.data.lineComponents[id];
      lineComponent.destroy();
      delete surface.data.lineComponents[id];
      if (redraw !== "N") surface.connectorsLayer.batchDraw();
    }

    deleteConnections(ids)
    {
      let surface = this;
      ids.forEach((id) => surface.deleteConnection(id, "N"));
      surface.connectorsLayer.batchDraw();
    }

    setMode(mode)
    {
      let surface = this;
      surface.mode = mode;
    }

    setSize(w, h)
    {
      let surface=this;
      surface.$stage.css("width", w).css("height", h);
      surface.stage.width(w);
      surface.stage.height(h);
      surface.gridLayer.setSize(w, h);
    }

    getShapeComponent(oid) {return this.data.shapeComponents[oid]};
    getConnectionComponent(oid) {return this.data.lineComponents[oid]};
    getSelection()
    {
      let surface=this;
      let oids=[];
      
      surface.shapesLayer.find(".selected").each((shape)=>
      {
        if(!shape.hasName("transform")) oids.push(shape.getAttr("zn-oid"));
      });
      return oids;
    }

    cpData(ctx)
    {
      let surface = this;
      let parent = ctx.parent;
      let map = surface.data.shapeComponents;

      let obj = map[parent.oid];
      if (parent.type == "list-item") obj = map[parent.list].nodes[parent.index];
      if (parent.type == "list-header") obj = map[parent.list].headerNode;

      let cp = obj.connectorPoints[ctx.name];
      return { cp: cp, name: `${parent.list ? '/' + parent.list : ''}/${parent.name}/${ctx.name}` };
    }

    shapeComponentData(shapeComponent)
    {
      let data=
      {
        type: shapeComponent.$type, 
        rect: shapeComponent.getRect(), 
        ctx: shapeComponent.ctx, 
        oid: shapeComponent.oid,
        seq: shapeComponent.seq,
      };
      
      return data;
    }

    lineComponentData(lineComponent)
    {
      let data=
      {
        ...lineComponent.ctx,
        oid: lineComponent.oid,
        seq: lineComponent.seq,
      };

      return data;
    }

    exportData()
    {
      let component = this;
      let jsonData = { shapes: [], lines: [], stage: {}, seq: component.seq};

      Object.values(component.data.shapeComponents)
            .forEach((shapeComponent) => jsonData.shapes.push(component.shapeComponentData(shapeComponent)));

      Object.values(component.data.lineComponents)
            .forEach((lineComponent) => jsonData.lines.push(component.lineComponentData(lineComponent)));

      jsonData.stage={width: component.stage.width(), height: component.stage.height(), lanes: component.options.lanes, lanesPos: component.options.lanesPosition};
      
      return JSON.parse(JSON.stringify(jsonData));
    }

    importData(jsonData)
    {
      let surface = this;
      surface.reset();

      if(jsonData.shapes) jsonData.shapes.forEach((shapeData) => 
      {
        surface.addShape(shapeData.type, shapeData.rect, shapeData.ctx, shapeData.oid, shapeData.seq)
      });
      if(jsonData.lines) jsonData.lines.forEach((lineData) => 
      {
        surface.addConnection(lineData.from, lineData.to, lineData.oid, lineData.ctx, lineData.seq)
      });
      if(jsonData.stage)
      {
        surface.options.lanes=jsonData.stage.lanes;
        surface.options.lanesPosition=jsonData.stage.lanesPos;
        surface.setSize(jsonData.stage.width, jsonData.stage.height);
      }
      surface.seq=jsonData.seq || 0;
    }

    exportToJson()
    {
      return JSON.stringify(this.exportData());
    }

    importFromJson(jsonDataStr)
    {
      return this.importData(JSON.parse(jsonDataStr));
    }

    downloadAsImage()
    {
      let surface = this;
      surface.gridLayer.gridLinesGroup.visible(false);
      surface.gridLayer.boundingBox.visible(true);
      let dataURL = surface.stage.toDataURL({ pixelRatio: 1 });
      surface.gridLayer.boundingBox.visible(false);
      surface.gridLayer.gridLinesGroup.visible(true);
      var downloadLink = document.createElement('a');
      downloadLink.download = "surface-drawing.png";
      downloadLink.href = dataURL;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
    }

    getImageData()
    {
      let surface = this;
      surface.gridLayer.gridLinesGroup.visible(false);
      surface.gridLayer.boundingBox.visible(true);
      let dataURL = surface.stage.toDataURL({ pixelRatio: 1 });
      surface.gridLayer.boundingBox.visible(false);
      surface.gridLayer.gridLinesGroup.visible(true);

      return dataURL;
    }

    getConnectedShapeIds(fromShapeOid)
    {
      let surface=this;
      return Object.values(surface.data.lineComponents).filter((line)=>line.ctx.from.parent.oid==fromShapeOid).map((line)=>line.ctx.to.parent.oid);
    }

    static get(name)
    {
      return $(`[zn-surface='${name}']`).get()[0].znc;
    }
    
    static html()
    {
      return `<div class="zn-surface-stage" tabindex="1"></div>`;
    }
    
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name] = Surface;

})(window);

