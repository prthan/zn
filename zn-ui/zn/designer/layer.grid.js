(function(window)
{
  let __package  = "zn.designer.layer";
  let __name     = "Grid";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  class Component
  {
    constructor(stage, options)
    {
      let component = this;
      component.stage = stage;
      component.options=options;

      component.addLayerDetails();
      component.setupEventHandlers();
    }

    addLayerDetails()
    {
      let component = this;
      let stage = component.stage;

      let layer = component.$layer = new Konva.Layer({ name: "grid-layer" });
      stage.add(layer);
      component.layer=layer;

      let w = stage.width();
      let h = stage.height();

      component.updateLayer(w, h);
    }
    
    updateLayer(w, h)
    {
      let component = this;
      let layer = component.layer;
      layer.destroyChildren();

      let background = new Konva.Rect({
        x: 0,
        y: 0,
        width: w,
        height: h,
        fill: props["grid.fill"]
      });
      background.addName("grid");

      layer.add(background);
      component.background = background;

      if (props["grid.show"]) component.addGridLines(w, h);
      if (props["lanes.show"]) component.addLanes(w, h);
      
      let boundingBox= new Konva.Rect({
        x: 0,
        y: 0,
        width: w,
        height: h,
        visible: false,
        stroke: props["grid.majorTick.stroke"]
      });
      layer.add(boundingBox);
      component.boundingBox=boundingBox;
      
    }

    addGridLines(w, h)
    {
      let component=this;
      let layer = component.layer;
      let gridLinesGroup = new Konva.Group({ x: 0, y: 0, width: w, height: h, name: "grid-lines-group"});
      layer.add(gridLinesGroup);
      component.gridLinesGroup=gridLinesGroup;

      let majorTickSize=props["grid.majorTick.size"];
      let minorTickSize=props["grid.minorTick.size"];

      utils.addGridLines(gridLinesGroup, minorTickSize, w, h, minorTickSize, props["grid.minorTick.stroke"], 0);
      utils.addGridLines(gridLinesGroup, minorTickSize, h, w, minorTickSize, props["grid.minorTick.stroke"], 1);
      utils.addGridLines(gridLinesGroup, majorTickSize, w, h, majorTickSize, props["grid.majorTick.stroke"], 0);
      utils.addGridLines(gridLinesGroup, majorTickSize, h, w, majorTickSize, props["grid.majorTick.stroke"], 1);
    }

    addLanes(w, h)
    {
      let component=this;
      let layer = component.layer;

      if(!component.options.lanes || component.options.lanes=="") return;
      let lanes=component.options.lanes.split("|");

      let d=component.options.lanesPosition == "left" ? 0 : 1;
      let numLanes=lanes.length;
      let laneSize=(w * d + h * (1-d))/numLanes;
      
      lanes.forEach((laneText, i)=>
      {
        let header = new Konva.Rect({
          x: i * laneSize * d,
          y: i * laneSize * (1-d),
          width: laneSize * d + props["lane.header.size"] * (1-d),
          height: laneSize * (1-d) + props["lane.header.size"] * d,
          fill: props["lane.header.fill"],
          stroke: props["lane.header.stroke"],
          listening: false
        });
        header.addName("lane-header");
        layer.add(header);

        let text = new Konva.Text({
          x: i * laneSize * d, 
          y: (laneSize + i * laneSize) * (1-d),
          width: laneSize, 
          height: props["lane.header.size"]+3,
          text: laneText,
          align: "center",
          verticalAlign: "middle",
          strokeWidth: 1,
          fontFamily: props["text.family"],
          fontSize: props["text.size"],
          fontStyle: props["text.style"],
          lineHeight: props["text.lineheight"],
          shadowForStrokeEnabled: false,
          listening: false,
          rotation: -90 * (1-d)
        });
        if(props["text.stroke"]) text.stroke(props["text.color"])
        else text.fill(props["text.color"]);
        text.addName("text");
        layer.add(text);

        if(i>0)
        {
          var laneSeparator=new Konva.Line({
            points: [i * laneSize * d, i * laneSize * (1-d), i * laneSize * d + w * (1-d), h * d + i * laneSize * (1-d)],
            strokeWidth: 1,
            stroke: props["lane.separator.stroke"],
            listening: false
          })
          layer.add(laneSeparator);
        }
      })      
    }

    setSize(w, h)
    {
      let component=this;
      component.updateLayer(w, h);
      component.layer.batchDraw();
      component.setupEventHandlers();
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

