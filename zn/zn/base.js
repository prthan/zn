(function(window)
{
  let __package = "zn";
  let __name = "Base";

  class Base
  {
    constructor(options)
    {
      this.options = options;
      this.eventHandlers = {};
    }

    init() {}
    destroy() {}

    on(eventName, eventHandler)
    {
      let module = this;
      let parts=eventName.split(".");
      let ename=parts.shift();
      let handlerId=parts.join(".") || zn.shortid();
      (module.eventHandlers[ename] = module.eventHandlers[ename] || {})[handlerId]=eventHandler;
      
      return handlerId;
    }
    
    off(eventName)
    {
      let module=this;
      let parts=eventName.split(".");
      let ename=parts.shift();
      let handlerId=parts.join(".");

      let handlers=module.eventHandlers[ename];
      if(handlers[handlerId]) delete handlers[handlerId];
    }

    fireEvent(eventName, event)
    {
      let module = this;
      let evt = event || {};
      evt.source = module;
      Object.values((module.eventHandlers[eventName] || {})).forEach((eh) => eh(evt));
    }

  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = Base;

})(window);

