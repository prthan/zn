(function(window)
{
  let __package = "diagrams.auth.view";
  let __name = "Welcome";

  class View
  {
    constructor(options)
    {
      this.options = options;
      this.module=options.module;
      this.eventHandlers = {};
    }

    init()
    {
      let view=this;
      view.setupEventHandlers();
    }
    
    on(eventName, eventHandler)
    {
      let view = this;
      (view.eventHandlers[eventName] = view.eventHandlers[eventName] || []).push(eventHandler);
    }
    
    fireEvent(eventName, event)
    {
      let view = this;
      let evt = event || {};
      evt.source = view;
      (view.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }

    setupUI()
    {
      let view=this;
    }

    setupEventHandlers()
    {
      let view=this;
      view.module.on("route-change", (evt)=>
      {
        console.log(evt.route);
        view.currentRoute=evt.route.view;
        view.apply();
      })
    }

  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = View;

})(window);

