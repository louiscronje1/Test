import '../Configure/GanttToolbar.js';
import '../Columns/StatusColumn.js';
import '../Columns/CompletedColumn.js';
import '../Columns/PriorityColumn.js';
import '../Columns/TypeColumn.js'
import Task from '../Models/Task.js';
import { WidgetHelper } from '@bryntum/gantt';

const ganttConfig = {
    dependencyIdField : 'wbsCode',
    project           : {
        stm : {
            autoRecord : true
        },
        taskStore : {
            modelClass : Task,
            autoLoad   : true,
            readUrl    : 'api/InitialData'
        },
        resourceStore : {
            autoLoad : true,
            readUrl : `api/Resources`,
            autoReload : true
        },
        assignmentStore : {
            autoLoad : true,
            readUrl : `api/Assignments`,
            autoReload : true
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
        // {
        //     type: 'widget',
        //     text: '',
        //     width: 110,
        //     widgets: [{
        //         type: 'button',
        //         cls: 'b-blue b-raised',
        //         icon: 'b-icon b-icon-external-link',
        //         text: 'Devlog',
        //         tooltip: 'View task on Devlog',
        //         onAction: ({ record }) => {
        //             const taskGuid = record.TaskGuid || record.id;
        //             const url = `http://devlog.workablemanagement.solutions/Task/Index?TaskGuid=${taskGuid}`;
        //             window.open(url, '_blank');
        //         }
        //     }],
        //     // No need to use WidgetHelper.createWidget in the renderer, as widgets array configures them
        // },
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
    // tbar : {
    //     type : 'gantttoolbar'
    // }
     tbar : {
         type : 'gantttoolbar' as 'toolbar' // Explicitly cast the type to satisfy TypeScript
     }
};
export default ganttConfig;
