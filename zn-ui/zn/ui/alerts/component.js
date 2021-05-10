(function(window)
{
  let __package = "zn.ui";
  let __name = "alerts";

  class Alerts
  {
    static Toast(msg, icon, type)
    {
      let $toasts=$(".zn-toasts");
      if($toasts.get().length==0)
      {
        $("body").append(`<div class="zn-toasts"></div>`);
        $toasts=$(".zn-toasts");
      }
  

      if(type=="error") icon="fas fa-exclamation-circle";
      if(type=="warn") icon="fas fa-exclamation-triangle";

      let iconHTML=`<div class='zn-toast-icon'><i class="${icon || 'fas fa-info-circle'}"></i></div>`;
      let id=zn.shortid();
      $toasts.append(`
      <div data-oid="${id}" class="zn-toast ${type||''}">
        <div class="zn-toast-header">
          ${iconHTML}<div class="zn-toast-header-text">Alert</div>
        </div>
        <div class="zn-toast-content">
          <div class="zn-toast-text">${msg}</div>
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

    static ToastError(msg)
    {
      zn.ui.alerts.Toast(msg, null, 'error');
    }

    static ToastWarning(msg)
    {
      zn.ui.alerts.Toast(msg, null, 'warn');
    }

    static Affirm(msg)
    {
      Alerts.Confirm(msg, "success", [{action: "zn-cancel", label: "Ok"}]);
    }

    static AffirmError(msg)
    {
      Alerts.Confirm(msg, "error", [{action: "zn-cancel", label: "Ok"}]);
    }

    static AffirmWarning(msg)
    {
      Alerts.Confirm(msg, "warn", [{action: "zn-cancel", label: "Ok"}]);
    }

    static ConfirmYesNo(msg, type, $$)
    {
      let impl=(res$, rej$)=>
      {
        Alerts.Confirm(msg, type, [{action: "yes", label: "Yes"}, {action: "no", label: "No"}], (action)=>
        {
          res$(action);
        });
      }
      
      let promise=new Promise(impl);
      if($$)
      {
        promise.then($$);
        return;
      }
      return promise;
    }

    static ConfirmOkCancel(msg, type, $$)
    {
      let impl=(res$, rej$)=>
      {
        Alerts.Confirm(msg, type, [{action: "ok", label: "Ok"}, {action: "cancel", label: "Cancel"}], (action)=>
        {
          res$(action);
        });
      }
      
      let promise=new Promise(impl);
      if($$)
      {
        promise.then($$);
        return;
      }
      return promise;      
    }

    static Confirm(msg, type, actions, $$)
    {
      let options={msg: msg, actions: actions, type: type}
      let impl=(res$, rej$)=>
      {
        let html=Alerts.htmlDialog(options);
      
        $("body").append(html);
        $("body .zn-alert").on("click", ".zn-action", (evt)=>
        {
          evt.preventDefault();
          let $target=$(evt.currentTarget);
          let action=$target.attr("data-action");
          $("body .zn-alert").remove();
          if(action!="zn-cancel") res$(action);
        });
        $("body .zn-alert").css("display", "flex");
      }

      let promise=new Promise(impl);
      if($$)
      {
        promise.then($$);
        return;
      }
      return promise;      
    }

    static htmlDialog(options)
    {
      return `
      <div class="zn-alert centered">
        <div class="zn-alert-wrapper ${options.type}">
          <div class="zn-alert-header">Alert</div>
          <div class="zn-alert-content">
            <div class="zn-alert-icon">
              <div class="zn-alert-icon-img">${Alerts.icons[options.type]}</div>
            </div>
            <div class="zn-alert-msg">${options.msg}</div>
          </div>
          <div class="zn-alert-footer">
            <div class="zn-actions right-actions">
            ${options.actions.reduce((a,c) => a += Alerts.htmlDialogAction(c), "")}
            </div>
          </div>
        </div>
      </div>`;
    }

    static htmlDialogAction(item)
    {
      return `
      <a class="zn-action" data-action="${item.action}">
        ${item.icon ? Alerts.htmlIcon(item.icon) : ''}<span class="text">${item.label || ''}</span>
      </a>`;
    }
  
    static htmlIcon(icon)
    {
      return `<i class="icon ${icon}"></i>`
    }

    static icons=
    {
      "exclamation-1": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
      </svg>`,

      "exclamation-2": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-diamond" viewBox="0 0 16 16">
      <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.482 1.482 0 0 1 0-2.098L6.95.435zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/>
      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
      </svg>`,

      "warn": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-square" viewBox="0 0 16 16">
      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
      </svg>`,

      "error": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>`,

      "success": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
      </svg>`
    }
  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = Alerts;

})(window);

