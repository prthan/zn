(function(window)
{
  let __package = "zn";
  let __name = "utils";
  
  let utils=
  {
  }
  
  
  utils.findMethod=function(fullname)
  {
    if(!fullname) return null;
    
    let parts = fullname.split(".");
    let obj = window;
    for(let i=0, l=parts.length; i<l && obj!=null; i++)
    {
      obj = obj[parts[i]];
    }

    return obj;
  };
  
  utils.fn=function(p1, p2) 
  {
    let scope=null;
    let fn=null;
    let s=1;
    if(typeof(p1)=="object")
    {
      scope=p1;
      fn=p2;
      s=2;
    }
    if(typeof(p1)=="function") fn=p1;

    let args = [];
    for (let i=s, l = arguments.length; i < l; ++i) args.push(arguments[i]);
    return ()=>{fn.apply(scope, args)};
  };
  
  utils.getLocalTemplate=function(src)
  {
    let content=null;
    $("template").each((i,e)=>
    {
      let $e=$(e);
      let template=$e.attr("template");
      if(src.endsWith(template)) content=$e.html();
    });

    return content;
  }

  utils.fetchTemplateContent=(src)=>
  {
    let impl=($res, $rej)=>
    {
      console.info("[zn]", `fetching template => ${src}`);
      let content=utils.getLocalTemplate(src);
      let err=null;
      if(content!=null) 
      {
        $res(content);
        return;
      }
  
      $.ajax({
        async: true,
        type: "GET",
        url: src,
        success: (res)=>content=res,
        error : (jqxhr,text,error)=>{err=error},
        complete: (xhr,status)=>
        {
          if(err) $rej(err);
          else $res(content);
        }
      });
    }

    return new Promise(impl);
  };

  utils.loadTemplates=()=>
  {
    let impl=async($res, $rej)=>
    {
      let elements=$("*[zn-template]").get();
      while(elements.length>0)
      {
        for(let e of elements)
        {
          let $e=$(e);
          let src=$e.attr("zn-template");
          let content=await utils.fetchTemplateContent(src);
          $e.html(content);
          $e.removeAttr("zn-template");
        }
        elements=$("*[zn-template]").get();
      }
      $res();
    }

    return new Promise(impl);
  };

  utils.debounce=(fn, delay)=>
  {
    let timerId=-1;
    let scope=this;
    let dfn=function()
    {
      let args=arguments;
      if(timerId!=-1) window.clearTimeout(timerId);
      timerId=window.setTimeout(()=>fn.apply(scope, args), delay);
    }

    return dfn;
  }

  utils.slug=(x)=>
  {
    return x.replace(/[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]+/g,'').replace(/_+/g,'-').replace(/\s+/g,'-').replace(/-+/g,"-").toLocaleLowerCase();
  };

  utils.copyObj=(obj)=>
  {
    let str=JSON.stringify(obj);
    let newObj=JSON.parse(str);
    utils.sanitize(newObj);
    return newObj;
  }

  utils.sanitize=(obj)=>
  {
    if(obj instanceof Array) obj.forEach(o=>utils.sanitize(o));
    else if(typeof(obj)=='object')
    {
      if(obj["$$hashKey"]) delete obj["$$hashKey"];
      Object.keys(obj).forEach(k=>(obj[k] instanceof Array || typeof(obj)=='object') && utils.sanitize(obj[k]));
    }
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = utils;  

})(window);
