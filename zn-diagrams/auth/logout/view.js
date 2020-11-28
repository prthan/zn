(function(window)
{
  let __package = "diagrams.auth.view";
  let __name = "Logout";

  class View
  {
    constructor(options)
    {
      this.options = options;
      this.eventHandlers = {};
    }

    init() {}
    
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

  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = View;

})(window);

