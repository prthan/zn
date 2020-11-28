(function(window)
{
  let __package = "diagrams.auth.view";
  let __name = "Login";

  class View
  {
    constructor(options)
    {
      this.options = options;
      this.eventHandlers = {};
      this.module=options.module;
      this.routeValues=options.routeValues;

      this.state=null;
    }

    init()
    {
      let view=this;

      view.message="Login to app to starting using the diagrams";
      view.setupUI();
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
    }

    onLogin($event)
    {
      let view=this;
      view.state=(Math.round(Math.random()*10000)%2)==0 ? "Y":"N";
    }
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = View;

})(window);

