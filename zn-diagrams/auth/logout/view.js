(function(window)
{
  let __package = "diagrams.auth.view";
  let __name = "Logout";

  class View extends zn.Base
  {
    constructor(options)
    {
      super(options);
    }

    init() {}
    
    setupUI()
    {
      let view=this;
    }

    setupEventHandlers()
    {
      let view=this;
    }

  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = View;

})(window);

