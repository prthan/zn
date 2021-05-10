$(()=>
{
  let annotator=new zn.ui.components.Annotator({
      name: "sample",
      target: ".annotation-area",
      phrase: "I'll be flying from Berlin to San Francisco, taking the bus afterwards to Dunedin"
  });
  //I'll be flying from [Berlin]{"entity": "city", "role": "from"} to [San Francisco]{"entity": "city", "role": "to"}, taking the bus afterwards to [Dunedin]{"entity": "city", "role": "to"}
  annotator.on("change", evt => console.log("change", evt));
  annotator.on("action", evt => console.log("action", evt));
  annotator.on("init", evt => console.log("init", evt));
  annotator.init();

  $(".add-annotation").click((evt)=>
  {
    evt.preventDefault();
    let selection=annotator.getSelection();
    if(selection!=null && selection.length>0)
    {
      annotator.addAnnotation(selection[0], selection[1], $(".annotation-text").val())
    }
  })
})

