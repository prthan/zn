(function(window)
{
  let Component={}

  Component.findClass=(name)=>
  {
    let obj=window;
    name.split(".").forEach((part)=>
    {
      if(obj) obj=obj[part];
    });
    return obj;
  }

  Component.shortid=()=>
  {
    let rval=[];
    let a=Array.from(Math.random().toString(36).substr(2));
    let b=Array.from(new Date().getTime().toString(36));
    a.forEach((x,i)=>
    {
      rval.push(x);
      if(i<b.length)
      {
        rval.push(b.shift());
      }
    });
    if(b.length!=0) rval=rval.concat(b);
    return rval.join("");
  }

  window.zn=Component;
  
})(window);

