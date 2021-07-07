var IntervalID = 0,
    ID = 0;
    windowWidth = window.innerWidth;
    SumOfItemsDuration = [];
    SumOfItems = SumOfItemsDuration.length;
    MeetingDuration = [];
    SumMinutesOfAllItems = [];
    count = 0;
    TotalDuration = 0;
    //InitaialSum = 0;


//------------------------------------------------------------------------------
//
//  Return the next Task ID to be used in the task chiclet DIV.
//
//------------------------------------------------------------------------------
function NextTaskID( )
{
    return ( ID++ );
}

//------------------------------------------------------------------------------
//
//  Retrieve the TaskArr JSON string from DOM storage, convert it into a
//  JavaScript object, and return it.  If there is no TaskArr in DOM storage,
//  return an empty JavaScript object.
//
//------------------------------------------------------------------------------
function RetrieveTaskArr( )
{
    var TaskArr_JSON = '',
        TaskArr = {};

    if ( localStorage.getItem('TaskArr') )
    {
        TaskArr_JSON = localStorage.getItem('TaskArr');
        TaskArr      = JSON.parse(TaskArr_JSON);
    }

    return ( TaskArr );

} // RetrieveTaskArr


//------------------------------------------------------------------------------
//
//  Convert the TaskArr to JSON and save it to local DOM storage.
//
//------------------------------------------------------------------------------
function SaveTaskArr( TaskArr )
{
    var TaskArr_JSON = JSON.stringify(TaskArr);

    localStorage.setItem('TaskArr', TaskArr_JSON);

} // SaveTaskArr


//------------------------------------------------------------------------------
//
//  A linear search through the task array.  Return true if any task's name
//  matches the give TaskName. Otherwise, return false.
//
//------------------------------------------------------------------------------
function TaskAlreadyExistsinArr( TaskArr, TaskName )
{
    for ( var Task in TaskArr )
    {
        if ( TaskArr[Task].Name == TaskName )
        {
            return ( true );
        }
    }
    return ( false );
} // TaskAlreadyExistsinArr



//------------------------------------------------------------------------------
//
//  Remove a task from the DOM and from local DOM storage.
//
//------------------------------------------------------------------------------
function RemoveTask( event )
{
    var $this     = $(this),
        DivID     = $this.attr('id'),
        TaskArr   = RetrieveTaskArr(),
        TaskDelim = DivID.indexOf('_'),
        TaskID    = DivID.substring(0, TaskDelim),
        SavedTotalDuration;

    //Remove Item Duration from Total
    SavedTotalDuration = parseInt(localStorage.getItem( 'GLOBALTotalDuration'));
    SavedTotalDuration = (SavedTotalDuration - parseInt(TaskArr[TaskID].Duration));

    localStorage.setItem( 'GLOBALTotalDuration', SavedTotalDuration);
    console.log("Amount of duration: " + localStorage.GLOBALTotalDuration);

    //Substract ID from GLOBAL
    ID--;

    //  Remove the Task from DOM storage.
    delete TaskArr[TaskID];
    SaveTaskArr( TaskArr );

    if ( localStorage.CurrentTaskID == TaskID )
    {
        //  If the task we're removing is the CurrentTaskID,
        //  stop the timer and clear the related IntervalID.
        clearInterval( IntervalID );
        IntervalID = 0;
        localStorage.setItem( 'CurrentTaskID', -1 );
    }

    //  By removing the parent DIV, we remove the entire task from the DOM.
    $this.parent().parent().remove();

} // RemoveTask


//------------------------------------------------------------------------------
//
//  Via CSS, highlight the task chiclet currently under the curser.
//
//------------------------------------------------------------------------------
function MouseEnterTask( event )
{
    var $this       = $(this),
        DivID       = $this.attr('id'),
        TaskArr,
        TaskDelim   = DivID.indexOf('_'),
        TaskID      = DivID.substring(0, TaskDelim),
        MainTaskDiv = $this.find( '.task_div' );

    if ( MainTaskDiv.hasClass('task_inactive') )
    {
        MainTaskDiv.removeClass( 'task_inactive' )
                   .addClass( 'task_mouseover' );

    }
    else if ( MainTaskDiv.hasClass('task_current') )
    {
        MainTaskDiv.removeClass( 'task_current' )
                   .addClass( 'task_current_mouseover' );
    }

    $this.find( '#' + TaskID + '_remove' ).show();

} // MouseEnterTask


//------------------------------------------------------------------------------
//
//  Set the CSS of the task chiclet to un-highlighted.
//
//------------------------------------------------------------------------------
function MouseLeaveTask( event )
{
    var $this       = $(this),
        DivID       = $this.attr('id'),
        TaskArr,
        TaskDelim   = DivID.indexOf('_'),
        TaskID      = DivID.substring(0, TaskDelim),
        MainTaskDiv = $this.find( '.task_div' );

    if ( MainTaskDiv.hasClass('task_mouseover') )
    {
        MainTaskDiv.removeClass( 'task_mouseover' )
                   .addClass( 'task_inactive' );
    }
    else if ( MainTaskDiv.hasClass('task_current_mouseover') )
    {
        MainTaskDiv.removeClass( 'task_current_mouseover' )
                   .addClass( 'task_current' );
    }

    $this.find( '#' + TaskID + '_remove' ).hide();

} // MouseLeaveTask


//------------------------------------------------------------------------------
//
//  Add a task to the TaskArr in local DOM storage and to the DOM.
//
//------------------------------------------------------------------------------
function AddTask( TaskID, Task )
{
    var CloseButtonDiv,
		//DropDiv,
        MainTaskDiv,
        Now,
        TaskDiv,
        TaskArr_JSON,
        SavedTotalDuration,
        TaskArr = RetrieveTaskArr();

    //  If we haven't yet run across this task, save it into local DOM
    //  storage.
    //  Note:  the task may be in local DOM storage from a previous page
    //  instance even though it's not in the DOM.
    if ( !(TaskID in TaskArr) )
    {
        TaskArr[TaskID] = Task;
        SaveTaskArr( TaskArr );
    }

    SavedTotalDuration = parseInt(localStorage.getItem( 'GLOBALTotalDuration'));

    //  Create the task chiclet.
    MainTaskDiv = $( '<div id="' + TaskID + '_main"' +
                     'class="main_task_div"'  +
                     'task-id="' + TaskID + '"style="width: '+ ((1444/SavedTotalDuration)/1444)*100*(TaskArr[TaskID].Duration) +'%;"> </div>' );
    //if TaskDuration1
    //(TaskArr[TaskID].Duration)*1.66
    //


                     // 'task-id="' + TaskID + '"'  +
                     // 'draggable="true"></div>' );
    CloseButtonDiv = $( '<div id="' + TaskID + '_remove"' +
                     'class="close_task_div_inactive">&times;</div>' );
    TaskDiv = $( '<div id="' + TaskID + '" class="task_div task_inactive">' +
                     '<div id="' + TaskID + '_itemname">'              +
                          Task.Name       +
                     '</div>'             +
                     //'<div id="' + TaskID + '_duration">' +
                          //Task.Duration   +
                     //'</div>'             +
                 '</div>' );
	//DropDiv = $( '<div id="' + TaskID + '_drop" class="drop_target"></div>' );
    //MainTaskDiv.append( CloseButtonDiv );
    TaskDiv.append( CloseButtonDiv );
    MainTaskDiv.append( TaskDiv );
	  //TaskDiv.append( DropDiv );
  console.log(document.getElementById(AgendaItemList));

    //
    //  Add click handlers.
    // CloseButtonDiv.hide();
    CloseButtonDiv.click( RemoveTask );

    //
    //  Add combo MouseEnter and MouseLeave handler.
    MainTaskDiv.hover( MouseEnterTask, MouseLeaveTask )
               .on( 'dragstart', function(event) {
        //
        // Upon dragstart, save away the TaskID. This will be used to identify
        // which task chiclet to move upon drop.
        event.originalEvent.dataTransfer.setData( 'application/x-taskid',
                                                  $(this).data('taskid') );
    });


    //  Add to the DOM.
    $( '#AgendaItemList' ).append( MainTaskDiv );

    // if((parseInt(TaskID)%2)==1){
    //
    // }

} // AddTask
//
//
//
// //------------------------------------------------------------------------------
// //
// //  Submit handler for task submission form at top of page.
// //
// //------------------------------------------------------------------------------
//  function SubmitTask( event )
// {
//     var //FormTextField = $( '#Form_TaskName' ),
//         //FormNumberField = $( '#Form_TaskDuration'),
//         FormTextField = $( '#agendaTopicInput1' ),
//         FormNumberField = $( '#agendaTimeInput1'),
//         TaskArr,
//         TaskName   = FormTextField.val(),
//         TaskDuration   = FormNumberField.val(),
//         TaskID     = -1;
//
//
//         SumOfItemsDuration.push(TaskDuration);
//         console.log("Item Duration " + TaskDuration);
//
//
//     event.preventDefault();
//     event.stopPropagation();
//
//     //  Clear the form's fields.
//     FormTextField.val( '' );
//     FormNumberField.val('');
//
//     // if ( TaskName.length > 0 || TaskDuration > 0 )
//     if ( TaskName.length && TaskDuration > 0 )
//     {
//         //
//         //  Retrieve the TaskArr from local DOM storage and check whether this
//         //  task already exists.
//         TaskArr = RetrieveTaskArr();
//
//         TaskExists = TaskAlreadyExistsinArr( TaskArr, TaskName, TaskDuration);
//         if ( ! TaskExists )
//         {
//             //
//             //  Add the task to local DOM storage and to the DOM.
//             TaskID = NextTaskID();
//             AddTask( TaskID,
//                       { 'Name'          : TaskName,
//                         // 'Timestamp'     : TaskDuration,
//                         'Duration'     : TaskDuration + " min" ,
//                         'TaskActive'    : false } );
//
//         }
//         else
//         {
//             //
//             //  Let the user know that this task already exists.
//             alert( 'That agenda item already exists!' );
//         }
//
//     }
//
//     else
//     {
//         //
//         //  Let the user know that this task already exists.
//         alert( 'You need to fill both fields!' );
//     }
//
//     // End if ( TaskName.length > 0 )
//
//     return ( TaskID );
//
// } // SubmitTask

//------------------------------------------------------------------------------
//
// Sums the items in an array
//
//------------------------------------------------------------------------------
function SubmitTask( event )
{
    var //FormTextField = $( '#Form_TaskName' ),
        //FormNumberField = $( '#Form_TaskDuration'),
        FormTextField1 = $( '#agendaTopicInput1' ),
        FormNumberField1 = $( '#agendaTimeInput1'),
        FormTextField2 = $( '#agendaTopicInput2' ),
        FormNumberField2 = $( '#agendaTimeInput2'),
        FormTextField3 = $( '#agendaTopicInput3' ),
        FormNumberField3 = $( '#agendaTimeInput3'),
        FormTextField4 = $( '#agendaTopicInput4' ),
        FormNumberField4 = $( '#agendaTimeInput4'),
        TaskArr,
        TaskName1   = FormTextField1.val(),
        TaskDuration1   = FormNumberField1.val(),
        TaskName2   = FormTextField2.val(),
        TaskDuration2   = FormNumberField2.val(),
        TaskName3   = FormTextField3.val(),
        TaskDuration3   = FormNumberField3.val(),
        TaskName4   = FormTextField4.val(),
        TaskDuration4   = FormNumberField4.val(),
        //TotalDuration = 0;
        SavedTotalDuration,
        TaskID     = -1;


        SumOfItemsDuration.push(TaskDuration1);
        console.log("Item Duration " + TaskDuration1);
        SumOfItemsDuration.push(TaskDuration2);
        console.log("Item Duration " + TaskDuration2);
        SumOfItemsDuration.push(TaskDuration3);
        console.log("Item Duration " + TaskDuration3);
        SumOfItemsDuration.push(TaskDuration4);
        console.log("Item Duration " + TaskDuration4);

    //if (! localStorage.GLOBALTotalDuration ){
    if (isNaN(localStorage.GLOBALTotalDuration )){
      localStorage.setItem( 'GLOBALTotalDuration', TotalDuration);
      }
    SavedTotalDuration = parseInt(localStorage.getItem( 'GLOBALTotalDuration'));

    SavedTotalDuration = (SavedTotalDuration + parseInt(TaskDuration1) +
    parseInt(TaskDuration2) + parseInt(TaskDuration3) +
    parseInt(TaskDuration4));
    console.log("Total Duration " + TotalDuration);

    localStorage.setItem( 'GLOBALTotalDuration', SavedTotalDuration);
    console.log("Amount of duration: " + localStorage.GLOBALTotalDuration);

    event.preventDefault();
    event.stopPropagation();

    //  Clear the form's fields.
    FormTextField1.val( '' );
    FormNumberField1.val('');
    FormTextField2.val( '' );
    FormNumberField2.val('');
    FormTextField3.val( '' );
    FormNumberField3.val('');
    FormTextField4.val( '' );
    FormNumberField4.val('');

    // if ( TaskName.length > 0 || TaskDuration > 0 )
    if ( TaskName1.length && TaskDuration1 > 0 )
    {
        //  Retrieve the TaskArr from local DOM storage and check whether this
        //  task already exists.
        TaskArr = RetrieveTaskArr();

        TaskExists = TaskAlreadyExistsinArr( TaskArr, TaskName1, TaskDuration1);
        if ( ! TaskExists )
        {
            //
            //  Add the task to local DOM storage and to the DOM.
            TaskID = NextTaskID();
            //SavedTotalDuration = SavedTotalDuration + parseInt(TaskDuration1);
            AddTask( TaskID,
                      { 'Name'          : TaskName1,
                        // 'Timestamp'     : TaskDuration,
                        'Duration'     : TaskDuration1,
                        'TaskActive'    : false } );
        }
        else
        {//  Let the user know that this task already exists.
            alert( 'That agenda item 1 already exists!' ); }
    }
    else
    {//  Let the user know that this task already exists.
        alert( 'The fields from the Agenda Item 1 are incomplete' );}
    // End if ( TaskName.length > 0 )

    if ( TaskName2.length && TaskDuration2 > 0 )
    {
        //  Retrieve the TaskArr from local DOM storage and check whether this
        //  task already exists.
        TaskArr = RetrieveTaskArr();

        TaskExists = TaskAlreadyExistsinArr( TaskArr, TaskName2, TaskDuration2);
        if ( ! TaskExists )
        {
            //
            //  Add the task to local DOM storage and to the DOM.
            TaskID = NextTaskID();
            //SavedTotalDuration = SavedTotalDuration + parseInt(TaskDuration2);
            AddTask( TaskID,
                      { 'Name'          : TaskName2,
                        // 'Timestamp'     : TaskDuration,
                        'Duration'     : TaskDuration2,
                        'TaskActive'    : false } );
        }
        else
        {//  Let the user know that this task already exists.
            alert( 'That agenda item 2 already exists!' ); }
    }
    else
    {//  Let the user know that this task already exists.
        alert( 'The fields from the Agenda Item 2 are incomplete' );}
    // End if ( TaskName.length > 0 )
    if ( TaskName3.length && TaskDuration3 > 0 )
    {
        //  Retrieve the TaskArr from local DOM storage and check whether this
        //  task already exists.
        TaskArr = RetrieveTaskArr();

        TaskExists = TaskAlreadyExistsinArr( TaskArr, TaskName3, TaskDuration3);
        if ( ! TaskExists )
        {
            //
            //  Add the task to local DOM storage and to the DOM.
            TaskID = NextTaskID();
            //SavedTotalDuration = SavedTotalDuration + parseInt(TaskDuration3);
            AddTask( TaskID,
                      { 'Name'          : TaskName3,
                        // 'Timestamp'     : TaskDuration,
                        'Duration'     : TaskDuration3,
                        'TaskActive'    : false } );
        }
        else
        {//  Let the user know that this task already exists.
            alert( 'That agenda item 3 already exists!' ); }
    }
    else
    {//  Let the user know that this task already exists.
        alert( 'The fields from the Agenda Item 3 are incomplete' );}
    // End if ( TaskName.length > 0 )

    if ( TaskName4.length && TaskDuration4 > 0 )
    {
        //  Retrieve the TaskArr from local DOM storage and check whether this
        //  task already exists.
        TaskArr = RetrieveTaskArr();

        TaskExists = TaskAlreadyExistsinArr( TaskArr, TaskName4, TaskDuration4);
        if ( ! TaskExists )
        {
            //
            //  Add the task to local DOM storage and to the DOM.
            TaskID = NextTaskID();
            //SavedTotalDuration = SavedTotalDuration + parseInt(TaskDuration4);
            AddTask( TaskID,
                      { 'Name'          : TaskName4,
                        // 'Timestamp'     : TaskDuration,
                        'Duration'     : TaskDuration4,
                        'TaskActive'    : false } );
        }
        else
        {//  Let the user know that this task already exists.
            alert( 'That agenda item 4 already exists!' ); }
    }
    else
    {//  Let the user know that this task already exists.
        alert( 'The fields from the Agenda Item 4 are incomplete' );}
    // End if ( TaskName.length > 0 )

    return ( TaskID );
}




function CalculateTimeline() {
  console.log("ich funktioniere");
  console.log("Amounted items: " + SumOfItemsDuration);
  console.log("Amount of items: " + SumOfItemsDuration.length);
  console.log("Amount of duration: " + SumOfItemsDuration);


  console.log("Summe" + SumMinutesOfAllItems);

  // console.log("Summe"+SumMinutesOfAllItems);
  MeetingDuration.push(SumMinutesOfAllItems);
  function addieren(SumOfItemsDuration) {
   var erg = 0;
   for (var i = 0; i < SumOfItemsDuration.length; i++) {
     erg = erg + SumOfItemsDuration[i];
   }
   }
  addieren();

}



//------------------------------------------------------------------------------
//
//  Run once the DOM is fully built.  This is basically main().
//
//------------------------------------------------------------------------------
$(document).ready(function() {
    var TaskArr,
        TaskID,
        TaskID_int;

    localStorage.setItem( 'CurrentTaskID', -1 );
    //Restart GLOBALTotalDuration:
    //localStorage.setItem( 'GLOBALTotalDuration', 0 );
    console.log("Amount of duration: " + localStorage.GLOBALTotalDuration);

    //  Submit handler for the task form.
    //$( '#TaskForm' ).submit( SubmitTask );
    $( '#agendaForm' ).submit( SubmitTask );

    //
    //  Looks like a previous instance of this program stored some tasks in DOM
    //  storage.  Retrieve and display them.
    TaskArr = RetrieveTaskArr();
    for ( TaskID in TaskArr )
    {
        //
        //  TaskID comes from an array that's been stored in JSON format.  Every
        //  scalar has been restored from JSON back into a JavaScript string.
        //  So, parse the ID into an int.
        TaskID_int = parseInt( TaskID );

        AddTask( TaskID, TaskArr[TaskID] );
        if ( TaskID_int >= ID )
        {
            //
            //  Set the global ID to one larger than the largest Task ID that we
            //  found in in local DOM storage.
            ID = TaskID_int + 1;
        }

        // If the task was active, reactivate it via a simulated click

        if ( TaskArr[TaskID].TaskActive == true )
        {
            $( '#' + TaskID ).trigger( 'click' );
        }
    }
        var AmountOfItems = $( "#AgendaItemList" ).find('.main_task_div').length;
        // SumOfItems.push(AmountOfItems);


        //document.getElementById('1.task_div.task_inactive').style.background = "rgb(57,57,67)";


}); // $(document).ready()
