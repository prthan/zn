(function(window)
{
  let __package  = "zn.designer.layer";
  let __name     = "Grid";

  let props=zn.designer.Properties;
  let utils=zn.designer.Utils;
  let base=zn.designer.shape.Base;

  let Component=function(stage)
  {
    let component=this;
    component.stage=stage;
    
    component.addLayerDetails();
    component.setupEventHandlers();
  }

  Component.prototype.addLayerDetails=function()
  {
    let component=this;
    let stage=component.stage;

    let layer=component.$layer=new Konva.Layer({name: "grid-layer"});
    stage.add(layer);

    let w=stage.width();
    let h=stage.height();
    
    let background=new Konva.Rect({
      x:0,
      y:0,
      width: w,
      height: h,
      fill: props["grid.fill"]
    })
    background.addName("grid");
    
    layer.add(background);

    if(props["grid.show"])
    {
      utils.addGridLines(layer,0,w,h,props["grid.minorTick.size"],props["grid.minorTick.stroke"],0);
      utils.addGridLines(layer,0,h,w,props["grid.minorTick.size"],props["grid.minorTick.stroke"],1);
      utils.addGridLines(layer,0,w,h,props["grid.majorTick.size"],props["grid.majorTick.stroke"],0);
      utils.addGridLines(layer,0,h,w,props["grid.majorTick.size"],props["grid.majorTick.stroke"],1);
    }
    component.background=background;
  }
  
  Component.prototype.setupEventHandlers=function()
  {
    let component=this;
    let stage=component.stage;

    component.background.on("mouseenter", ()=>base.resetConnectors(stage.findOne(".shapes-layer")));
    component.background.on("mousedown", (event)=>{stage.fire("grid-select", {mouseEvent: event})});
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

