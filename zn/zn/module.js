(function(window)
{
  let __package = "zn";
  let __name = "Module";

  class Module extends zn.Base
  {
    constructor(options)
    {
      super(options);
      this.views={}
      this.routeView={}
      this.data=zn.defn.data;
    }

    setupUI()
    {
      let module=this;
      module.$module=$(".zn-module");
      module.$module.attr("zn-module", module.options.defn.name);
    }

    loadModuleLayout()
    {
      let module=this;
      let impl=async($res, $rej)=>
      {
        module.$module.attr("zn-template", module.options.defn.template);
        await zn.utils.loadTemplates();
        $res();
      }

      return new Promise(impl);
    }

    initModule()
    {
      let module=this;
      let impl=async($res, $rej)=>
      {
        let moduleHandlerClass=zn.findClass(module.options.defn.class);
        if(moduleHandlerClass==null)
        {
          $rej(`module class not found ${module.options.defn.class}`);
          return;
        }
        module.moduleHandler=new moduleHandlerClass();
  
        await module.moduleHandler.init();
        $res();
      }
      return new Promise(impl);
    }

    setupView($e, viewName, viewObj)
    {
      let module=this;
      let oid=zn.shortid();
      
      viewObj.__name=viewName;
      viewObj.__oid=oid;

      module.views[viewName]=viewObj;
      if($e.attr("zn-route")=="") module.routeView=viewObj;
      viewObj.on("update", (evt)=>module.notifyOtherViews(evt));

    }

    setupNGModuleForView($e, viewName, viewObj)
    {
      let module=this;
      let mid=viewObj.__oid;
      let ng={mid: mid, moduleName: `${viewName}-ng-module-${mid}`, ctrlName: `${viewName}-ng-ctrl-${mid}`};

      let ngElement=$($e.find(".zn-view-wrapper").get());
      ngElement.addClass("ng-cloak");
      ng.module=angular.module(ng.moduleName, []);
      ng.module.controller(ng.ctrlName, ["$scope", function($scope){}]);
      if(zn.ng && zn.ng.directives) Object.keys(zn.ng.directives).forEach((name)=>ng.module.directive(name, zn.ng.directives[name]));
      angular.bootstrap(ngElement,[ng.moduleName]);
      ng.$scope = angular.element(ngElement).scope();

      ng.$scope.view=new Proxy(viewObj, {});
      ng.$scope.env=module.options.env;
      ng.$scope.module=
      {
        data: zn.defn.data
      };
      ng.$scope.$apply();
      ngElement.css("visibility", "visible");
      viewObj.__ng=ng;
      viewObj.apply=(fn)=>ng.$scope.$apply(fn);
    }

    loadView($e, optns)
    {
      let module=this;
      let impl=async($res, $rej)=>
      {
        if($e.get()[0].znv)
        {
          $res();
          return;
        }

        let viewName=$e.attr("zn-view");
        console.info("[zn]", `loading view => ${viewName}`);

        let viewDefn=zn.defn.views[viewName];
        let viewClassName=viewDefn.class;
        let viewClass=zn.findClass(viewClassName);
        if(viewClass==null)
        {
          $rej(`class ${viewClassName} not found for view ${viewName}`);
          return;
        }

        $e.html(`<div class="zn-view-wrapper"></div>`);
        $e.find(".zn-view-wrapper").attr("zn-template", viewDefn.template);
        await zn.utils.loadTemplates();
        
        let viewObj=new viewClass({module: module, ...(optns||{})});
        $e.get()[0].znv=viewObj;

        module.setupView($e, viewName, viewObj);
        module.setupNGModuleForView($e, viewName, viewObj);
        
        $res(viewObj);
      }

      return new Promise(impl);
    }

    loadViews()
    {
      let module=this;
      let impl=async($res, $rej)=>
      {
        let elements=$("[zn-view]").get();
        let viewObjs=[]
        for(let e of elements)
        {
          let viewObj=await module.loadView($(e));
          if(viewObj!=null) viewObjs.push(viewObj);
        }
        for(let viewObj of viewObjs) 
        {
          if(viewObj.init)
          {
            let promise=viewObj.init();
            if(promise)
            {
              await promise;
              viewObj.__ng.$scope.$apply();
            }
            console.info("[zn]", `view initialized => ${viewObj.__name}`);
          }
        }
        $res();
      }

      return new Promise(impl);
    }

    unloadCurrentView()
    {
      let module=this;
      if(!module.routeView) return;
      if(module.routeView.destroy) module.routeView.destroy();

      delete module.routeView;
    }

    loadViewForRoute(route)
    {
      let module=this;
      
      let impl=async($res, $rej)=>
      {
        module.unloadCurrentView();

        let viewName=route.view;
        let $route=$("[zn-route]");
        $route.attr("zn-view", viewName);
        $route.get()[0].znv=null;
        
        let viewObj=await module.loadView($route, {routeValues: route.paramValues});
        if(viewObj!=null && viewObj.init)
        {
          let promise=viewObj.init();
          if(promise)
          {
            await promise;
            viewObj.__ng.$scope.$apply();
          }
          console.info("[zn]", `view initialized => ${viewObj.__name}`);
          module.fireEvent("route-change", {route: route});
        }
        $res();
      }
      return new Promise(impl);
    }

    initRoutes()
    {
      let module=this;
      module.routes=new zn.Routes(zn.defn.routes);
      module.routes.on("load", (evt)=>module.loadViewForRoute(evt.route).then());
    }

    loadRoute()
    {
      let module=this;
      module.routes.go();
    }

    async load()
    {
      let module=this;
      module.initRoutes();
      module.setupUI();
    
      await module.loadModuleLayout();
      await module.initModule();
      await module.loadViews();
      console.info("[zn]", "module loaded");
      module.loadRoute();
    }
    
    static instance() {return zn.Module.$instance}
    static init() 
    {
      console.info("[zn]","loading environment values");
      zn.env=JSON.parse($("#zn-env").html());
      zn.defn=JSON.parse($("#zn-defn").html());

      console.info("[zn]","loading module");
      let instance=new zn.Module({
        defn: zn.defn,
        env: zn.env
      });
      zn.Module.$instance=instance;
      instance.load();
    }

  }

  $(()=>zn.Module.init());

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = Module;

})(window);

