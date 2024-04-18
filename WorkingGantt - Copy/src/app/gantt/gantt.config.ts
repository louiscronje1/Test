import '../Configure/GanttToolbar.js';
import '../Columns/StatusColumn.js';
import '../Columns/CompletedColumn.js';
import '../Columns/PriorityColumn.js';
import '../Columns/TypeColumn.js'
import Task from '../Models/Task.js';

const ganttConfig = {
    dependencyIdField : 'wbsCode',
    project           : {
        stm : {
            autoRecord : true
        },
        taskStore : {
            modelClass : Task,
            autoLoad   : false,
            readUrl    : `api/DataAccess/DataGet`
        },
        resourceStore : {
            autoLoad : false,
            readUrl : `api/DataAccess/ResourcesGet`
        },
        assignmentStore : {
            autoLoad : false,
            readUrl : `api/DataAccess/AssignmentsGet`
        }
    },
    startDate : '2019-01-20',
    endDate : '2022-12-31',
    columns : [
        { type : 'wbs', text : ' ' },
        { type : 'name',text : 'Title', width : 250 },
        { 
            type : 'resourceassignment',
            text : 'Resource',
            width : 120,
            showAvatars : false,
            itemTpl : assignment => assignment.resourceName,
            editor : {
                chipView : {
                    itemTpl : assignment => assignment.resourceName
                }
            },
        },
        { type : 'startdate', text : 'Start Date' },
        { type : 'enddate', text : 'End Date' },
        { type : 'completedcolumn', width : 150, field : 'completed' },
        { type : 'typecolumn' , width : 200, text: 'Task Type' },
        { type : 'statuscolumn', field : 'status', width : 150, text: 'Task Status' },
        { type : 'prioritycolumn', field : 'priority', text : 'Task Priority', width : 150 },
    ],
    subGridConfigs : {
        locked : {
            flex : 3
        },
        normal : {
            flex : 4
        }
    },
    columnLines : false,
    features : {
        rollups : {
            disabled : true
        },
        baselines : {
            disabled : true
        },
        progressLine : {
            disabled   : true,
            statusDate : new Date(2019, 0, 25)
        },
        filter         : true,
        dependencyEdit : true,
        timeRanges     : {
            showCurrentTimeLine : true
        },
        labels : {
            left : {
                field : 'name',
                editor : {
                    type : 'textfield'
                }
            }
        },
        taskEdit : {
            items : {
                predecessorsTab : false,
                successorsTab : false,
                advancedTab : false,
                generalTab : {
                    items : {
                        percentDone : false,
                        effort : false,
                        // newGeneralField : {
                        //     type   : 'textfield',
                        //     weight : 355,
                        //     label  : 'New field in General Tab',
                        //     // Name of the field matches data field name, so value is loaded/saved automatically
                        //     name   : 'custom'
                        // }
                    }
                }
            }
        }
    },
    tbar : {
        type : 'gantttoolbar'
    }
};
export default ganttConfig;
