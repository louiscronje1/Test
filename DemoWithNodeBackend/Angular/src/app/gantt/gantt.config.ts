import '../Configure/GanttToolbar.js';
import '../Columns/StatusColumn.js';
import '../Columns/CompletedColumn.js';
import '../Columns/PriorityColumn.js';
import '../Columns/TypeColumn.js';
import '../Columns/SprintStatusColumn.js';
import '../Columns/ResourceNameColumn.js';
import Task from '../Models/Task.js';

const ganttConfig = {
    dependencyIdField: 'wbsCode',
    project: {
        stm: {
            autoRecord: true
        },
        taskStore: {
            modelClass: Task,
            autoLoad: true,
            //readUrl: '/DataAccess/InitialDataGet'
            //readUrl: 'api/DataAccess/InitialDataGet'
            readUrl: `/api/InitialData`,
            listeners: {
                load: async ({ store }) => {
                    await store.project.commitAsync()
                    store.project.stm.enable()
                }
            }

        },
        resourceStore: {
            autoLoad: true,
            //readUrl: `/DataAccess/ResourcesGet`,
            //readUrl: `api/DataAccess/ResourcesGet`,
            readUrl: `/api/Resources`,
            autoReload: false
        },
        assignmentStore: {
            autoLoad: true,
            //readUrl: `/DataAccess/AssignmentsGet`,
            //readUrl: `api/DataAccess/AssignmentsGet`,
            readUrl: `/api/Assignments`,
            autoReload: false
        }
    },
    startDate: '2021-08-01',
    endDate: '2030-12-31',
    columns: [
        { type: 'wbs', text: ' ' },
        { type: 'name', text: 'Title', width: 250 },
        {
            type: 'resourceassignment',
            text: 'Resource',
            //field: 'resource',
            width: 150,
            showAvatars: false,
            itemTpl: (assignment) => assignment.resourceName,
            editor: {
                chipView: {
                    itemTpl: (assignment) => assignment.resourceName
                }
            }
        },
        //{ type: 'resourceNameColumn' },
        { type: 'startdate', text: 'Start Date' },
        { type: 'enddate', text: 'End Date' },
        { type: 'completedcolumn', width: 150, field: 'completed' },
        { type: 'sprintstatuscolumn', text: 'Sprint Status', field: 'SprintStatus', width: 150 },
        { type: 'typecolumn', width: 200, text: 'Task Type' },
        {
            type: 'statuscolumn',
            field: 'status',
            width: 150,
            text: 'Task Status'
        },
        {
            type: 'prioritycolumn',
            field: 'priority',
            text: 'Task Priority',
            width: 150
        }
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
        taskMenu: {
            items: {
                // add: {
                //     items: {
                //         subtask      : false,
                //         successor    : false,
                //         predecessor  : false
                //     }
                // },
                convertToMilestone : false,
                cut : false,
                outdent : false,
                indent : false,
                deleteTask: {
                    text: 'Remove'
                },
                viewInDevlog: {
                    text: 'View on Devlog',
                    icon: 'b-fa-external-link-alt',
                    weight: 200,
                    onItem: (event) => {
                        const taskRecord = event.taskRecord;
                        if (taskRecord) {
                            const taskGuid = taskRecord.data.TaskGuid || taskRecord.id;
                            if (taskGuid) {
                                const url = `http://devlog.workablemanagement.solutions/Task/Index?TaskGuid=${taskGuid}`;
                                window.open(url, '_blank');
                            } else {
                                console.error('Task GUID not found for this record');
                            }
                        }
                    }
                },
            }
        },        
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
                            weight: 100
                        },
                        statusField: {
                            type: 'combo',
                            label: 'Status',
                            name: 'status',
                            items: [
                                'Assigned',
                                'Completed',
                                'InProgress',
                                'Parked',
                                'Unassigned',
                                'DELETED',
                                'Requested',
                                'AwaitingFeedback'
                            ],
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
                            items: [
                                'Bug',
                                'Change Request',
                                'New Development',
                                'Nuisance Request',
                                'Report Request',
                                'Support Request',
                                'Training Issue',
                                'System Generated Check'
                            ],
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
                            items: [
                                'New',
                                'In Progress',
                                'Completed',
                                'In QA',
                                'In Staging',
                                'In Live'
                            ],
                            columnWidth: 0.5
                        },
                        effort: false,
                        duration: false,
                        percentDone: false
                    }
                },
                notesTab: {
                    title: 'Task Description'
                },
                predecessorsTab: false,
                successorsTab: false,
                advancedTab: false
            }
        }
    },
    listeners: {
                beforeTaskEditShow: ({ editor, taskRecord }) => {
                    // Check each field and set visibility based on whether the task record contains it
                    editor.widgetMap.plannedHours.hidden =
                        !taskRecord.data.hasOwnProperty('plannedHours');
                    editor.widgetMap.statusField.hidden =
                        !taskRecord.data.hasOwnProperty('status');
                    editor.widgetMap.priorityField.hidden =
                        !taskRecord.data.hasOwnProperty('priority');
                    editor.widgetMap.typeField.hidden =
                        !taskRecord.data.hasOwnProperty('type');
                    editor.widgetMap.Sprintcompleted.hidden =
                        !taskRecord.data.hasOwnProperty('completed');
                    editor.widgetMap.sprintStatus.hidden =
                        !taskRecord.data.hasOwnProperty('SprintStatus');
                }
            },
    tbar: {
        type: 'gantttoolbar' as 'toolbar' // Explicitly cast the type to satisfy TypeScript
    }

};
export default ganttConfig;
