(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "Base";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;

  let Component={};

  Component.handleShapeDragEnd=(shapeComponent)=>
  {
    let shape=shapeComponent.$shape;
    if(!shape.hasName("selected")) Component.snap(shape);
    Component.fireConnectorPointUpdateEvent(shape);
    
    if(shape.hasName("selected")) shape.getStage().fire("shape-rect-update", {source: shapeComponent});
  }

  Component.handleShapeDragMove=(shapeComponent, event)=>
  {
    let shape=shapeComponent.$shape;
    Component.fireConnectorPointUpdateEvent(shape);

    if(shape.hasName("selected")) Component.moveOtherSelectedObjects(shape.getLayer(), shape, event);
    shape.getStage().fire("shape-rect-update", {source: shapeComponent});
  }

  Component.handleShapeMouseDown=(shapeComponent)=>
  {
    let shape=shapeComponent.$shape;
    let layer=shape.getLayer();

    if(!shape.hasName("selected")) Component.resetSelection(layer);
  }

  Component.handleShapeHover=(shapeComponent)=>
  {
    let shape=shapeComponent.$shape;
    let layer=shape.getLayer();

    Component.resetConnectors(layer);
    if(!shape.hasName("transform"))
    {
      shape.addName("hover");
      Component.showConnectors(shape, true);
    }
  }

  Component.handleShapeClick=(shapeComponent)=>
  {
    let shape=shapeComponent.$shape;
    let layer=shape.getLayer();

    if(shape.hasName("transform")) return;
    if(shape.hasName("selected"))
    {
      if(props["shape.resize"]===true) Component.handleShapeTransform(shapeComponent);
      return;
    }
    Component.handleShapeSelect(shapeComponent);
  }

  Component.handleShapeSelect=(shapeComponent)=>
  {
    let shape=shapeComponent.$shape;
    let layer=shape.getLayer();

    Component.resetSelection(layer);
    shape.addName("selected");
    Component.showSelection(shape, true);
    shape.getStage().fire("shape-select", {source: shapeComponent});
  }

  Component.handleShapeSelectAdd=(shapeComponent)=>
  {
    let shape=shapeComponent.$shape;
    let layer=shape.getLayer();

    //Component.resetSelection(layer);
    if(shape.hasName("selected"))
    {
      shape.removeName("selected");
      Component.showSelection(shape, false);  
    }
    else
    {
      shape.addName("selected");
      Component.showSelection(shape, true);
    }
    shape.getStage().fire("selection-set-modify", {source: shapeComponent});
  }

  Component.handleShapeTransform=(shapeComponent)=>
  {
    let shape=shapeComponent.$shape;
    let layer=shape.getLayer();

    let selected=layer.find(".selected").toArray();
    if(selected.length>1) return;
    
    Component.showSelection(shape, false);
    Component.showConnectors(shape, false);
    shape.addName("transform");
    shape.draggable(false);
    shape.getStage().fire("shape-transform", {source: shapeComponent});
  }

  Component.getConnetorLines=(shapeComponent)=>
  {
    if(!shapeComponent.connectorPoints) return [];
    let lineIds=Object.values(shapeComponent.connectorPoints).reduce((a,c)=>
    {
      if(c.$shape.$lines) a.push(...c.$shape.$lines);
      return a;
    },[]);

    return lineIds;
  }

  Component.moveOtherSelectedObjects=(layer, shape, event)=>
  {
    layer.find(".selected").each((selected)=>
    {
      if(selected==shape) return;

      let pos=selected.getPosition();
      pos.x+=event.evt.movementX;
      pos.y+=event.evt.movementY;
      selected.setPosition(pos);
      Component.fireConnectorPointUpdateEvent(selected);
    });    
    layer.batchDraw();
  }

  Component.snapOtherSelectedObjects=(layer, shape)=>
  {
    layer.find(".selected").each((selected)=>
    {
      if(selected==shape) return;
      Component.snap(selected);
      Component.fireConnectorPointUpdateEvent(selected);
    });
    layer.batchDraw();
  }

  Component.showConnectors=(shape, state)=>
  {
    shape.find(".connector").each((connector)=>connector.visible(state));
    shape.getLayer().batchDraw();
  }

  Component.resetConnectors=(layer)=>
  {
    let currentHover=layer.findOne(".hover");
    if(currentHover!=null)
    {
      Component.showConnectors(currentHover, false);
      currentHover.removeName("hover");
    }
  }

  Component.showSelection=(shape, state)=>
  {
    shape.find(".selection").each((area)=>area.visible(state));
    shape.getLayer().batchDraw();
  }

  Component.resetSelection=(layer)=>
  {
    layer.find(".selected").each((selected)=>
    {
      Component.showSelection(selected, false);
      selected.removeName("selected");
    })
  }
  
  Component.resetConnectorLineSelection=(layer)=>
  {
    layer.find(".selected").each((selected)=>
    {
      selected.removeName("selected");
      selected.find(".line-segment").each((segment)=>segment.stroke(props["connector.line.stroke"]));
    });    
    layer.batchDraw();
  }
  
  Component.resetTransform=(shapeComponent)=>
  {
    let shape=shapeComponent.$shape;

    shape.removeName("transform");
    shape.draggable(true);

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
    let clientRect=connector.getClientRect();
    return {x: clientRect.x + clientRect.width/2, y: clientRect.y + clientRect.height/2};
  }

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

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

