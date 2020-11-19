$(()=>
{
  let $ctrl=$("[ng-controller='ctrl']");

  let module=angular.module("test-surface", []);
  module.controller("ctrl", [ "$scope", function($scope){}]);
  console.log(zn.designer);
  module.directive(zn.designer.ng.surface.tag, zn.designer.ng.surface.factory);
  module.directive(zn.ui.components.ng.button.tag, zn.ui.components.ng.button.factory);

  angular.bootstrap($ctrl,["test-surface"]);


  let shapeCount=0;
  let shapeAction=null;

  $scope = angular.element($ctrl).scope();
  $scope.actions={};

  $scope.actions['add-invoke']=(evt)=>
  {
    let surface=zn.designer.surface.get("surface");
    let ctx={name: "shape-"+(shapeCount++), text: "Invoke"};
    surface.addShape("rectangle", {x: evt.x - 50, y: evt.y - 25, width: 100, height: 50}, ctx);
  }

  $scope.actions["add-receive"]=(evt)=>
  {
    let surface=zn.designer.surface.get("surface");
    let ctx={name: "shape-"+(shapeCount++), text: "Receive"};
    surface.addShape("ellipse", {x: evt.x - 35, y: evt.y - 35, width: 70, height: 70}, ctx);
  }

  $scope.actions["add-return"]=(evt)=>
  {
    let surface=zn.designer.surface.get("surface");
    let ctx={name: "shape-"+(shapeCount++), text: "Return"};
    surface.addShape("ellipse", {x: evt.x - 35, y: evt.y - 35, width: 70, height: 70}, ctx);
  }

  $scope.actions["add-assign"]=(evt)=>
  {
    let surface=zn.designer.surface.get("surface");
    let ctx={name: "shape-"+(shapeCount++), text: "Assign"};
    surface.addShape("pill", {x: evt.x - 50, y: evt.y - 20, width: 100, height: 40}, ctx);
  }

  $scope.actions["add-check"]=(evt)=>
  {
    let surface=zn.designer.surface.get("surface");
    let ctx={name: "shape-"+(shapeCount++), text: "Check"};
    surface.addShape("diamond", {x: evt.x - 45, y: evt.y - 45, width: 90, height: 90}, ctx);
  }

  $scope.actions["add-var-person"]=(evt)=>
  {
    let surface=zn.designer.surface.get("surface");
    let list=
    [
      {text: "ID"}, {text: "Name"},
      {text: "Address", $list: [{text: "Street"}, {text: "City"}, {text: "State"}, {text: "ZipCode"}]},
      {text: "Contact Details", $list: [{text: "Home Phone"}, {text: "Office"}, {text: "Mobile Phone"}, {text: "EMail ID"}]}
    ];
    let ctx={name: "shape-"+(shapeCount++), text: "PERSON", list: list};
    surface.addShape("list", {x: evt.x, y: evt.y, width: 150, height: 40}, ctx);
  }

  $scope.actions["add-var-address"]=(evt)=>
  {
    let surface=zn.designer.surface.get("surface");
    let list=[{text: "Street"}, {text: "City"}, {text: "State"}, {text: "ZipCode"}];
    let ctx={name: "shape-"+(shapeCount++), text: "ADDRESS", list: list};
    surface.addShape("list", {x: evt.x, y: evt.y, width: 150, height: 40}, ctx);
  }

  $scope.actions["add-var-contact"]=(evt)=>
  {
    let surface=zn.designer.surface.get("surface");
    let list=[{text: "Home Phone"}, {text: "Office"}, {text: "Mobile Phone"}, {text: "EMail ID"}];
    let ctx={name: "shape-"+(shapeCount++), text: "CONTACT", list: list};
    surface.addShape("list", {x: evt.x, y: evt.y, width: 150, height: 40}, ctx);
  }

  $scope.actions.addShape=($event)=>
  {
    let surface=zn.designer.surface.get("surface");
    shapeAction=$event.action;
    surface.setMode("position");
  }

  $scope.actions.onPosition=($event)=>$scope.actions[shapeAction]($event);

  $scope.actions.dump=($event)=>console.log($event);

  $scope.actions.exportToJson=()=>
  {
    let surface=zn.designer.surface.get("surface");
    console.log(surface.exportToJson());
  }

  $scope.actions.importFromJson=()=>
  {
    let surface=zn.designer.surface.get("surface");
    surface.importFromJson($(".import-data").html());
  }

  $scope.$apply();
})

