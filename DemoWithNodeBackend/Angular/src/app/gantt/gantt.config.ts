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






