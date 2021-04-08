(function(window)
{
  let __package = "zn.ui";
  let __name = "Toast";

  let fn=function Toast(msg, icon, type)
  {
    let $toasts=$(".zn-toasts");
    if($toasts.get().length==0)
    {
      $("body").append(`<div class="zn-toasts"></div>`);
      $toasts=$(".zn-toasts");
    }

    let iconHTML=icon ? `<div class='zn-toast-icon'><i class="${icon}"></i></div>` : "";
    let id=zn.shortid();
    $toasts.append(`
    <div data-oid="${id}" class="zn-toast ${type||''}">
      <div class="zn-toast-content">
        ${iconHTML}<div class="zn-toast-text">${msg}</div>
      </div>
    </div>`);
    window.setTimeout(()=>
    {
      let $toasts=$(".zn-toasts");
      let $toast=$(`.zn-toast[data-oid="${id}"]`);
      $toast.remove();
      if($toasts.find(".zn-toast").get().length==0) $toasts.remove();
    }, 4000)
    window.setTimeout(()=>$(`.zn-toast[data-oid="${id}"]`).addClass("hide"), 200);
  }

  fn.Error=(msg)=>zn.ui.Toast(msg, null, 'error');
  fn.Warning=(msg)=>zn.ui.Toast(msg, icon, 'warn');

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = fn;

})(window);

