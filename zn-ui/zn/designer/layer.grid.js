(function(window)
{
  let __package  = "zn.designer.layer";
  let __name     = "Grid";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  class Component
  {
    constructor(stage)
    {
      let component = this;
      component.stage = stage;

      component.addLayerDetails();
      component.setupEventHandlers();
    }

    addLayerDetails()
    {
      let component = this;
      let stage = component.stage;

      let layer = component.$layer = new Konva.Layer({ name: "grid-layer" });
      stage.add(layer);

      let w = stage.width();
      let h = stage.height();

      let background = new Konva.Rect({
        x: 0,
        y: 0,
        width: w,
        height: h,
        fill: props["grid.fill"]
      });
      background.addName("grid");

      layer.add(background);

      if (props["grid.show"])
      {
        let majorTickSize=props["grid.majorTick.size"];
        let minorTickSize=props["grid.minorTick.size"];

        utils.addGridLines(layer, minorTickSize, w, h, minorTickSize, props["grid.minorTick.stroke"], 0);
        utils.addGridLines(layer, minorTickSize, h, w, minorTickSize, props["grid.minorTick.stroke"], 1);
        utils.addGridLines(layer, majorTickSize, w, h, majorTickSize, props["grid.majorTick.stroke"], 0);
        utils.addGridLines(layer, majorTickSize, h, w, majorTickSize, props["grid.majorTick.stroke"], 1);
      }
      component.background = background;
    }
    
    setupEventHandlers()
    {
      let component = this;
      let stage = component.stage;

      component.background.on("mouseenter", () => base.resetConnectors(stage.findOne(".shapes-layer")));
      component.background.on("mousedown", (event) => 
      {
        component.mouseDownAt=event;
        stage.fire("grid-select", { mouseEvent: event });
      });
      component.background.on("mouseup", (event) =>
      {
        if(component.mouseDownAt && 
           component.mouseDownAt.evt.layerX==event.evt.layerX && 
           component.mouseDownAt.evt.layerY==event.evt.layerY) 
          stage.fire("grid-click", { mouseEvent: event });
      });
    }
  }

  

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

