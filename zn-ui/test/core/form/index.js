$(()=>
{
  let custname=zn.ui.textfield.create({
      name: "name",
      target: ".textfield",
      label: "Customer Name",
      value: "initial value"
  });
  custname.on("change", evt => console.log("change", evt));
  custname.on("action", evt => console.log("action", evt));
  custname.on("init", evt => console.log("init", evt));
  custname.init();

  let search=zn.ui.textfield.create({
    name: "name",
    target: ".searchfield",
    placeholder: "search here",
    icon: "fas fa-search"
  });
  search.on("change", evt => console.log("change", evt));
  search.on("action", evt => console.log("action", evt));
  search.on("init", evt => console.log("init", evt));
  search.init();

  let useridfield=zn.ui.textfield.create({
    name: "name",
    target: ".useridfield",
    placeholder: "User ID",
    icon: "fas fa-user-tie"
  });
  useridfield.on("change", evt => console.log("change", evt));
  useridfield.on("action", evt => console.log("action", evt));
  useridfield.on("init", evt => console.log("init", evt));
  useridfield.init();

  let passwordfield=zn.ui.textfield.create({
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

  let textarea=zn.ui.textarea.create({
    name: "descr",
    target: ".textarea",
    label: "Description",
    value: "This is a test description"
  });
  textarea.on("change", evt => console.log("change", evt));
  textarea.on("init", evt => console.log("init", evt));
  textarea.init();

  let dropdownfield=zn.ui.dropdownfield.create({
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

  let checkboxfield=zn.ui.checkboxfield.create({
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
  
  let radiogroup=zn.ui.radiogroup.create({
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

  for(let i=1;i<=2;i++)
  {
    let calendar=zn.ui.calendar.create({
      name: "calendar-"+i,
      target: ".calendar-"+i,
      date: new Date()
    });
    calendar.on("date-select", evt => console.log("date-select", evt));
    calendar.on("init", evt => console.log("init", evt));
    calendar.init();
  }

  let datefield=zn.ui.datefield.create({
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

  let button1=zn.ui.button.create({
    name: "b1",
    target: ".button-1",
    text: "Add Calendar",
    action: "add-calendar",
    icon: "far fa-calendar-plus"
  });
  button1.on("action", evt => console.log("action", evt));
  button1.on("init", evt => console.log("init", evt));
  button1.init();

  let button2=zn.ui.button.create({
    name: "b2",
    target: ".button-2",
    text: "Bookmark",
    action: "bookmark",
    icon: "fas fa-bookmark"
  });
  button2.on("action", evt => console.log("action", evt));
  button2.on("init", evt => console.log("init", evt));
  button2.init();

  let button3=zn.ui.button.create({
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

  let button4=zn.ui.button.create({
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

})

