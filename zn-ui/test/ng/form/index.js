$(()=>
{
  
  let $ctrl=$("[controller='ctrl']");

  let module=angular.module("test-form", []);
  module.controller("ctrl", [ "$scope", function($scope){}]);
  module.directive(zn.ui.components.ng.textfield.tag, zn.ui.components.ng.textfield.factory);
  module.directive(zn.ui.components.ng.textarea.tag, zn.ui.components.ng.textarea.factory);
  module.directive(zn.ui.components.ng.button.tag, zn.ui.components.ng.button.factory);
  module.directive(zn.ui.components.ng.calendar.tag, zn.ui.components.ng.calendar.factory);
  module.directive(zn.ui.components.ng.checkboxfield.tag, zn.ui.components.ng.checkboxfield.factory);
  module.directive(zn.ui.components.ng.datefield.tag, zn.ui.components.ng.datefield.factory);
  module.directive(zn.ui.components.ng.dropdownfield.tag, zn.ui.components.ng.dropdownfield.factory);
  module.directive(zn.ui.components.ng.radiogroup.tag, zn.ui.components.ng.radiogroup.factory);
  module.directive(zn.ui.components.ng.popup.tag, zn.ui.components.ng.popup.factory);
  module.directive(zn.ui.components.ng.dialog.tag, zn.ui.components.ng.dialog.factory);
  module.directive(zn.ui.components.ng.draggable.tag, zn.ui.components.ng.draggable.factory);

  angular.bootstrap($ctrl,["test-form"]);


  let model=
  {
    form: 
    {
      name: "Abraham",
      descr: "",
      startDate: new Date(),
      endDate: new Date(),
      agreement: "Y",
      network: "CAN",
      networkOpt: "CAN"
    },
    networkItems: 
    [
      {value: "PAN", label: "Personal Area Network"},
      {value: "LAN", label: "Local Area Network"},
      {value: "WLAN", label: "Wireless Local Area Network"},
      {value: "CAN", label: "Campus Area Network"},
      {value: "MAN", label: "Metropolitan Area Network"},
      {value: "WAN", label: "Wide Area Network"}
    ],
    dialogActions:
    [
      {action: "ok", label: "OK", icon: "fas fa-trash-alt", autohide: false}, 
      {action: "cancel", label: "Cancel"}, 
      {action: "clear", label: "Clear", slot: "left", icon: "fas fa-bug"}
    ],
    validation:
    {
      name: ""
    },

    editContact:
    {
      firstName: "John",
      lastName: "Doe",
      designation: "Sr. Architect",
      phoneType: "HOME",
      phoneNumber: "1235567890",
      notes: "",
      addressLine: "221 B, Bakers Street",
      area: "Noth Hill",
      city: "Newyork City",
      state: "New York",
      pincode: "5551100"
    },

    editActions:
    [
      {action: "save", label: "Save", autohide: false}, 
      {action: "cancel", label: "Cancel"}
    ],

    phoneTypes:
    [
      {value: "HOME", label: "Home"},
      {value: "WORK", label: "Work"},
      {value: "MOBILE", label: "Mobile"}      
    ]
  }

  $scope = angular.element($ctrl).scope();
  $scope.model=model;

  $scope.dump=function(m)
  {
    console.log("current form", JSON.parse(JSON.stringify(m)));
    console.log("modifying form")
    m.form.name="Abraham Lincoln";
    m.form.descr="This is a sample description";
    m.form.agreement="Y";
    m.form.startDate=new Date();
    m.form.endDate=new Date();
    m.form.activeOn=new Date();
    m.form.network="CAN";
    m.form.networkOpt="CAN";
    m.validation.name="This is an error value";
    $scope.$apply();
  }

  $scope.showCalendarPopup=function()
  {
    let $b=$(".button-6");
    let pos=$b.position();
    let showAt={x: pos.left, y: pos.top + $b.get()[0].offsetHeight + 3};

    zn.ui.components.Popup.get("popup-cal").show();
  }

  $scope.showCalendarDialog=function()
  {
    zn.ui.components.Dialog.get("dialog-cal").show();
  }

  $scope.onDateSelect=function($event)
  {
    if($event.source.name=="calendar-3")
    {
      console.log($event.date);
      zn.ui.components.Popup.get("popup-cal").hide();
    }

    if($event.source.name=="calendar-4")
    {
      console.log($event.date);
      zn.ui.components.Dialog.get("dialog-cal").hide();
    }
  }

  $scope.onDialogAction=function($event)
  {
    //console.log($event);
    if($event.action=="ok") zn.ui.components.dialog.get("dialog-cal").hide();
  }

  $scope.showFormDialog=function()
  {
    zn.ui.components.Dialog.get("edit-contact-dialog").show();
  }

  $scope.onEditContactDialogAction=function($event)
  {
    console.log(model.editContact);
    $event.source.hide();
  }

  $scope.dragStart=function($event)
  {
    //console.log('ds', $event);
  }

  $scope.dragMove=function($event)
  {
    //console.log('dm', $event);
  }

  $scope.dragEnd=function($event)
  {
    //console.log('de', $event);
  }

  $scope.$apply();
  
})


