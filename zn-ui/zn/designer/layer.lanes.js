(function(window)
{
  let __package  = "zn.designer.layer";
  let __name     = "Lanes";

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

      let layer = component.$layer = new Konva.Layer({ name: "lanes-layer" });
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
      
      let numLanes=component.options.lanes.length;
      let laneSize=w/numLanes;
      let d=component.options.lanesPosition == "left" ? 0 : 1;
      
      component.options.lanes.forEach((laneText, i)=>
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
          height: props["lane.header.size"],
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
    }

    setupEventHandlers()
    {
    }
  }

  

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

