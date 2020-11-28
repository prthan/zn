(function(window)
{
  let __package = "zn";
  let __name = "Routes";

  class Routes
  {
    constructor(options)
    {
      this.options = options;
      this.eventHandlers = {};
      this.init();
    }

    init()
    {
      let routes=this;
      Object.keys(routes.options).forEach((routeUrl)=>
      {
        routes.options[routeUrl]={url: routeUrl, ...routes.options[routeUrl], ...routes.parseRouteUrl(routeUrl)};
        if(routes.options[routeUrl].default) routes.default=routeUrl;
      })
      routes.setupEventHandlers();
    }

    on(eventName, eventHandler)
    {
      let module = this;
      (module.eventHandlers[eventName] = module.eventHandlers[eventName] || []).push(eventHandler);
    }
    
    fireEvent(eventName, event)
    {
      let module = this;
      let evt = event || {};
      evt.source = module;
      (module.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }

    parseRouteUrl(routeUrl)
    {
      let matcher={rex: null, params: []};
      let parts=routeUrl.split("/");
      let pattern=parts.reduce((a, c)=>
      {
        if(c=="") return a;
        if(["@", ":"].includes(c.substring(0,1)))
        {
          a+="(/[^/]+|.{0,0})";
          matcher.params.push(c.substring(1));
        }
        else if(c=="*")
        {
          a+="(/.+)";
          matcher.params.push("*");
        }
        else a+="/"+c;
        return a;
      }, "");
      matcher.rex=new RegExp("("+pattern+")$");
      
      return matcher;
    };
    
    lookupRouteUrl(routeUrl)
    {
      let routes=this;
      let rval=null;
      for(let routeDefn of Object.values(routes.options))
      {
        let matches=routeDefn.rex.exec(routeUrl);
        if(!matches) continue;
  
        var paramValues=routeDefn.params.reduce((a, c, i)=>
        {
          a[c]=unescape(matches[i+2].substring(1));
          return a;
        }, {});
        rval={paramValues: paramValues, ...routeDefn};
        break;
      }
      return rval;
    }

    go(route)
    {
      let routes=this;
      if(route) window.location.hash=`#!${route}`;
      else if(window.location.hash) routes.handleRoute();
      else
      {
        console.info("[zn]", "redirecting to default route");
        window.location.hash=`#!${routes.default}`;
      }
    }

    setupEventHandlers()
    {
      let routes=this;
      $(window).on("hashchange", (evt)=> routes.handleRoute());
    }

    handleRoute()
    {
      let routes=this;
      let routeUrl=window.location.hash.substring(2);
      if(routeUrl==null || routeUrl=="") return;
      
      console.info("[zn]", `serving route ${routeUrl}`)
      let route=routes.lookupRouteUrl(routeUrl);
      if(route==null)
      {
        console.error("[zn]", `invalid route ${routeUrl}`);
        return;
      }

      routes.fireEvent("load", {route: route});
    }
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = Routes;

})(window);

