(function(window)
{
  let component =
  {
    name: "calendar",
    package: "zn.ui.components"
  }

  component.create=(options)=>
  {
    let znc=new Calendar(options);
    return znc;
  }

  component.get=(name)=>
  {
    return $(`[zn-calendar='${name}']`).get()[0].znc;
  }

  let Calendar=function(options)
  {
    this.options=options;
    this.value=options.date;
    this.name=options.name;
    this.eventHandlers={};
  }

  Calendar.prototype.init=function()
  {
    let calendar=this;
    calendar.$target=$(calendar.options.target);
    
    calendar.$target.addClass("zn-calendar");
    calendar.$target.attr("zn-calendar", calendar.options.name);

    calendar.setupUI();
    calendar.setupEventHandlers();
    calendar.$target.get()[0].znc=calendar;
    calendar.fireEvent("init");
  }

  Calendar.prototype.on=function(eventName, eventHandler)
  {
    let calendar=this;
    (calendar.eventHandlers[eventName]=calendar.eventHandlers[eventName] || []).push(eventHandler);
  }

  Calendar.prototype.fireEvent=function(eventName, event)
  {
    let calendar=this;
    let evt=event || {};
    evt.source=calendar;
    evt.name=eventName;
    (calendar.eventHandlers[eventName] || []).forEach((eh)=>eh(evt));
  }

  Calendar.prototype.setValue=function(value)
  {
    let calendar=this;
    calendar.value=value;
    if(value)
    {
      calendar.options.date=value;
      calendar.loadDates(true);
    }
  }

  Calendar.prototype.getValue=function() {return this.value;}

  Calendar.prototype.setupUI=function()
  {
    let calendar=this;
    calendar.options.view="weeks";
    calendar.$target.html(component.html.calendar);
    calendar.loadDates(true);
  }

  Calendar.prototype.setupEventHandlers=function()
  {
    let calendar=this;
    calendar.$target.off("click.date").on("click.date", ".date", function(evt)
    {
      evt.preventDefault();
      let sd=calendar.options.selectedDate;
      let $date=$(this);
      sd.date=parseInt($date.attr("data-date"));
      calendar.options.date=new Date(sd.year+"-"+(sd.month+1)+"-"+sd.date);
      calendar.$target.find(".date.selected").removeClass("selected");
      $date.addClass("selected");
      calendar.value=calendar.options.date;
      calendar.fireEvent("date-select", {date: calendar.options.date});
    });

    calendar.$target.off("click.month").on("click.month", ".month", function(evt)
    {
      evt.preventDefault();
      let sd=calendar.options.selectedDate;
      sd.month=parseInt($(this).attr("data-month"));
      calendar.options.view="weeks";
      calendar.loadWeeks(false);
    });

    calendar.$target.off("click.year").on("click.year", ".year", function(evt)
    {
      evt.preventDefault();
      let sd=calendar.options.selectedDate;
      sd.year=parseInt($(this).attr("data-year"));
      calendar.options.view="months";
      calendar.loadMonths(false);
    });

    calendar.$target.off("click.previous").on("click.previous", ".previous", function(evt)
    {
      evt.preventDefault();
      let sd=calendar.options.selectedDate;
      if(calendar.options.view=="weeks")
      {
        sd.month=sd.month-1;
        if(sd.month<0)
        {
          sd.month=11;
          sd.year--;
        }
        calendar.loadWeeks(false);
      }
      if(calendar.options.view=="months")
      {
        sd.year=sd.year-1;
        calendar.loadMonths(false);
      }
      if(calendar.options.view=="years")
      {
        sd.year=sd.year-12;
        calendar.loadYears(false);
      }
    });

    calendar.$target.off("click.next").on("click.next", ".next", function(evt)
    {
      evt.preventDefault();
      let sd=calendar.options.selectedDate;
      if(calendar.options.view=="weeks")
      {
        sd.month=sd.month+1;
        if(sd.month>11)
        {
          sd.month=0;
          sd.year++;
        }
        calendar.options.date=new Date(sd.year+"-"+(sd.month+1)+"-"+sd.date);
        calendar.loadWeeks(false);
      }
      if(calendar.options.view=="months")
      {
        sd.year=sd.year+1;
        calendar.loadMonths(false);
      }
      if(calendar.options.view=="years")
      {
        sd.year=sd.year+12;
        calendar.loadYears(false);
      }
    });
    
    calendar.$target.off("click.viewselector").on("click.viewselector", ".view-selector", function(evt)
    {
      evt.preventDefault();
      if(calendar.options.view=="weeks")
      {
        calendar.options.view="months";
        calendar.loadMonths(true);
      }
      else if(calendar.options.view=="months")
      {
        calendar.options.view="years";
        calendar.loadYears(true);
      }
      else if(calendar.options.view=="years")
      {
        let date=new Date();
        let sd=
        {
          year  : date.getFullYear(),
          month : date.getMonth(),
          date  : date.getDate()
        }
        calendar.options.selectedDate=sd;        
        calendar.options.view="weeks";
        calendar.loadWeeks(true);
      }
    });
  }

  Calendar.prototype.loadWeeks=function(markDate)
  {
    let calendar=this;
    let $calendar=calendar.$target;
    $calendar.find(".months").hide();
    $calendar.find(".years").hide();

    let sd=calendar.options.selectedDate;

    let numdays=component.monthDaysFor(sd.month, sd.year);
    let fomwday=new Date(sd.year + "-" + (sd.month+1) + "-1").getDay();
    
    let html="<div class='row'>";
    for(let i=0;i<fomwday;i++)
    {
      html+="<div class='empty-date'>&nbsp;</div>";
    }
    for(let i=1;i<=numdays;i++)
    {
      let selected=((markDate && i==sd.date) ? 'selected': '');
      html+=`<a class='date ${selected}' data-date='${i}'>${i}</a>`;
      if((fomwday+i)%7==0) html+="</div><div class='row'>";
    }
    html+="</div>";
    
    $calendar.find(".dates").html(html);
    $calendar.find(".header .title a").text(component.months[sd.month] + " " + sd.year);
    $calendar.find(".weeks").show();
  }

  Calendar.prototype.loadMonths=function(markDate)
  {
    let calendar=this;
    let $calendar=calendar.$target;
    $calendar.find(".weeks").hide();
    $calendar.find(".years").hide();

    let sd=calendar.options.selectedDate;
    
    let html="<div class='row'>";
    for(let i=0,l=component.months.length;i<l;i++)
    {
      let selected=((markDate && i==sd.month) ? 'selected': '');
      html+=`<a class='month ${selected}' data-month='${i}'>${component.months[i]}</a>`;
      if((i+1)%3==0) html+="</div><div class='row'>";
    }
    html+="</div>"
    $calendar.find(".months").html(html);
    $calendar.find(".header .title a").text(component.months[sd.month] + " " + sd.year);
    $calendar.find(".months").show();
  }

  Calendar.prototype.loadYears=function(markDate)
  {
    let calendar=this;
    let $calendar=calendar.$target;
    $calendar.find(".weeks").hide();
    $calendar.find(".months").hide();

    let sd=calendar.options.selectedDate;

    let y=sd.year-4;
    let html="<div class='row'>";
    for(let i=0;i<12;i++)
    {
      let selected=((markDate && (y+i)==sd.year) ? 'selected': '');
      html+=`<a class='year ${selected}' data-year='${y+i}'>${y+i}</a>`;
      if((i+1)%3==0) html+="</div><div class='row'>";
    }
    html+="</div>";
    $calendar.find(".years").html(html);
    $calendar.find(".header .title a").text("Today");
    $calendar.find(".years").show();
  }

  Calendar.prototype.loadDates=function(markDate)
  {
    let calendar=this;

    let sd=
    {
      year  : calendar.options.date.getFullYear(),
      month : calendar.options.date.getMonth(),
      date  : calendar.options.date.getDate()
    }
    calendar.options.selectedDate=sd;
 
    
    if(calendar.options.view=="weeks") calendar.loadWeeks(markDate);
    if(calendar.options.view=="months") calendar.loadMonths(markDate);
    if(calendar.options.view=="years") calendar.loadYears(markDate);
  }

  component.html={};

  component.html.calendar=`
  <div class="header">
    <div class="actions">
      <a class="previous"><i class="fas fa-arrow-circle-left"></i></a>
      <a class="next"><i class="fas fa-arrow-circle-right"></i></a>
    </div>
    <div class="title"><a class="view-selector"></a></div>
  </div>
  <div class="content">
    <div class="years">
    </div>
    <div class="months">
    </div>
    <div class="weeks">
      <div class="days">
        <div class="day">Su</div><div class="day">Mo</div><div class="day">Tu</div>
        <div class="day">We</div><div class="day">Th</div><div class="day">Fr</div>
        <div class="day">Sa</div>
      </div>
      <div class="dates">
      </div>
    </div>
  </div>
  `;

  component.format=(v, t, f)=>
  {
    if(t==null || f == null || f == "") return v;
    if(t=="number") return numeral(v).format(f);
    if(t=="date") return moment(v).format(f);
    return v;
  }

  component.pointInContent = function(point,content)
  {
    let offset=content.offset();
    return point.x >= offset.left && 
           point.x <= (offset.left+content.width()) && 
           point.y >= offset.top &&
           point.y <= (offset.top+content.height());
  }

  component.monthDays=[31,28,31,30,31,30,31,31,30,31,30,31];
  component.months=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  component.monthDaysFor=function(m, y)
  {
    let rval=component.monthDays[m];
    if(m==1)
    {
      if(y%4==0) rval++;
      if(y%100==0) rval--;
      if(y%400==0) rval++;
    }
    
    return rval;
  }

  component.package.split(".").reduce((a,e)=> a[e]=a[e]||{}, window)[component.name]=component;

})(window);

