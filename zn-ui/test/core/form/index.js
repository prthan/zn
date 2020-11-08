$(()=>
{
  let custname=zn.ui.components.textfield.create({
      name: "name",
      target: ".textfield",
      label: "Customer Name",
      value: "initial value"
  });
  custname.on("change", evt => console.log("change", evt));
  custname.on("action", evt => console.log("action", evt));
  custname.on("init", evt => console.log("init", evt));
  custname.init();

  let search=zn.ui.components.textfield.create({
    name: "name",
    target: ".searchfield",
    placeholder: "search here",
    icon: "fas fa-search"
  });
  search.on("change", evt => console.log("change", evt));
  search.on("action", evt => console.log("action", evt));
  search.on("init", evt => console.log("init", evt));
  search.init();

  let useridfield=zn.ui.components.textfield.create({
    name: "name",
    target: ".useridfield",
    placeholder: "User ID",
    icon: "fas fa-user-tie"
  });
  useridfield.on("change", evt => console.log("change", evt));
  useridfield.on("action", evt => console.log("action", evt));
  useridfield.on("init", evt => console.log("init", evt));
  useridfield.init();

  let passwordfield=zn.ui.components.textfield.create({
    name: "pwd",
    target: ".passwordfield",
    password: true,
    placeholder: "Password",
    icon: "fas fa-lock"
  });
  passwordfield.on("change", evt => console.log("change", evt));
  passwordfield.on("action", evt => console.log("action", evt));
  passwordfield.on("init", evt => console.log("init", evt));
  passwordfield.init();

  let textarea=zn.ui.components.textarea.create({
    name: "descr",
    target: ".textarea",
    label: "Description",
    value: "This is a test description"
  });
  textarea.on("change", evt => console.log("change", evt));
  textarea.on("init", evt => console.log("init", evt));
  textarea.init();

  let dropdownfield=zn.ui.components.dropdownfield.create({
    name: "choices",
    target: ".dropdownfield",
    label: "Network Type",
    value: "SOL",
    items: 
    [
      {value: "PAN", label: "Personal Area Network"},
      {value: "LAN", label: "Local Area Network"},
      {value: "WLAN", label: "Wireless Local Area Network"},
      {value: "CAN", label: "Campus Area Network"},
      {value: "MAN", label: "Metropolitan Area Network"},
      {value: "WAN", label: "Wide Area Network"}
    ]
  });
  dropdownfield.on("change", evt => console.log("change", evt));
  dropdownfield.on("action", evt => console.log("action", evt));
  dropdownfield.on("init", evt => console.log("init", evt));
  dropdownfield.init();

  let checkboxfield=zn.ui.components.checkboxfield.create({
    name: "choices",
    target: ".checkboxfield",
    value: false,
    text: "This is a test checkbox",
    //values: {on: "Yes", off: "No"}
  });
  checkboxfield.on("change", evt => console.log("change", evt));
  checkboxfield.on("action", evt => console.log("action", evt));
  checkboxfield.on("init", evt => console.log("init", evt));
  checkboxfield.init();
  
  let radiogroup=zn.ui.components.radiogroup.create({
    name: "choices",
    target: ".radiogroup",
    label: "Network Options",
    value: "EST",
    items: 
    [
      {value: "PAN", label: "Personal Area Network"},
      {value: "LAN", label: "Local Area Network"},
      {value: "WLAN", label: "Wireless Local Area Network"},
      {value: "CAN", label: "Campus Area Network"},
      {value: "MAN", label: "Metropolitan Area Network"},
      {value: "WAN", label: "Wide Area Network"}
    ]
  });
  radiogroup.on("change", evt => console.log("change", evt));
  radiogroup.on("action", evt => console.log("action", evt));
  radiogroup.on("init", evt => console.log("init", evt));
  radiogroup.init();

  for(let i=1;i<=3;i++)
  {
    let calendar=zn.ui.components.calendar.create({
      name: "calendar-"+i,
      target: ".calendar-"+i,
      date: new Date()
    });
    calendar.on("date-select", evt => console.log("date-select", evt));
    calendar.on("init", evt => console.log("init", evt));
    calendar.init();
  }
  zn.ui.components.calendar.get("calendar-3").on("date-select", (evt)=>zn.ui.components.popup.hide());
  let datefield=zn.ui.components.datefield.create({
      name: "name",
      target: ".datefield",
      label: "Start Date",
      value: new Date(),
      format: "MM/DD/YYYY",
  });
  datefield.on("change", evt => console.log("change", evt));
  datefield.on("action", evt => console.log("action", evt));
  datefield.on("init", evt => console.log("init", evt));
  datefield.init();  

  let button1=zn.ui.components.button.create({
    name: "b1",
    target: ".button-1",
    text: "Add Calendar",
    action: "add-calendar",
    icon: "far fa-calendar-plus"
  });
  button1.on("action", evt => console.log("action", evt));
  button1.on("init", evt => console.log("init", evt));
  button1.init();

  let button2=zn.ui.components.button.create({
    name: "b2",
    target: ".button-2",
    text: "Bookmark",
    action: "bookmark",
    icon: "fas fa-bookmark"
  });
  button2.on("action", evt => console.log("action", evt));
  button2.on("init", evt => console.log("init", evt));
  button2.init();

  let button3=zn.ui.components.button.create({
    name: "b3",
    target: ".button-3",
    text: "Delete",
    action: "delete",
    icon: "fas fa-trash",
    type: "critical"
  });
  button3.on("action", evt => console.log("action", evt));
  button3.on("init", evt => console.log("init", evt));
  button3.init();

  let button4=zn.ui.components.button.create({
    name: "b4",
    target: ".button-4",
    text: "Reresh",
    action: "refresh",
    icon: "fas fa-sync-alt",
    type: "warning"
  });
  button4.on("action", evt => console.log("action", evt));
  button4.on("init", evt => console.log("init", evt));
  button4.init();

  zn.ui.components.popup.create({
    name: "popup-cal",
    target: ".popup",
    source: ".button-5",
    showAt: "right"
  });

  let button5=zn.ui.components.button.create({
    name: "b4",
    target: ".button-5",
    text: "Show Calendar",
    action: "show-cal"
  });
  button5.on("action", (evt)=>
  {
    zn.ui.components.popup.get("popup-cal").show();
  });
  button5.on("init", evt => console.log("init", evt));
  button5.init();

  let dialog=zn.ui.components.dialog.create({
    name: "dialog-cal",
    target: ".dialog-cal",
    centered: true,
    title: "Select Start Date",
    actions:
    [
      {action: "ok", label: "OK", icon: "fas fa-trash-alt", autohide: false}, 
      {action: "cancel", label: "Cancel"}, 
      {action: "clear", label: "Clear", slot: "left", icon: "fas fa-bug"}
    ]
  }).init();
  dialog.on("action", (evt)=>
  {
    if(evt.action=="ok")
    {
      console.log("selected date");
      dialog.hide();
    }
  });

  let dialogcal=zn.ui.components.calendar.create({
    name: "calendar-"+4,
    target: ".calendar-"+4,
    date: new Date()
  });
  dialogcal.on("date-select", evt => console.log("date-select", evt));
  dialogcal.on("init", evt => console.log("init", evt));
  dialogcal.init();

  let button6=zn.ui.components.button.create({
    name: "b6",
    target: ".button-6",
    text: "Show Calendar Dialog",
    action: "show-cal-dialog"
  });

  button6.on("action", (evt)=>
  {
    zn.ui.components.dialog.get("dialog-cal").show();
  });
  button6.on("init", evt => console.log("init", evt));
  button6.init();


})

