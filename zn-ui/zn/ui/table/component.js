(function(window)
{
  var component =
  {
    name: "table",
    package: "zn.ui.components"
  }

  component.create=(options)=>
  {
    let znc=new Table(options);
    //znc.init();
    return znc;
  }

  component.get=(name)=>
  {
    return $(`[zn-table='${name}']`).get()[0].znc;
  }

  let Table=function(options)
  {
    this.options=options;
    this.isEmpty=true;
    this.dataOptions={filters: [], sort: {}, pageSize: options.pageSize};
    this.eventHandlers={};
  }

  Table.prototype.init=function()
  {
    let table=this;
    table.$target=$(table.options.target);
    table.fixedCols=[];
    table.scrollableCols=[];
    table.options.columns.forEach((col, index)=>
    {
      col.index=index+1;
      if(col.fixed===true) table.fixedCols.push(col);
      else table.scrollableCols.push(col);
      
      if(col.filtered===true)
      {
        let filterstate= {index: index, field: col.field};
        if(col.selectedValues && col.selectedValues.length>0)  filterstate.selectedValues=col.selectedValues
        if(col.includeBlanks===true) filterstate.includeBlanks=col.includeBlanks; 
        if(filterstate.selectedValues || filterstate.includeBlanks) table.dataOptions.filters.push(filterstate);
      }

      if(col.sorted===true)
      {
        table.dataOptions.sort= {index: index, field: col.field, order: col.sortOrder};
      }
    });

    table.dataOptions.pageSize=table.options.pageSize;
    table.name=table.options.name;
    table.$target.addClass("zn-table");
    table.$target.attr("zn-table", table.name);
    if(table.options.multiSelect) table.$target.addClass("zn-table-multi-select");
    if(table.options.fill) table.$target.addClass("zn-table-fill");
    if(table.options.containerScroll) table.$target.addClass("zn-table-container-scroll");
    if(table.options.rowActions) table.$target.addClass("zn-table-row-actions");
    if(table.options.actions && table.options.actions.length>0) table.$target.addClass("zn-table-actions");
    if(table.options.paging) table.$target.addClass("zn-table-pagination");

    table.setupUI();
    table.setupEventHandlers();
    if(table.options.rows)
    {
      table.baseRows=JSON.stringify(table.options.rows);
      table.getData("init", table.dataOptions, (rows)=>
      {
        table.setRows(rows);
      })
    }
    table.$target.znc=table;
    table.fireEvent("init");
  }

  Table.prototype.on=function(eventName, eventHandler)
  {
    let table=this;
    (table.eventHandlers[eventName]=table.eventHandlers[eventName] || []).push(eventHandler);
  }

  Table.prototype.fireEvent=function(eventName, event)
  {
    let table=this;
    let evt=event || {};
    evt.source=table;
    (table.eventHandlers[eventName] || []).forEach((eh)=>eh(evt));
  }

  Table.prototype.initRows=function(rows)
  {
    let table=this;
    table.options.rows=rows;
    table.baseRows=JSON.stringify(table.options.rows);
    table.getData("init", table.dataOptions, (rows)=>
    {
      table.setRows(rows);
    })
  }

  Table.prototype.setupUI=function()
  {
    let table=this;
    table.$target.html(component.html.table);
    table.$fixed=table.$target.find(".zn-table-fixed");
    table.$fixedHeader=table.$target.find(".zn-table-fixed-header");
    table.$fixedContent=table.$target.find(".zn-table-fixed-content");
    table.$scrollable=table.$target.find(".zn-table-scrollable");
    table.$scrollableHeader=table.$target.find(".zn-table-scrollable-header");
    table.$scrollableContent=table.$target.find(".zn-table-scrollable-content");
    table.$rowActionsMenu=table.$target.find(".zn-row-actions-menu");
    table.$filterPopup=table.$target.find(".zn-table-filter-popup");
    table.$footer=table.$target.find(".zn-table-footer");
    table.$pageNumbers=table.$target.find(".zn-table-page-numbers");
    table.$actions=table.$target.find(".zn-table-actions");
    

    table.$fixedHeader.html(component.html.fixedHeader(table.fixedCols));
    table.$scrollableHeader.html(component.html.scrollableHeader(table.scrollableCols));
    if(table.options.headerHeight)
    {
      table.$fixedHeader.height(table.options.headerHeight);
      table.$fixedContent.css("top", table.options.headerHeight+"px");
      table.$fixedHeader.find(".zn-table-row").height(table.options.headerHeight);
      table.$scrollableHeader.height(table.options.headerHeight);
      table.$scrollableContent.css("top", table.options.headerHeight+"px");
      table.$scrollableHeader.find(".zn-table-row").height(table.options.headerHeight);
    }
    if(table.options.rowHeight)
    {
      table.$fixedContent.find(".zn-table-row").height(table.options.rowHeight);
      table.$scrollableContent.find(".zn-table-row").height(table.options.rowHeight);
    }
    let fixedWidth=0;
    if(table.options.rowActions) fixedWidth+=30;
    if(table.options.multiSelect) fixedWidth+=30;
    fixedWidth=table.fixedCols.reduce((a, c)=>a+c.width, fixedWidth);
    table.$fixed.width(fixedWidth);
    if(fixedWidth==0) table.$fixed.hide();

    if(table.options.actions && table.options.actions.length>0) table.$actions.html(component.html.tableActions(table.options.actions));
  }

  Table.prototype.setupEventHandlers=function()
  {
    let table=this;
    table.$scrollableContent.on("scroll", (evt)=>
    {
      let left=table.$scrollableContent.scrollLeft();
      let top=table.$scrollableContent.scrollTop();
      table.$scrollableHeader.scrollLeft(left);
      table.$fixedContent.scrollTop(top);
    });

    table.$fixedHeader.find(".zn-table-cell.multi-select .checkbox").click((evt)=>
    {
      evt.preventDefault();
      let $checkbox=$(evt.currentTarget);
      let checked=$checkbox.attr("data-checked") == "Y" ? "N" : "Y";
      $checkbox.attr("data-checked", checked);

      table.$fixedContent.find(".zn-table-cell.multi-select .checkbox").attr("data-checked", checked);
      table.fireEvent("row-selection-change", {source: table, selection: table.getSelectedRows()});
    });

    table.$actions.find(".zn-table-action").on("click", (evt)=>
    {
      evt.preventDefault();
      let $action=$(evt.currentTarget);
      let action=$action.attr("data-action");
      table.fireEvent("action", {action: action});
    })
    table.setupRowSelectionEventHandlers();
    table.setupColHeaderEventHandlers();
    table.setupFilterPopupEventHandlers();
    table.setupPaginationEventHandlers();
  }

  Table.prototype.setupRowSelectionEventHandlers=function()
  {
    let table=this;

    table.$target.on("mouseenter", ".zn-table-fixed-content .zn-table-row, .zn-table-scrollable-content .zn-table-row", (evt)=>
    {
      if(table.isEmpty) return;
      let $row=$(evt.currentTarget);
      let index=$row.attr("data-row");
      let $rows=table.$target.find(`.zn-table-row[data-row='${index}']`);
      $rows.addClass("hover");
      if(table.eventHandlers["row-select"]) $rows.addClass("select");
    });

    table.$target.on("mouseleave", ".zn-table-fixed-content .zn-table-row, .zn-table-scrollable-content .zn-table-row", (evt)=>
    {
      if(table.isEmpty) return;
      let $row=$(evt.currentTarget);
      let index=$row.attr("data-row");
      table.$target.find(`.zn-table-row[data-row='${index}']`).removeClass("hover").removeClass("select");
    });

    table.$target.on("click", ".zn-table-fixed-content .zn-table-row, .zn-table-scrollable-content .zn-table-row", (evt)=>
    {
      if(table.isEmpty) return;
      evt.preventDefault();

      let $cell=$(evt.target).closest(".zn-table-cell");
      let $row=$cell.closest(".zn-table-row");
      let index=$row.attr("data-row");
      if($cell.attr("data-col")=="0")
      {
        if($cell.hasClass("actions"))
        {
          let action=$cell.find("[zn-row-action]").attr("zn-row-action");
          if(action=="zn-table:show-actions") table.showRowActionsMenu($cell, index);
          else table.fireEvent("row-action",{source: table, action: action, rowsIndex: index, row: table.rows[index]});
        }
        if($cell.hasClass("multi-select"))
        {
          let $checkbox=$cell.find(".checkbox");
          let checked=$checkbox.attr("data-checked");
          if(checked=="Y") $checkbox.attr("data-checked", "N");
          else $checkbox.attr("data-checked", "Y");
          table.fireEvent("row-selection-change", {source: table, selection: table.getSelectedRows()});
        }
      }
      else
      {
        if(table.eventHandlers["row-select"])
        {
          table.selectedRowIndex=index;
          table.$target.find(`.zn-table-row.selected`).removeClass("selected");
          table.$target.find(`.zn-table-row[data-row='${index}']`).addClass("selected");
          table.fireEvent("row-select", {source: table, index: index, row: table.rows[index]});
        }
      }
    })

  }

  Table.prototype.setupColHeaderEventHandlers=function()
  {
    let table=this;
    table.$target.on("click", ".zn-table-fixed-header .col-header-action, .zn-table-scrollable-header .col-header-action", (evt)=>
    {
      evt.preventDefault();
      let $colHeaderAction=$(evt.currentTarget);
      let action=$colHeaderAction.attr("data-action");
      let colIndex=parseInt($colHeaderAction.attr("data-col-index"))-1;
      if(action=="sort") table.sort(colIndex, table.options.columns[colIndex]);
      if(action=="filter") table.filter(colIndex, table.options.columns[colIndex]);
    });

  }

  Table.prototype.setupFilterPopupEventHandlers=function()
  {
    let table=this;
    table.$filterPopup.on("click", ".filter-actions .filter-action", (evt)=>
    {
      evt.preventDefault();
      let ctx=table.$filterPopup.ctx;
  
      let $action=$(evt.currentTarget);
      let filterAction=$action.attr("zn-filter-action");
      table.hideFilterPopup();

      let $selectAllCheckbox=table.$filterPopup.find(".lov .lov-action[zn-lov-action='select-all'] .checkbox");
      let $blanksCheckbox=table.$filterPopup.find(".lov .lov-action[zn-lov-action='blanks'] .checkbox");
      if(filterAction=="apply")
      {
        if($selectAllCheckbox.attr("data-checked")!="Y")
        {
          let selectedValues=[];
          table.$filterPopup.find(".items .checkbox[data-checked='Y']").each((i,e)=>selectedValues.push($(e).attr("data-value")));
          table.addFilter(ctx.index, ctx.column, selectedValues, $blanksCheckbox.attr("data-checked")=="Y");
          table.$target.find(`.zn-table-header-cell[data-col='${ctx.index+1}'] .actions .filter`).attr("data-state", "on");
        }
        else 
        {
          table.removeFilter(ctx.index, ctx.column);
          table.$target.find(`.zn-table-header-cell[data-col='${ctx.index+1}'] .actions .filter`).attr("data-state", "off");
        }
      }

      if(filterAction=="clear")
      {
        table.removeFilter(ctx.index, ctx.column);
        table.$target.find(`.zn-table-header-cell[data-col='${ctx.index+1}'] .actions .filter`).attr("data-state", "off");
      }
    });

    table.$filterPopup.on("click", ".search-input .close", (evt)=>
    {
      evt.preventDefault();
      table.hideFilterPopup();
    })

    table.$filterPopup.on("keydown", ".search-input input", (evt)=>
    {
      if(evt.keyCode!=13) return;

      let ctx=table.$filterPopup.ctx;
      let val=$(evt.target).val();
      if(val!="") 
      {
        let options={includeScore: true, ignoreLocation: true, threshold: 0.4};
        let fuse=new Fuse(ctx.lov, options);
        table.$filterPopup.find(".items").html(component.html.filterLovItems(fuse.search(val).map((i)=>i.item)));
        table.$filterPopup.find(".lov-action[zn-lov-action='blanks']").addClass("na");
      }
      else
      {
        table.$filterPopup.find(".items").html(component.html.filterLovItems(ctx.lov));
        if(ctx.hasBlanks) table.$filterPopup.find(".lov-action[zn-lov-action='blanks']").removeClass("na");
      }
      table.$filterPopup.find(".lov-action[zn-lov-action='select-all'] .checkbox").attr("data-checked", "Y");
    });

    table.$filterPopup.on("click", ".lov .lov-actions .lov-action", (evt)=>
    {
      let ctx=table.$filterPopup.ctx;
      let $lovAction=$(evt.currentTarget);
      let $checkbox=$lovAction.find(".checkbox")
      let checked=$checkbox.attr("data-checked") == "N" ? "Y" : "N";
      $checkbox.attr("data-checked", checked);

      let action=$lovAction.attr("zn-lov-action");

      let $selectAllCheckbox=table.$filterPopup.find(".lov .lov-action[zn-lov-action='select-all'] .checkbox");
      let $blanksCheckbox=table.$filterPopup.find(".lov .lov-action[zn-lov-action='blanks'] .checkbox");

      if(action=="select-all")
      {
        table.$filterPopup.find(".lov .items .checkbox").attr("data-checked", checked);
        $blanksCheckbox.attr("data-checked", checked);
      }
      if(action=="blanks")
      {
        if(table.$filterPopup.find(".lov .items .checkbox[data-checked='Y']").get().length==ctx.lov.length && checked=="Y") $selectAllCheckbox.attr("data-checked", "Y");
        else $selectAllCheckbox.attr("data-checked", "N");
      }
    })
    
    table.$filterPopup.on("click", ".lov .items .item", (evt)=>
    {
      let ctx=table.$filterPopup.ctx;
      let $item=$(evt.currentTarget);
      let $checkbox=$item.find(".checkbox")
      let checked=$checkbox.attr("data-checked") == "N" ? "Y" : "N";
      $checkbox.attr("data-checked", checked);

      let $selectAllCheckbox=table.$filterPopup.find(".lov .lov-action[zn-lov-action='select-all'] .checkbox");
      let $blanksCheckbox=table.$filterPopup.find(".lov .lov-action[zn-lov-action='blanks'] .checkbox");

      if(table.$filterPopup.find(".lov .items .checkbox[data-checked='Y']").get().length==ctx.lov.length 
         && $blanksCheckbox.attr("data-checked")=="Y") $selectAllCheckbox.attr("data-checked", "Y");
      else $selectAllCheckbox.attr("data-checked", "N");
    });

  }

  Table.prototype.setupPaginationEventHandlers=function()
  {
    let table=this;
    table.$footer.on("click", ".zn-table-page-number", (evt)=>
    {
      evt.preventDefault();
      let $pageNumber=$(evt.currentTarget);
      let page=$pageNumber.attr("data-page");
      if(page=="previous") table.dataOptions.page == 1 || table.dataOptions.page--;
      else if(page=="next") table.dataOptions.page == table.numPages || table.dataOptions.page++;
      else table.dataOptions.page=parseInt(page);
      table.getData("page", table.dataOptions, (rows)=>
      {
        table.setRows(rows);
      })
    })
  }

  Table.prototype.setRows=function(rows)
  {
    let table=this;
    table.rows=rows;
    let content=component.html.content(rows, table.fixedCols, table.scrollableCols, table.options.rowActions, table.options.multiSelect);
    table.$fixedContent.html(content.fixed);
    table.$scrollableContent.html(content.scrollable);
    if(!table.$target.hasClass("zn-table-fill") && !table.$target.hasClass("zn-table-container-scroll"))
    {
      table.$scrollableHeader.find(".zn-table-row").width(table.$scrollableContent.find(".zn-table-row[data-row='0']").width()+10);
    }
    if(table.options.headerHeight)
    {
      table.$fixedHeader.height(table.options.headerHeight);
      table.$fixedContent.css("top", table.options.headerHeight);
      table.$scrollableHeader.height(table.options.headerHeight);
      table.$scrollableContent.css("top", table.options.headerHeight);
    }
    if(table.options.rowHeight)
    {
      table.$target.find(".zn-table-row").height(table.options.rowHeight);
    }
    let fixedWidth=0;
    if(table.options.rowActions)
    {
      fixedWidth+=30;
      table.$target.find(".zn-table-cell.actions").show();
    }
    if(table.options.multiSelect)
    {
      fixedWidth+=30;
      table.$target.find(".zn-table-cell.multi-select").show();
    }
    fixedWidth=table.fixedCols.reduce((a, c)=>a+c.width, fixedWidth);
    table.$fixed.width(fixedWidth);
    /*table.$scrollableContent.find(".zn-table-row").each((i,e)=>
    {
      let $row=$(e);
      let rownum=$row.attr("data-row");
      table.$fixedContent.find(`.zn-table-row[data-row='${rownum}']`).height($row.height());
    })*/

    if(fixedWidth==0) table.$fixed.hide();
    if(rows.length>0) table.isEmpty=false;
    if(table.options.paging) table.setPages();
  }

  Table.prototype.setRowActions=function(rowActions)
  {
    let table=this;
    table.options.rowActions=rowActions;

    let rowActionsHTML="";
    if(rowActions && rowActions.length>0)
    {
      if(rowActions.length>1) rowActionsHTML=component.html.rowAction({action: 'zn-table:show-actions', label: 'Show Actions', icon: 'fas fa-bars'});
      else rowActionsHTML=component.html.rowAction(rowActions[0]);
      table.$fixedContent.find(".zn-table-cell.actions").html(rowActionsHTML);
    }

    let fixedWidth=0;
    if(table.options.rowActions)
    {
      fixedWidth+=30;
      table.$target.find(".zn-table-cell.actions").show();
    }
    if(table.options.multiSelect)
    {
      fixedWidth+=30;
      table.$target.find(".zn-table-cell.multi-select").show();
    }
    fixedWidth=table.fixedCols.reduce((a, c)=>a+c.width, fixedWidth);
    table.$fixed.width(fixedWidth);
    if(fixedWidth==0) table.$fixed.hide();
  }

  Table.prototype.showRowActionsMenu=function($cell, index)
  {
    let table=this;
    let actionMenuItems=component.html.actionsMenu(table.options.rowActions);
    table.$rowActionsMenu.html(actionMenuItems);

    var $body=$("body");
    let hide=()=>
    {
      $body.off("mousedown.zn.ui.components.table.menupopup");
      $body.off("keydown.zn.ui.components.table.menupopup");
      table.$rowActionsMenu.hide();
    }
    $body.on("mousedown.zn.ui.components.table.menupopup",(evt)=>
    {
      if(!component.pointInContent({x:evt.pageX,y:evt.pageY}, table.$rowActionsMenu)) hide();
    });
    $body.on("keydown.zn.ui.components.table.menupopup",(evt)=>
    {
      if(evt.keyCode==27) hide();
    });

    table.$rowActionsMenu.find(".zn-popup-menu-item").click((evt)=>
    {
      let $menuItem=$(evt.currentTarget);
      let action=$menuItem.attr("zn-row-action");
      hide();
      table.fireEvent("row-action", {source: table, action: action, rowIndex: index, row: table.rows[index]});
    })

    let p=$cell.position();
    let tp=table.$target.position();
    let tw=table.$target.width();
    let th=table.$target.height();
    let top=tp.top + p.top + table.$fixedHeader.height() + 2;
    let left=tp.left + p.left + 2;
    let ch=$(document).height();

    if(top + table.$rowActionsMenu.height() > ch) top = ch - table.$rowActionsMenu.height() - 5;

    table.$rowActionsMenu.css("top", top+"px")
                         .css("left",left+"px")
                         .show();

  }
  
  Table.prototype.setPages=function()
  {
    let table=this;
    let pageNumbers=[];
    let p=table.dataOptions.page;
    let numPages=table.numPages;
    let s=p-2 < 1 ? 1 : p-2;
    let e=s+4;
    if(e > numPages)
    {
      e=numPages;
      s=numPages-4;
    }
    if(s<1) s=1;
    while(s <= e) pageNumbers.push(s++);
    table.$pageNumbers.html(component.html.pages(pageNumbers, p));
  }

  Table.prototype.getSelectedRows=function()
  {
    let table=this;
    let selected={data:[], indexes:[]}
    table.$fixedContent.find(".zn-table-cell.multi-select .checkbox[data-checked='Y']").each((i,e)=>
    {
      let $row=$(e).parent().parent();
      let index=$row.attr("data-row")
      selected.data.push(table.rows[index]);
      selected.indexes.push(index);
    })

    return selected;
  }

  Table.prototype.sort=function(colIndex, column)
  {
    let table=this;
    let sort=table.dataOptions.sort;

    if(sort.field)
    {
      table.$target.find(`.zn-table-header-cell[data-col='${sort.index+1}'] .actions .sort`).removeAttr("data-state").removeAttr("data-sort");
    }
    sort.field=column.field;

    if(sort.order && sort.index==colIndex) sort.order = (sort.order =="asc") ? "desc" :"asc";
    else sort.order="asc";
    sort.index=colIndex;

    table.getData("sort", table.dataOptions, (rows)=>
    {
      let $sortAction=table.$target.find(`.zn-table-header-cell[data-col='${colIndex+1}'] .actions .sort`);
      $sortAction.attr("data-state", "on").attr("data-sort", sort.order);
      table.setRows(rows);
      table.$scrollableContent.scrollTop(0);
    });
  }

  Table.prototype.filter=function(colIndex)
  {
    let table=this;

    let $headerCell=table.$target.find(`.zn-table-header-cell[data-col='${colIndex+1}']`);
    let column=table.options.columns[colIndex];
    
    let filterstate={selectedValues: null, includeBlanks: null};
    table.dataOptions.filters.forEach((f)=>{f.index == colIndex ? filterstate=f : ''});
    
    table.getLovs({filters: table.dataOptions.filters, index: colIndex, column: column}, (results)=>
    {
      table.showFilterPopup($headerCell, colIndex, column, results.list, results.hasBlanks, filterstate);
    })
    
  }

  Table.prototype.showFilterPopup=function($cell, index, column, lov, hasBlanks, filterstate)
  {
    let table=this;
    let popContent=component.html.filterPopup(column.label, lov, hasBlanks, filterstate);
    table.$filterPopup.html(popContent);
    table.$filterPopup.ctx={$cell: $cell, index: index, column: column, lov: lov, hasBlanks: hasBlanks, filterstate: filterstate};

    var $body=$("body");
    $body.on("mousedown.zn.ui.components.table.filterpopup",(evt)=>
    {
      if(!component.pointInContent({x:evt.pageX,y:evt.pageY}, table.$filterPopup)) table.hideFilterPopup();
    });
    
    $body.on("keydown.zn.ui.components.table.filterpopup",(evt)=>
    {
      if(evt.keyCode==27) table.hideFilterPopup();
    });
    
    let $header=$cell.parent().parent();
    let offset=$header.position().left;
    if($header.hasClass("zn-table-scrollable-header")) offset += table.$fixed.width();

    let p=$cell.position();
    let tp=table.$target.position();
    let tw=table.$target.width();
    let th=table.$target.height();
    let top=tp.top + p.top + 2;
    let left=tp.left + p.left + 2 + offset;
    let ch=$(document).height();
    let cw=$(document).width();

    if(left+table.$filterPopup.width() > cw) left=cw-table.$filterPopup.width()-5;
    table.$filterPopup.css("top", top+"px")
                      .css("left", left+"px")
                      .css("display", "flex");

  }

  Table.prototype.hideFilterPopup=function()
  {
    let table=this;
    var $body=$("body");

    $body.off("mousedown.zn.ui.components.table.filterpopup");
    $body.off("keydown.zn.ui.components.table.filterpopup");
    table.$filterPopup.hide();
  }

  Table.prototype.addFilter=function(index, column, selectedValues, includeBlanks)
  {
    let table=this;
    let filters=table.dataOptions.filters.reduce((a, c)=>
    {
      if(c.field!=column.field) a.push(c);
      return a;
    }, []);
    table.dataOptions.filters=filters;

    filters.push({index: index, field: column.field, selectedValues: selectedValues, includeBlanks: includeBlanks});

    table.getData("filter-add", table.dataOptions, (rows)=>
    {
      table.setRows(rows);
      table.$scrollableContent.scrollTop(0);
    });
  }

  Table.prototype.removeFilter=function(index, column)
  {
    let table=this;
    let filters=table.dataOptions.filters.reduce((a, c)=>
    {
      if(c.field!=column.field) a.push(c);
      return a;
    }, []);
    table.dataOptions.filters=filters;

    table.getData("filter-remove", table.dataOptions, (rows)=>
    {
      table.setRows(rows);
      table.$scrollableContent.scrollTop(0);
    });
  }

  Table.prototype.filterRows=function(rows, filters, l)
  {
    let filteredRows=rows.reduce((a,row)=>
    {
      let match=true;
      for(let i=0; i<=l && match; i++)
      {
        let value=row[filters[i].field];
        match=filters[i].selectedValues.includes(""+value) || (filters[i].includeBlanks && (value==null || value==""));
      }
      if(match) a.push(row);
      
      return a;
    }, []);

    return filteredRows;
  }

  Table.prototype.sortRows=function(rows, sort)
  {
    rows.sort((a,b)=>
    {
      let va=a[sort.field];
      let vb=b[sort.field];
      if(va<vb) return sort.order=="asc" ? -1 : 1;
      if(va>vb) return sort.order=="asc" ? 1 : -1;
      return 0;
    });
  }

  Table.prototype.getLovs=function(ctx, $$)
  {
    let table=this;
    let rows=JSON.parse(table.baseRows);
    let hasBlanks=false;
    let lim=ctx.filters.length-1;
    
    if(ctx.filters.length>0 && ctx.index==ctx.filters[ctx.filters.length-1].index) lim--;

    let filteredRows=table.filterRows(rows, ctx.filters, lim);

    let map=filteredRows.reduce((a, c)=>
    {
      let value=c[ctx.column.field];
      if(value && value!="") a[c[ctx.column.field]]=value;
      else hasBlanks=true;
      return a;
    }, {});

    let list=Object.keys(map);
    list.sort();

    $$({list: list, hasBlanks: hasBlanks});
  }

  Table.prototype.getData=function(evt, dataOptions, $$)
  {
    let table=this;
    let processedRows=null;
    let ps=dataOptions.pageSize;
    
    if(["init", "sort", "filter-add", "filter-remove"].includes(evt))
    {
      let rows=JSON.parse(table.baseRows);
      processedRows=table.filterRows(rows, dataOptions.filters, dataOptions.filters.length-1);
      table.sortRows(processedRows, dataOptions.sort);
      table.processedRows=JSON.stringify(processedRows);
      dataOptions.page=1;
      if(ps) table.numPages=Math.floor(processedRows.length / ps) + (processedRows.length%ps ? 1 : 0);
    }

    let pageRows=processedRows || JSON.parse(table.processedRows);
    if(table.options.paging)
    {
      let p=dataOptions.page;
      if(ps && p)
      {
        pageRows=pageRows.slice(ps == -1 ? 0 : (p-1)*ps, ps == -1 ? pageRows.length-1 : p*ps);
      }
    }

    $$(pageRows);
  }

  component.html={};

  component.html.table=`
  <div class="zn-table-content">
    <div class="zn-table-fixed">
      <div class="zn-table-fixed-header"></div>
      <div class="zn-table-fixed-content"></div>
    </div>
    <div class="zn-table-scrollable">
      <div class="zn-table-scrollable-header"></div>
      <div class="zn-table-scrollable-content"></div>
    </div>
  </div>
  <div class="zn-table-footer"><div class="zn-table-actions"></div><div class="zn-table-page-numbers"></div></div>
  <div class="zn-row-actions-menu zn-popup-menu-items"></div>
  <div class="zn-table-filter-popup"></div>
  `;

  component.html.cell=(index, value, w)=>
  {
    let style = '';
    if(w) style=`width: ${w}px; flex-grow: 0; flex-basis: unset;`
    return `<div class="zn-table-cell col-${index}" data-col='${index}' style='${style}' title="${value ? value : ''}">${value ? value : '-'}</div>`
  }

  component.html.headerCell=(col)=>
  {
    let style = '';
    if(col.width) style=`width: ${col.width}px; flex-grow: 0; flex-basis: unset;`;
    
    return `
    <div class="zn-table-cell zn-table-header-cell col-${col.index}" data-col='${col.index}' style='${style}' title="${col.label}">
      <div class="text">${col.label}</div>
      <div class="actions">
        <span class="filter ${col.filterable===true ? 'filterable':''}" data-state="${col.filtered===true ? 'on':''}" data-col-index="${col.index}">
          <a href='#filter' class="col-header-action" data-action="filter" data-col-index="${col.index}" title="Filter"><i class="fas fa-filter"></i></a>
        </span>
        <span class="sort ${col.sortable===true ? 'sortable':''}" data-state="${col.sorted===true ? 'on':''}" data-sort="${col.sortOrder}" data-col-index="${col.index}">
          <a href='#sort-ascending' class="asc col-header-action" data-action="sort" data-col-index="${col.index}" title="Sort"><i class="fas fa-arrow-up"></i></a>
          <a href='#sort-descending' class="desc col-header-action" data-action="sort" data-col-index="${col.index}" title="Sort"><i class="fas fa-arrow-down"></i></a>
        </span>
      </div>
    </div>`
  }

  component.html.fixedHeader=(cols)=>
  {
    let h=
    `<div class="zn-table-row">
       <div class="zn-table-cell zn-table-header-cell col-0 actions">&nbsp;</div>
       <div class="zn-table-cell zn-table-header-cell col-0 multi-select">${component.html.multiSelect()}</div>
       ${cols.reduce((a, c)=> a + component.html.headerCell(c), "")}
     </div>`;
    
     return h;
  }

  component.html.scrollableHeader=(cols)=>
  {
    let h=
    `<div class="zn-table-row">
      ${cols.reduce((a, c)=>a + component.html.headerCell(c), "")}
     </div>`;
    
    return h;
  }

  component.html.actionsMenu=(actions)=>
  {
    return actions.reduce((a, item)=> a + `<a class="zn-popup-menu-item" zn-row-action='${item.action}' title='${item.label}'><i class="${item.icon}"></i><span class="zn-popup-menu-item-text">${item.label}</span></a>`, "");
  }

  component.html.rowAction=(a)=>
  {
    return `<a href='#action' class="zn-row-action" zn-row-action='${a.action}' title='${a.label}'><i class="${a.icon}"></i></a>`;
  }

  component.html.multiSelect=()=>
  {
    return `<a href='#select' class='checkbox' data-checked='N'><i class="far fa-square unchecked"></i><i class="fas fa-check-square checked"></i></a>`;
  }

  component.html.contentRow=(row, rowIndex, fixedcols, scrollablecols, rowActionsHTML, multiSelectHTML)=>
  {
    let rc=(rowIndex%2==0)?'odd':'even';

    let fixedh = `
    <div class="zn-table-row ${rc}" data-row='${rowIndex}'>
      ${rowActionsHTML ? `<div class="zn-table-cell col-0 actions" data-col='0'>${rowActionsHTML}</div>` : ''}
      ${multiSelectHTML ? `<div class="zn-table-cell col-0 multi-select" data-col='0'>${row ? multiSelectHTML : '&nbsp;'}</div>` : ''}
      ${fixedcols.reduce((a, c) => a + component.html.cell(c.index, row ? (c.field && row[c.field] ? component.format(row[c.field], c.type, c.format):'-') : ' ', c.width), "")}
    </div>
    `;
    
    let scrollableh = `
    <div class="zn-table-row ${rc}" data-row='${rowIndex}'>
      ${scrollablecols.reduce((a, c) => a + component.html.cell(c.index, row ? (c.field && row[c.field] ? component.format(row[c.field], c.type, c.format):'-') : ' ', c.width), "")}
    </div>`;

    return {fixed: fixedh, scrollable: scrollableh};
  }

  component.html.content=(rows, fixedcols, scrollablecols, actions, multiselect)=>
  {
    let rowActionsHTML=null;
    if(actions && actions.length>0)
    {
      rowActionsHTML=component.html.rowAction(actions.length==1 ? actions[0] : {action: 'zn-table:show-actions', label: 'Show Actions', icon: 'fas fa-bars'});
    }

    let multiSelectHTML=null;
    if(multiselect) multiSelectHTML=component.html.multiSelect();

    if(rows.length==0) return component.html.contentRow(null, 0, fixedcols, scrollablecols, rowActionsHTML, multiSelectHTML);

    let content=rows.reduce((a, row, i)=>
    {
      let {fixed, scrollable} = component.html.contentRow(row, i, fixedcols, scrollablecols, rowActionsHTML, multiSelectHTML);
      a.fixed += fixed;
      a.scrollable += scrollable;
      return a;
    }, {fixed: '', scrollable: ''});

    content.fixed += `<div class="zn-table-buffer-row">&nbsp;</div>`;
    return content;
  }

  component.html.filterLovItem=(item, checked)=>
  {
    return `
    <div class="item">
      <span class='checkbox' data-checked='${checked}' data-value='${item}'><i class="far fa-square unchecked"></i><i class="fas fa-check-square checked"></i></span>
      <span class="value">${item}</span>
    </div>`
  }

  component.html.filterLovItems=(items, selectedValues)=>
  {
    
    return items.reduce((a,c) => a + component.html.filterLovItem(c, selectedValues ? (selectedValues.includes(c) ? 'Y':'N'):'Y'), '');
  }

  component.html.filterPopup=(label, items, hasBlanks, filterstate)=>
  {
    return `
    <div class="search-input">
      <i class="fas fa-search"></i><input type="text" placeholder="${label}"/><i class="close fas fa-times"></i>
    </div>
    <div class="lov">
      <div class="lov-actions">
        <div class="lov-action" zn-lov-action="select-all">
          <span class='checkbox' data-checked='${filterstate.selectedValues ? 'N':'Y'}'><i class="far fa-square unchecked"></i><i class="fas fa-check-square checked"></i></span>
          <span class="value">(Select All)</span>
        </div>
        <div class="lov-action  ${!hasBlanks ? 'na':''}" zn-lov-action="blanks">
          <span class='checkbox ${!hasBlanks ? 'na':''}' data-checked='${filterstate.includeBlanks!=null ? (filterstate.includeBlanks===true?'Y':'N'):'Y'}'><i class="far fa-square unchecked"></i><i class="fas fa-check-square checked"></i></span>
          <span class="value">(Blank)</span>
        </div>
      </div>
      <div class="items">
        ${component.html.filterLovItems(items, filterstate.selectedValues)}
      </div>
    </div>
    <div class="footer">
      <div class="filter-actions">
        <a class="filter-action" zn-filter-action="clear" href="#clear-filter">Clear</a>
        <a class="filter-action" zn-filter-action="apply" href="#apply-filter">Apply</a>
        <a class="filter-action" zn-filter-action="cancel" href="#cancel">Cancel</a>
      </div>
    </div>`;
  }

  component.html.page=(pageNumber, selectedPage)=>
  {
    return `<a class="zn-table-page-number ${pageNumber==selectedPage?'selected':''}" href="#page-${pageNumber}" data-page="${pageNumber}">${pageNumber}</a>`;
  }

  component.html.pages=(pageNumbers, selectedPage)=>
  {
    return `
    <a class="zn-table-page-number page-nav" href="#previous-page" data-page="previous"><i class="fas fa-arrow-left"></i></a>
    ${pageNumbers.reduce((a, c)=> a + component.html.page(c, selectedPage), "")}
    <a class="zn-table-page-number page-nav" href="#next-page" data-page="next"><i class="fas fa-arrow-right"></i></a>
    `;
  }

  component.html.icon=(icon)=>
  {
    return `<i class="icon ${icon}"></i>`
  }

  component.html.tableAction=(item)=>
  {
    return `<a class="zn-table-action" data-action="${item.action}">${item.icon ? component.html.icon(item.icon) : ''}<span class="text">${item.label || ''}</span></a>`;
  }

  component.html.tableActions=(actions)=>
  {
    return actions.reduce((a,c) => a + component.html.tableAction(c), '');
  }

  component.format=(v, t, f)=>
  {
    if(t==null || f == null || f == "") return v;
    if(t=="number") return numeral(v).format(f);
    if(t=="date") return moment(v).format(f);
    return v;

  }
  component.pointInContent = function(point,content)
  {
    var offset=content.offset();
    return point.x >= offset.left && 
           point.x <= (offset.left+content.width()) && 
           point.y >= offset.top &&
           point.y <= (offset.top+content.height());
  }

  let iff=(condition, truthValue, falseValue)=>
  {
    if(condition) return truthValue;
    return falseValue;
  }

  let nvl=(obj, v)=>
  {
    if(obj) return v;
    return obj;
  }

  let nnvl=(obj, v)=>
  {
    if(!obj) return v;
    return obj;
  }

  component.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[component.name]=component;

})(window);

