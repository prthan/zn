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
    "rect.header.fill": "#7ecff5",

    "ellipse.fill": "#C5E1A5",
    "ellipse.stroke": "#8bc34a33",

    "diamond.fill": "#ffcc80",
    "diamond.stroke": "#ff980033",

    "pill.fill": "#C5CAE9",
    "pill.stroke": "#3949ab1c",

    "text.family": "monospace",
    "text.size": 12,
    "text.padding": 10,
    //"text.color": "#376d8a",
    "text.color": "#0f2c3d",
    "text.style": "normal",
    "text.lineheight": 1.5,
    //"text.stroke": "Y",

    "subtext.family": "monospace",
    "subtext.size": 12,
    //"subtext.color": "#376d8a",
    "subtext.color": "#0f2c3d",
    "subtext.style": "normal",
    "subtext.lineheight": 1.5,

    "node.level.offset": 10,
    "node.height": 25,
    "node.mark.color": "#1c4155",

    "list.header.fill": "#7ecff5",
    
    "hitregion.fill": "rgba(255,0,0,0)",

    "grid.show": true,
    //"grid.fill": "#f9f9f9",
    //"grid.minorTick.stroke": "#efefef",
    //"grid.majorTick.stroke": "#dfdfdf",
    "grid.fill": "#ffffff",
    "grid.minorTick.stroke": "#f3f3f3",
    "grid.majorTick.stroke": "#e9e9e9",
    "grid.minorTick.size": 10,
    "grid.majorTick.size": 100,
    "grid.snap.size": 5,

    "lanes.show": true,
    "lane.header.fill": "#c5e1a5",
    "lane.header.stroke": "#8bc34a5c",
    "lane.separator.stroke": "#cccccc",
    "lane.header.size": 25,

    "text-area.stroke": "#7986cb",
    "text-area.marker.size": 3,

    "callout.fill": "#C5E1A5",
    "callout.stroke": "#8bc34a33",

    "wedge-rect.fill": "#C5CAE9",
    "wedge-rect.stroke": "#3949ab1c",
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

/*
rounded-rect
M 5 0 l 20 0 a 5 5 0 0 1 5 5 l 0 10 a 5 5 0 0 1 -5 5 l -20 0 a 5 5 0 0 1 -5 -5 l 0 -10 a 5 5 0 0 1 5 -5

*/