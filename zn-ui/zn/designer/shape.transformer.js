(function(window)
{
  let __package  = "zn.designer.shape";
  let __name     = "Transformer";

  let props=zn.designer.Properties;
  let base=zn.designer.shape.Base;

  class Component
  {
    constructor(layer, target)
    {
      let component = this;
      component.$class = `${__package}.${__name}`;

      component.target = target;

      component.$shape = new Konva.Rect({
        fill: props["shape.transformer.fill"],
        strokeWidth: 0,
        cornerRadius: 5,
        draggable: true
      });
      component.$shape.addName("rectangle");
      component.targetToTransformer();
      layer.add(component.$shape);

      component.transformer = new Konva.Transformer({
        rotateEnabled: false,
        anchorStroke: props["shape.transformer.stroke"],
        anchorFill: props["shape.transformer.stroke"],
        anchorSize: 4,
        borderStroke: props["shape.transformer.stroke"],
        borderDash: [4, 4],
        strokeWidth: 2,
      });
      layer.add(component.transformer);
      component.transformer.nodes([component.$shape]);

      component.target.$shape.addName("transform");
      component.target.$shape.draggable(false);
      component.setupEventHandlers();
    }

    setupEventHandlers()
    {
      let component = this;
      let rect = component.$shape;

      component.transformer.on("transformstart", (evt) =>
      {
        component.transformerToTarget();
      });

      component.transformer.on("transform", (evt) =>
      {
        component.transformerToTarget(true);
        component.target.$shape.getStage().fire("shape-rect-update", {source: component.target});
        component.target.$shape.getLayer().batchDraw();
      });

      component.transformer.on("transformend", (evt) =>
      {
        component.transformerToTarget(true);
        component.target.$shape.getStage().fire("shape-rect-update", {source: component.target});
        component.$shape.getLayer().batchDraw();
      });

      component.$shape.on("dragstart", (evt) =>
      {
        component.transformerToTarget();
      });

      component.$shape.on("dragmove", (evt) =>
      {
        component.transformerToTarget();
        component.target.$shape.getStage().fire("shape-rect-update", {source: component.target});
        component.target.$shape.getLayer().batchDraw();
      });

      component.$shape.on("dragend", (evt) =>
      {
        component.transformerToTarget();
        base.snap(component.target.$shape);
        component.targetToTransformer();
        base.fireConnectorPointUpdateEvent(component.target.$shape);
        component.target.$shape.getStage().fire("shape-rect-update", {source: component.target});
        component.$shape.getLayer().batchDraw();
        component.target.$shape.getLayer().batchDraw();
      });
    }

    targetToTransformer()
    {
      let component = this;
      let pos = component.target.$shape.position();
      let size = component.target.$shape.size();

      let offset = props["shape.transformer.offset"] + 0.5;
      component.$shape.position({ x: pos.x - offset, y: pos.y - offset });
      component.$shape.scale({ x: 1, y: 1 });
      component.$shape.size({ width: size.width + offset * 2, height: size.height + offset * 2 });
    }

    transformerToTarget(updateShapeSize)
    {
      let component = this;
      let pos = component.$shape.position();
      let size = component.transformer.size();

      let offset = props["shape.transformer.offset"] + 0.5;
      component.target.$shape.position({ x: pos.x + offset, y: pos.y + offset });
      if (updateShapeSize)
      {
        component.target.$shape.size({ width: size.width - offset * 2, height: size.height - offset * 2 });
        component.target.updateShape(size.width - offset * 2, size.height - offset * 2);
      };
      base.fireConnectorPointUpdateEvent(component.target.$shape);
    }

    destroy()
    {
      let component = this;

      base.resetTransform(component.target);
      let layer = component.$shape.getLayer();
      component.$shape.destroy();
      component.transformer.destroy();
      layer.batchDraw();
    }
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

