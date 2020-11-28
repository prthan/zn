(function(window)
{
  let __package = "zn.ui.components";
  let __name = "List";

  class List
  {
    constructor(options)
    {
      this.options = options;
      this.eventHandlers = {};
    }

    init()
    {
      console.log(this.options);
      let list = this;
      list.$target = $(list.options.target);

      list.$target.addClass("zn-list");
      list.$target.attr("zn-list", list.options.name);
      if (list.options.multiSelect) list.$target.addClass("zn-multi-select");

      list.setupUI();
      list.setupEventHandlers();
      list.$target.get()[0].znc = list;
      list.fireEvent("init");
    }

    on(eventName, eventHandler)
    {
      let list = this;
      (list.eventHandlers[eventName] = list.eventHandlers[eventName] || []).push(eventHandler);
    }

    fireEvent(eventName, event)
    {
      let list = this;
      let evt = event || {};
      evt.source = list;
      evt.name = eventName;
      (list.eventHandlers[eventName] || []).forEach((eh) => eh(evt));
    }

    setupUI()
    {
      let list = this;
      list.$target.html(List.html());
      list.$items = list.$target.find(".zn-list-items");
      list.$listMore = list.$target.find(".zn-list-more");

      if (list.options.items)
        list.setItems(list.options.items);
      list.trackScroll(list.options.trackScroll);
    }

    setupEventHandlers()
    {
      let list = this;

      list.$target.on("mouseenter", ".zn-list-items .zn-list-item", (evt) =>
      {
        let $item = $(evt.currentTarget);
        $item.addClass("hover");
      });

      list.$target.on("mouseleave", ".zn-list-items .zn-list-item", (evt) =>
      {
        let $item = $(evt.currentTarget);
        $item.removeClass("hover");
      });

      list.$target.on("click", ".zn-list-items .zn-list-item .zn-list-item-content", (evt) =>
      {
        list.$target.find(".zn-list-item.selected").removeClass("selected");
        let $item = $(evt.target).closest(".zn-list-item");
        let index = parseInt($item.attr("data-index"));
        let item = list.options.items[index];
        $item.addClass("selected");

        let $checkbox = $item.find(".zn-multi-select .checkbox");
        let checked = $checkbox.attr("data-checked") == "Y" ? "N" : "Y";
        $checkbox.attr("data-checked", checked);

        if (checked == "Y") $item.addClass("checked");
        else $item.removeClass("checked");

        list.fireEvent("select", { source: list, item: item, index: index });
        if (list.options.multiSelect) list.fireEvent("selection-change", { source: list, selection: list.getSelectedItems() });

      });

      list.$target.on("click", ".zn-list-items .zn-list-item .zn-action", (evt) =>
      {
        evt.preventDefault();
        let $action = $(evt.currentTarget);
        let $item = $action.closest(".zn-list-item");
        let index = parseInt($item.attr("data-index"));
        let item = list.options.items[index];
        list.fireEvent("item-action", { source: list, item: item, index: index, action: $action.attr("data-action") });
      });
    }

    setItems(items)
    {
      let list = this;
      list.options.items = items;
      let actionshtml = List.htmlActions(list.options.itemActions || []);
      let itemshtml = list.options.items.reduce((a, c, i) => a + List.htmlItem(c, i, actionshtml), "");
      list.$items.html(itemshtml);
    }

    addItems(items)
    {
      let list = this;
      let l = list.options.items = (list.options.items || []).concat(items);


      let actionshtml = List.htmlActions(list.options.itemActions || []);
      let itemshtml = items.reduce((a, c, i) => a + List.htmlItem(c, i, actionshtml), "");
      list.$items.append(itemshtml);
    }

    setItemActions(itemActions)
    {
      let list = this;
      list.options.itemActions = itemActions;
      list.$items.find(".zn-list-item-actions").html(List.htmlActions(list.options.itemActions || []));
    }
    
    setupScrollTrackingEventHandler()
    {
      let list = this;
      List.trackScrollToEnd(() => list.fireEvent("scroll-end", {}), list.$listMore, 12, list.options.scrollContainer);
    }

    trackScroll(track)
    {
      let list = this;
      list.options.scrollTracking = track;
      if (track)
      {
        list.setupScrollTrackingEventHandler();
        list.$listMore.css("display", "flex");
      }
      else list.$listMore.hide();
    }

    getSelectedItems()
    {
      let list = this;
      let selected = { data: [], indexes: [] };
      list.$target.find(".zn-list-item .checkbox[data-checked='Y']").each((i, e) =>
      {
        let $item = $(e);
        let index = parseInt($item.attr("data-index"));
        selected.data.push(list.options.items[index]);
        selected.indexes.push(index);
      });

      return selected;
    }

    static get(name)
    {
      return $(`[zn-list='${name}']`).get()[0].znc;
    }
  
    static html()
    {
      return `
      <div class="zn-list-items">
      </div>
      <div class="zn-list-more"><div class="zn-loader-moon"></div></div>
      `;
    };
  
    static htmlItem(item, index, actions)
    {
      return `
      <div class="zn-list-item" data-index="${index}">
        ${item.img ? List.htmlImg(item.img) : ''}
        <div class="zn-list-item-content">
          <div class="text">
            <span>${item.text}</span>
            <div class="zn-multi-select">
              <a class='checkbox' data-checked='N'>
                <i class="far fa-check-circle unchecked"></i>
                <i class="fas fa-check-circle checked"></i>
                <!--i class="far fa-square unchecked"></i><i class="fas fa-check-square checked"></i-->
              </a>
            </div>
          </div>
          <div class="subtext">${item.subtext}</div>
        </div>
        <div class="zn-list-item-actions">
          ${actions}
        </div>
      </div>
      `
    }
  
    static htmlIcon(icon)
    {
      return `<i class="icon ${icon}"></i>`;
    }
  
    static htmlImg(img)
    {
      return `<div class="img"><img class="img" src='${img}'/></div>`;
    }
  
    static htmlActions(actions)
    {
      return actions.reduce((a, item)=> a + `
        <a href='#action' class="zn-action" data-action='${item.action}' title='${item.label}'><i class="${item.icon}"></i></a>
      `, "");
    }
  
    static trackScrollToEnd(eh, $marker, threshold, container)
    {
      let $scrollContainer=$(window);
      let containerType="window";
  
      if(container)
      {
        $scrollContainer=$(container);
        containerType="custom";
      }
      
      let ehid=new Date().getTime();
      $scrollContainer.on(`scroll.${ehid}`, (evt)=>
      {
        let containerHeight=$scrollContainer.height();
        let p=$marker.position();
        let containerScrollTop=$scrollContainer.scrollTop();
        let diff=containerHeight + (containerType=="window" ? containerScrollTop : ($scrollContainer.css("position")=="static" ? $scrollContainer.position().top : 0)) - p.top;
        if(diff > threshold) 
        {
          $scrollContainer.off(`scroll.${ehid}`);
          eh();
        }
      });
    }

  }

  __package.split(".").reduce((a, e) => a[e] = a[e] || {}, window)[__name] = List;

})(window);

