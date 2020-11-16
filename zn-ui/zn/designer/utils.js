(function(window)
{
  let __package  = "zn.designer";
  let __name     = "Utils";

  let Component={}

  Component.addGridLines=(layer, s, e, l, i, c, d)=>
  {
    s+=0.5;
    while(s<e)
    {
      var line=new Konva.Line({
        points:[s*(1-d),s*d,s*(1-d)+l*d,l*(1-d)+s*d],
        strokeWidth: 1,
        stroke: c,
        listening: false
      })
      layer.add(line);
      s+=i;
    }
  }

  Component.blinePoints=(x1, y1, x2, y2, startDir, endDir)=>
  {
    let dx=x2-x1;
    let dy=y2-y1;
    let points=[x1, y1];

    if(startDir=="top") 
    {
      if(endDir=="left" || endDir=="right") points.push(x1, y2, x1, y2, x2, y2);
      else points.push(x1, y1+dy/2, x2, y1+dy/2, x2, y2);
    }
    else if(startDir=="right")
    {
      if(endDir=="bottom" || endDir=="top") points.push(x2, y1, x2, y1, x2, y2);
      else points.push(x1+dx/2, y1, x1+dx/2, y2, x2, y2);
    }
    else if(startDir=="bottom") 
    {
      if(endDir=="left" || endDir=="right") points.push(x1, y2, x1, y2, x2, y2);
      else points.push(x1, y1+dy/2, x2, y1+dy/2, x2, y2);
    }
    else if(startDir=="left") 
    {
      if(endDir=="bottom" || endDir=="top") points.push(x2, y1, x2, y1, x2, y2);
      else points.push(x1+dx/2, y1, x1+dx/2, y2, x2, y2);
    }
    else
    {
      if(Math.abs(dx) < Math.abs(dy)) points.push(x1+dx/4, y1, x1+dx/4, y2, x2, y2);
      else points.push(x1, y1+dy/4, x2, y1+dy/4, x2, y2);
    }

    return points;
  }

  Component.flattenList=(list, level)=>
  {
    let flatList=[];
    list.forEach((item)=>
    {
      let node=Component.cloneItem(item, ["$list"]);
      node.$level=(level || 0);
      flatList.push(node);
      if(item.$list) flatList.push(...Component.flattenList(item.$list, (level || 0) + 1));
    })
    return flatList;
  }

  Component.cloneItem=(item, ignoreFields)=>
  {
    return Object.keys(item).filter((k)=>!ignoreFields.includes(k)).reduce((a,c)=>
    {
      a[c]=item[c];
      return a;
    },{})
  }

  __package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[__name]=Component;

})(window);

