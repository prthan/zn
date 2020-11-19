(function(window)
{
  let __package  = "zn.designer";
  let __name     = "Properties";

  let Component=
  {
    //"rect.fill": "#a4d7f3",
    //"rect.stroke": "#9fcce2",
    "shape.resize": true,
    "shape.select.stroke": "#CE93D8",
    "shape.select.fill": "rgba(206,147,216,0.2)",
    "shape.select.stroke.size": 2,
    "shape.select.offset": 5,
    "shape.transformer.stroke": "#6a9cb8",
    "shape.transformer.fill": "#039be529",
    "shape.transformer.offset": 5,

    "connector.size": 8,
    "connector.stroke": "rgba(0,255,0,0.1)",
    "connector.fill": "#CE93D8",
    "connector.hilight": "#AB47BC",
    
    "connector.line.stroke": "#CE93D8",
    "connector.line.hilight": "#ba68c8",
    "connector.line.select": "#8e24aa",

    "rect.fill": "#B3E5FC",
    "rect.stroke": "#039be529",

    "ellipse.fill": "#C5E1A5",
    "ellipse.stroke": "#8bc34a33",

    "diamond.fill": "#ffcc80",
    "diamond.stroke": "#ff980033",

    "pill.fill": "#C5CAE9",
    "pill.stroke": "#3949ab1c",

    "text.family": "Courier",
    "text.size": 12,
    "text.color": "#376d8a",
    "text.style": "normal",
    "text.lineheight": 1.5,

    "node.level.offset": 10,
    "node.height": 25,
    "node.mark.color": "#1c4155",

    "list.header.fill": "#7ecff5",
    
    "hitregion.fill": "rgba(255,0,0,0)",

    "grid.show": true,
    "grid.fill": "#f9f9f9",
    "grid.minorTick.stroke": "#efefef",
    "grid.majorTick.stroke": "#dfdfdf",
    "grid.minorTick.size": 10,
    "grid.majorTick.size": 100,
    "grid.snap.size": 5,


  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

