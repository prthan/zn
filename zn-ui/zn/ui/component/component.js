(function(window)
{
  let __package = "zn.ui.components";
  let __name = "Component";

  class Component extends zn.Base
  {
    constructor(options)
    {
      this.options = options;
      this.eventHandlers = {};
    }

    init() {}
    setValue(v) { this.value = value; }
    getValue() { return this.value; }
    setupUI() {}
    setupEventHandlers() {}
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = Component;

})(window);

