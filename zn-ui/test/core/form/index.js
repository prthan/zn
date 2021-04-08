$(()=>
{
  let custname=new zn.ui.components.TextField({
      name: "name",
      target: ".textfield",
      label: "Customer Name",
      value: "initial value"
  });
  custname.on("change", evt => console.log("change", evt));
  custname.on("action", evt => console.log("action", evt));
  custname.on("init", evt => console.log("init", evt));
  custname.init();

  let search=new zn.ui.components.TextField({
    name: "name",
    target: ".searchfield",
    placeholder: "search here",
    icon: "fas fa-search"
  });
  search.on("change", evt => console.log("change", evt));
  search.on("action", evt => console.log("action", evt));
  search.on("init", evt => console.log("init", evt));
  search.init();

  let useridfield=new zn.ui.components.TextField({
    name: "name",
    target: ".useridfield",
    placeholder: "User ID",
    icon: "fas fa-user-tie"
  });
  useridfield.on("change", evt => console.log("change", evt));
  useridfield.on("action", evt => console.log("action", evt));
  useridfield.on("init", evt => console.log("init", evt));
  useridfield.init();

  let passwordfield=new zn.ui.components.TextField({
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

  let textarea=new zn.ui.components.TextArea({
    name: "descr",
    target: ".textarea",
    label: "Description",
    value: "This is a test description"
  });
  textarea.on("change", evt => console.log("change", evt));
  textarea.on("init", evt => console.log("init", evt));
  textarea.init();

  let dropdownfield=new zn.ui.components.DropdownField({
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

  let checkboxfield=new zn.ui.components.CheckboxField({
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
  
  let radiogroup=new zn.ui.components.RadioGroup({
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
    let calendar=new zn.ui.components.Calendar({
      name: "calendar-"+i,
      target: ".calendar-"+i,
      date: new Date()
    });
    calendar.on("date-select", evt => console.log("date-select", evt));
    calendar.on("init", evt => console.log("init", evt));
    calendar.init();
  }
  zn.ui.components.Calendar.get("calendar-3").on("date-select", (evt)=>zn.ui.components.Popup.hide());
  let datefield=new zn.ui.components.DateField({
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

  let button1=new zn.ui.components.Button({
    name: "b1",
    target: ".button-1",
    text: "Add Calendar",
    action: "add-calendar",
    icon: "far fa-calendar-plus"
  });
  button1.on("action", evt => console.log("action", evt));
  button1.on("init", evt => console.log("init", evt));
  button1.init();

  let button2=new zn.ui.components.Button({
    name: "b2",
    target: ".button-2",
    text: "Bookmark",
    action: "bookmark",
    icon: "fas fa-bookmark"
  });
  button2.on("action", evt => console.log("action", evt));
  button2.on("init", evt => console.log("init", evt));
  button2.init();

  let button3=new zn.ui.components.Button({
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

  let button4=new zn.ui.components.Button({
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

  new zn.ui.components.Popup({
    name: "popup-cal",
    target: ".popup",
    source: ".button-5",
    showAt: "right"
  }).init();

  let button5=new zn.ui.components.Button({
    name: "b4",
    target: ".button-5",
    text: "Show Calendar",
    action: "show-cal"
  });
  button5.on("action", (evt)=>
  {
    zn.ui.components.Popup.get("popup-cal").show();
  });
  button5.on("init", evt => console.log("init", evt));
  button5.init();

  let dialog=new zn.ui.components.Dialog({
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
  });
  dialog.init();
  dialog.on("action", (evt)=>
  {
    if(evt.action=="ok")
    {
      console.log("selected date");
      dialog.hide();
    }
  });

  let dialogcal=new zn.ui.components.Calendar({
    name: "calendar-"+4,
    target: ".calendar-"+4,
    date: new Date()
  });
  dialogcal.on("date-select", evt => console.log("date-select", evt));
  dialogcal.on("init", evt => console.log("init", evt));
  dialogcal.init();

  let button6=new zn.ui.components.Button({
    name: "b6",
    target: ".button-6",
    text: "Show Calendar Dialog",
    action: "show-cal-dialog"
  });

  button6.on("action", (evt)=>
  {
    zn.ui.components.Dialog.get("dialog-cal").show();
  });
  button6.on("init", evt => console.log("init", evt));
  button6.init();

  let draggablecal=new zn.ui.components.Calendar({
    name: "calendar-5",
    target: ".calendar-5",
    date: new Date()
  });
  draggablecal.on("date-select", evt => console.log("date-select", evt));
  draggablecal.on("init", evt => console.log("init", evt));
  draggablecal.init();

  let draggable=new zn.ui.components.Draggable({
    target: ".drag-handle",
    updateTarget: ".draggable-calendar",
  });
  draggable.on("dragstart", evt => console.log("dragstart", evt));
  draggable.on("dragmove", evt => console.log("dragmove", evt));
  draggable.on("dragend", evt => console.log("dragend", evt));
  draggable.init();

  zn.ui.Toast("Added row successfully", "fas fa-broadcast-tower");
  window.setTimeout(()=>zn.ui.Toast("This is a test This is a test This is a test ", "fas fa-broadcast-tower"), 1000);
  window.setTimeout(()=>zn.ui.Toast("test This is a test ", "fas fa-broadcast-tower"), 2000);
})

