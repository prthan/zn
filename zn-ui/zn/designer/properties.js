(function(window)
{
  let __package  = "zn.designer";
  let __name     = "Properties";

  let Component=
  {
    //"rect.fill": "#a4d7f3",
    //"rect.stroke": "#9fcce2",
    "rect.fill": "#B3E5FC",
    "rect.stroke": "#039be529",
    "ellipse.fill": "#C5E1A5",
    "ellipse.stroke": "#8bc34a33",
    "diamond.fill": "#ffcc80",
    "diamond.stroke": "#ff980033",
    "pill.fill": "#C5CAE9",
    "pill.stroke": "#3949ab1c",
    "connector.size": 8,
    //"connector.fill": "#9fcce2",
    //"connector.hilight": "#7495a5",
    "connector.stroke": "rgba(0,255,0,0.1)",
    "connector.fill": "#CE93D8",
    "connector.hilight": "#AB47BC",
    "text.family": "Courier",
    "text.size": 11,
    "text.color": "#376d8a",
    "text.style": "normal",
    "text.lineheight": 1.5,
    "hitregion.fill": "rgba(255,0,0,0)"
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

