(function(window)
{
  let __package = "diagrams.auth.view";
  let __name = "Welcome";

  class View extends zn.Base
  {
    constructor(options)
    {
      super(options);
      this.module=options.module;
    }

    init()
    {
      let view=this;
      view.setupEventHandlers();
    }
    
    setupUI()
    {
      let view=this;
    }

    setupEventHandlers()
    {
      let view=this;
      view.module.on(`route-change.${view.__oid}`, (evt)=>
      {
        console.log(evt.route);
        view.currentRoute=evt.route.view;
        view.apply();
      });
    }

    destroy()
    {
      let view=this;
      console.info("[welcome]", "unload");
      view.module.off(`route-change.${view.__oid}`);
    }

  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = View;

})(window);

