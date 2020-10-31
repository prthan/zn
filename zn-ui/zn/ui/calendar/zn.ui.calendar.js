(function(window)
{
  var calendar=
  {
    options:null
  }
  
  calendar.monthDays=[31,28,31,30,31,30,31,31,30,31,30,31];
  calendar.months=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  calendar.monthDaysFor=function(m, y)
  {
    var rval=calendar.monthDays[m];
    if(m==1)
    {
      if(y%4==0) rval++;
      if(y%100==0) rval--;
      if(y%400==0) rval++;
    }
    
    return rval;
  }
  
  calendar.loadWeeks=function(markDate)
  {
    let $calendar=$(".zn-calendar");
    $calendar.find(".months").hide();
    $calendar.find(".years").hide();

    let sd=calendar.options.selectedDate;

    var numdays=calendar.monthDaysFor(sd.month, sd.year);
    var fomwday=new Date(sd.year + "-" + (sd.month+1) + "-1").getDay();
    
    var html="<div class='row'>";
    for(var i=0;i<fomwday;i++)
    {
      html+="<div class='empty-date'>&nbsp;</div>";
    }
    for(var i=1;i<=numdays;i++)
    {
      let selected=((markDate && i==sd.date) ? 'selected': '');
      html+=`<a href='' class='date ${selected}' data-date='${i}'>${i}</a>`;
      if((fomwday+i)%7==0) html+="</div><div class='row'>";
    }
    html+="</div>"
    $(".zn-calendar .dates").html(html);
    $(".zn-calendar .header .title a").text(calendar.months[sd.month] + " " + sd.year);
    $calendar.find(".weeks").show();
  }

  calendar.loadMonths=function(markDate)
  {
    let $calendar=$(".zn-calendar");
    $calendar.find(".weeks").hide();
    $calendar.find(".years").hide();

    let sd=calendar.options.selectedDate;
    
    var html="<div class='row'>";
    for(var i=0,l=calendar.months.length;i<l;i++)
    {
      let selected=((markDate && i==sd.month) ? 'selected': '');
      html+=`<a href='' class='month ${selected}' data-month='${i}'>${calendar.months[i]}</a>`;
      if((i+1)%3==0) html+="</div><div class='row'>";
    }
    html+="</div>"
    $(".zn-calendar .months").html(html);
    $(".zn-calendar .header .title a").text(calendar.months[sd.month] + " " + sd.year);
    $calendar.find(".months").show();
  }

  calendar.loadYears=function(markDate)
  {
    let $calendar=$(".zn-calendar");
    $calendar.find(".weeks").hide();
    $calendar.find(".months").hide();

    let sd=calendar.options.selectedDate;

    let y=sd.year-4;
    var html="<div class='row'>";
    for(var i=0;i<12;i++)
    {
      let selected=((markDate && (y+i)==sd.year) ? 'selected': '');
      html+=`<a href='' class='year ${selected}' data-year='${y+i}'>${y+i}</a>`;
      if((i+1)%3==0) html+="</div><div class='row'>";
    }
    html+="</div>";
    $(".zn-calendar .years").html(html);
    $(".zn-calendar .header .title a").text("Today");
    $calendar.find(".years").show();
  }

  calendar.loadDates=function(markDate)
  {
    var sd=
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
  
  calendar.setupHandlers=function()
  {
    $(".zn-calendar").off("click.date").on("click.date", ".date", function(evt)
    {
      evt.preventDefault();
      var sd=calendar.options.selectedDate;
      sd.date=parseInt($(this).attr("data-date"));
      calendar.options.date=new Date(sd.year+"-"+(sd.month+1)+"-"+sd.date);
      if(calendar.options.onselect)
      {
        calendar.options.onselect(calendar.options.date);
      }
      calendar.hide();
    })

    $(".zn-calendar").off("click.month").on("click.month", ".month", function(evt)
    {
      evt.preventDefault();
      var sd=calendar.options.selectedDate;
      sd.month=parseInt($(this).attr("data-month"));
      calendar.options.view="weeks";
      calendar.loadWeeks(false);
    })

    $(".zn-calendar").off("click.year").on("click.year", ".year", function(evt)
    {
      evt.preventDefault();
      var sd=calendar.options.selectedDate;
      sd.year=parseInt($(this).attr("data-year"));
      calendar.options.view="months";
      calendar.loadMonths(false);
    })

    $(".zn-calendar").off("click.previous").on("click.previous", ".previous", function(evt)
    {
      evt.preventDefault();
      var sd=calendar.options.selectedDate;
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
    })

    $(".zn-calendar").off("click.next").on("click.next", ".next", function(evt)
    {
      evt.preventDefault();
      var sd=calendar.options.selectedDate;
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
    })
    
    $(".zn-calendar").off("click.viewselector").on("click.viewselector", ".view-selector", function(evt)
    {
      evt.preventDefault();
      let $calendar=$(evt.delegateTarget);
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
        var sd=
        {
          year  : date.getFullYear(),
          month : date.getMonth(),
          date  : date.getDate()
        }
        calendar.options.selectedDate=sd;        
        calendar.options.view="weeks";
        calendar.loadWeeks(true);
      }
    })
  }
  
  calendar.show=function(options)
  {
    calendar.options=options;
    calendar.options.view="weeks";
    calendar.loadDates(true);
    calendar.setupHandlers();
    let top=options.top;
    if(top+$(".zn-calendar").height() + 30 > $(window).height()) top=$(window).height()-$(".zn-calendar").height()-30;
    zn.ui.popup.show({
      content: $(".zn-calendar"),
      source: options.source,
      left: options.left,
      top: top
    });
  }
  
  calendar.hide=function()
  {
    zn.ui.popup.hide();
  }
  
  zn.core.register("zn.ui.calendar", calendar);
  
})(window);