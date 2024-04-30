import '../Configure/GanttToolbar.js';
import '../Columns/StatusColumn.js';
import '../Columns/CompletedColumn.js';
import '../Columns/PriorityColumn.js';
import '../Columns/TypeColumn.js';
import '../Columns/SprintStatusColumn.js';
import Task from '../Models/Task.js';
import { WidgetHelper } from '@bryntum/gantt';

const ganttConfig = {
    dependencyIdField: 'wbsCode',
    project: {
        stm: {
            autoRecord: true
        },
        taskStore: {
            modelClass: Task,
            autoLoad: true,
            readUrl: 'api/InitialData'
        },
        resourceStore: {
            autoLoad: true,
            readUrl: `api/Resources`,
            autoReload: true
        },
        assignmentStore: {
            autoLoad: true,
            readUrl: `api/Assignments`,
            autoReload: true
        }
    },
    startDate: '2019-01-20',
    endDate: '2022-12-31',
    columns: [
        { type: 'wbs', text: ' ' },
        { type: 'name', text: 'Title', width: 250 },
        {
            type: 'resourceassignment',
            text: 'Resource',
            width: 125,
            showAvatars: false,
            itemTpl: assignment => assignment.resourceName,
            editor: {
                chipView: {
                    itemTpl: assignment => assignment.resourceName
                }
            },
        },
        { type: 'startdate', text: 'Start Date' },
        { type: 'enddate', text: 'End Date' },
        { type: 'sprintstatuscolumn', text: 'Sprint Status', field: 'SprintStatus' },
        { type: 'completedcolumn', width: 150, field: 'completed' },
        { type: 'typecolumn', width: 200, text: 'Task Type' },
        { type: 'statuscolumn', field: 'status', width: 150, text: 'Task Status' },
        { type: 'prioritycolumn', field: 'priority', text: 'Task Priority', width: 100 },
    ],
    subGridConfigs: {
        locked: {
            flex: 3
        },
        normal: {
            flex: 4
        }
    },
    columnLines: false,
    features: {
        rollups: {
            disabled: true
        },
        baselines: {
            disabled: true
        },
        progressLine: {
            disabled: true,
            statusDate: new Date(2019, 0, 25)
        },
        filter: true,
        dependencyEdit: true,
        timeRanges: {
            showCurrentTimeLine: true
        },
        labels: {
            left: {
                field: 'name',
                editor: {
                    type: 'textfield'
                }
            }
        },
        taskEdit: {
            items: {
                generalTab: {
                    items: {
                        plannedHours: {
                            type: 'numberfield',
                            label: 'Planned Hours',
                            name: 'plannedHours',
                            weight: 100,
                        },
                        statusField: {
                            type: 'combo',
                            label: 'Status',
                            name: 'status',
                            items: ['Assigned', 'Completed', 'InProgress', 'Parked', 'Unassigned', 'DELETED', 'Requested', 'AwaitingFeedback'],
                            weight: 110,
                            columnWidth: 0.5
                        },
                        priorityField: {
                            type: 'combo',
                            label: 'Priority',
                            name: 'priority',
                            items: ['Critical', 'Low', 'Urgent'],
                            weight: 120,
                            columnWidth: 0.5
                        },
                        typeField: {
                            type: 'combo',
                            label: 'Type',
                            name: 'type',
                            items: ['Bug', 'Change Request', 'New Development', 'Nuisance Request', 'Report Request', 'Support Request', 'Training Issue', 'System Generated Check'],
                            weight: 130,
                            columnWidth: 0.5
                        },
                        Sprintcompleted: {
                            type: 'combo',
                            label: 'Completed',
                            name: 'completed',
                            items: ['Completed', 'NotCompleted'],
                            columnWidth: 0.5
                        },
                        sprintStatus: {
                            type: 'combo',
                            label: 'Sprint Status',
                            name: 'SprintStatus',
                            items: ['New', 'InProgress', 'Completed', 'In QA', 'In Staging', 'In Live'],
                            columnWidth: 0.5
                        },
                        effort : false,
                        duration: false,
                        percentDone: false
                    }
                },
                notesTab: {
                    title: 'Task Description'
                },
                predecessorsTab: false,
                successorsTab: false,
                advancedTab: false,
            },
            listeners: {
                beforeTaskEditShow: ({ source: editor, taskRecord }) => {
                    // Dynamically adjust field visibility
                    editor.widgetMap.plannedHours.hidden = typeof taskRecord.data.plannedHours === 'undefined';
                    editor.widgetMap.statusField.hidden = typeof taskRecord.data.status === 'undefined';
                    editor.widgetMap.priorityField.hidden = typeof taskRecord.data.priority === 'undefined';
                    editor.widgetMap.typeField.hidden = typeof taskRecord.data.type === 'undefined';

                    editor.refresh();
                }
            }
        }
    },
    tbar: {
        type: 'gantttoolbar' as 'toolbar' // Explicitly cast the type to satisfy TypeScript
    }
};

export default ganttConfig;






// import '../Configure/GanttToolbar.js';
// import '../Columns/StatusColumn.js';
// import '../Columns/CompletedColumn.js';
// import '../Columns/PriorityColumn.js';
// import '../Columns/TypeColumn.js';
// import '../Columns/SprintStatusColumn.js'
// import Task from '../Models/Task.js';
// import { WidgetHelper } from '@bryntum/gantt';

// const ganttConfig = {
//     dependencyIdField : 'wbsCode',
//     project           : {
//         stm : {
//             autoRecord : true
//         },
//         taskStore : {
//             modelClass : Task,
//             autoLoad   : true,
//             readUrl    : 'api/DataAccess/InitialDataGet'
//         },
//         resourceStore : {
//             autoLoad : true,
//             readUrl : `api/DataAccess/ResourcesGet`,
//             autoReload : true
//         },
//         assignmentStore : {
//             autoLoad : true,
//             readUrl : `api/DataAccess/AssignmentsGet`,
//             autoReload : true
//         }
//     },
//     startDate : '2019-01-20',
//     endDate : '2022-12-31',
//     columns : [
//         { type : 'wbs', text : ' ' },
//         { type : 'name',text : 'Title', width : 250 },
//         { 
//             type : 'resourceassignment',
//             text : 'Resource',
//             width : 125,
//             showAvatars : false,
//             itemTpl : assignment => assignment.resourceName,
//             editor : {
//                 chipView : {
//                     itemTpl : assignment => assignment.resourceName
//                 }
//             },
//         },
//         { type : 'startdate', text : 'Start Date' },
//         { type : 'enddate', text : 'End Date' },
//         { type : 'sprintstatuscolumn' , text : 'Sprint Status', field: 'SprintStatus'},
//         { type : 'completedcolumn', width : 150, field : 'completed' },
//         { type : 'typecolumn' , width : 200, text: 'Task Type' },
//         { type : 'statuscolumn', field : 'status', width : 150, text: 'Task Status' },
//         { type : 'prioritycolumn', field : 'priority', text : 'Task Priority', width : 100 },
//     ],
//     subGridConfigs : {
//         locked : {
//             flex : 3
//         },
//         normal : {
//             flex : 4
//         }
//     },
//     columnLines : false,
//     features : {
//         rollups : {
//             disabled : true
//         },
//         baselines : {
//             disabled : true
//         },
//         progressLine : {
//             disabled   : true,
//             statusDate : new Date(2019, 0, 25)
//         },
//         filter         : true,
//         dependencyEdit : true,
//         timeRanges     : {
//             showCurrentTimeLine : true
//         },
//         labels : {
//             left : {
//                 field : 'name',
//                 editor : {
//                     type : 'textfield'
//                 }
//             }
//         },
//         // taskEdit : {
//         //     items : {
//         //         predecessorsTab : false,
//         //         successorsTab : false,
//         //         advancedTab : false,
//         //         notesTab: {
//         //             title: 'Task Description'
//         //         },
//         //         generalTab : {
//         //             // items : {
//         //             //     percentDone : false,
//         //             //     effort : false,
//         //             //     duration: false,
//         //             //     plannedHours: {
//         //             //         type: 'numberfield',
//         //             //         label: 'Planned Hours',
//         //             //         name: 'plannedHours',
//         //             //         weight: 100 // Adjust the weight for ordering
//         //             //     },
//         //             //     statusField: {
//         //             //         type: 'combo',
//         //             //         label: 'Status',
//         //             //         name: 'status',
//         //             //         items: ['Assigned', 'Completed', 'InProgress', 'Parked', 'Unassigned', 'DELETED', 'Requested', 'AwaitingFeedback'], // Add your statuses
//         //             //         weight: 110
//         //             //     },
//         //             //     priorityField: {
//         //             //         type: 'combo',
//         //             //         label: 'Priority',
//         //             //         name: 'priority',
//         //             //         items: ['Critical', 'Low', 'Urgent'], // Add your priorities
//         //             //         weight: 120
//         //             //     },
//         //             //     typeField: {
//         //             //         type: 'combo',
//         //             //         label: 'Type',
//         //             //         name: 'type',
//         //             //         items: ['Bug', 'Change Request', 'New Development', 'Nuisance Request', 'Report Request', 'Support Request', 'Training Issue', 'System Genererated Check'], // Add your types
//         //             //         weight: 130
//         //             //     }
//         //             // }
//         //             // Pre-configured tabs and fields
//         //             items: {
//         //                 generalTab: {
//         //                     effort : false,
//         //                 duration: false,
//         //                 plannedHours: {
//         //                     type: 'numberfield',
//         //                     label: 'Planned Hours',
//         //                     name: 'plannedHours',
//         //                     weight: 100 // Adjust the weight for ordering
//         //                 },
//         //                 statusField: {
//         //                     type: 'combo',
//         //                     label: 'Status',
//         //                     name: 'status',
//         //                     items: ['Assigned', 'Completed', 'InProgress', 'Parked', 'Unassigned', 'DELETED', 'Requested', 'AwaitingFeedback'], // Add your statuses
//         //                     weight: 110
//         //                 },
//         //                 priorityField: {
//         //                     type: 'combo',
//         //                     label: 'Priority',
//         //                     name: 'priority',
//         //                     items: ['Critical', 'Low', 'Urgent'], // Add your priorities
//         //                     weight: 120
//         //                 },
//         //                 typeField: {
//         //                     type: 'combo',
//         //                     label: 'Type',
//         //                     name: 'type',
//         //                     items: ['Bug', 'Change Request', 'New Development', 'Nuisance Request', 'Report Request', 'Support Request', 'Training Issue', 'System Genererated Check'], // Add your types
//         //                     weight: 130
//         //                 }
//         //                 }
//         //             },
//         //             listeners: {
//         //                 beforeTaskEditShow: function({ source: editor, taskRecord }) {
//         //                     // Determine the task level by checking if it's a leaf or has children
//         //                     const isLeaf = taskRecord.isLeaf;
//         //                     const hasChildren = taskRecord.children && taskRecord.children.length > 0;
                            
//         //                     // Example: Customize for leaf and non-leaf tasks
//         //                     if (isLeaf) {
//         //                         // Leaf tasks get full editing capabilities
//         //                         editor.widgetMap.plannedHours.hidden = false;
//         //                         editor.widgetMap.statusField.hidden = false;
//         //                         editor.widgetMap.priorityField.hidden = false;
//         //                         editor.widgetMap.typeField.hidden = false;
//         //                     } else if (hasChildren) {
//         //                         // Non-leaf tasks at specific level get limited capabilities
//         //                         editor.widgetMap.plannedHours.hidden = true; // Example: hide planned hours for parent tasks
//         //                         editor.widgetMap.statusField.hidden = false;
//         //                         editor.widgetMap.priorityField.hidden = true;
//         //                         editor.widgetMap.typeField.hidden = false;
//         //                     }
                            
//         //                     // Update the UI after making changes
//         //                     editor.refresh();
//         //                 }
//         //             }
//         //         }
//         //     }
//         // }
//         taskEdit: {
//             items: {
//                 generalTab: {
//                     items: {
//                         plannedHours: {
//                             type: 'numberfield',
//                             label: 'Planned Hours',
//                             name: 'plannedHours',
//                             weight: 100
//                         },
//                         statusField: {
//                             type: 'combo',
//                             label: 'Status',
//                             name: 'status',
//                             items: ['Assigned', 'Completed', 'InProgress', 'Parked', 'Unassigned', 'DELETED', 'Requested', 'AwaitingFeedback'],
//                             weight: 110
//                         },
//                         priorityField: {
//                             type: 'combo',
//                             label: 'Priority',
//                             name: 'priority',
//                             items: ['Critical', 'Low', 'Urgent'],
//                             weight: 120
//                         },
//                         typeField: {
//                             type: 'combo',
//                             label: 'Type',
//                             name: 'type',
//                             items: ['Bug', 'Change Request', 'New Development', 'Nuisance Request', 'Report Request', 'Support Request', 'Training Issue', 'System Generated Check'],
//                             weight: 130
//                         }
//                         // ... any other fields you want to include
//                     }
//                 },
//                 notesTab: {
//                     title: 'Task Description'
//                 },
//                         predecessorsTab : false,
//                         successorsTab : false,
//                         advancedTab : false,
//             },
//             listeners: {
//                 beforeTaskEditShow: ({ source: editor, taskRecord }) => {
//                     const fieldsToShowOrHide = ['plannedHours', 'status', 'priority', 'type'];
    
//                     // Loop over each field and check if the property exists on the task record
//                     fieldsToShowOrHide.forEach(field => {
//                         const fieldExists = Object.prototype.hasOwnProperty.call(taskRecord, field);
//                         const widget = editor.widgetMap[field + 'Field']; // Adjust based on your actual widget names
                        
//                         if (widget) {
//                             widget.hidden = !fieldExists;
//                         }
//                     });
    
//                     // Make sure to call editor.refresh() if the editor does not auto-refresh
//                     // to apply the visibility changes
//                     editor.refresh();
//                 }
//             }
            
//         }
//     },
//     tbar : {
//          type : 'gantttoolbar' as 'toolbar' // Explicitly cast the type to satisfy TypeScript
//     }
// };
// export default ganttConfig;