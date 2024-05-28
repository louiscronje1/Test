import { Column, ColumnStore } from '@bryntum/gantt';
import '../Combos/SprintStatusCombo.js';

export default class SprintStatusColumn extends Column {
    static get $name() {
        return 'SprintStatusColumn';
    }

    static get type() {
        return 'sprintstatuscolumn';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field: 'SprintStatus',
            text: 'Sprint Status', 
            editor: {
                type: 'sprintstatuscombo',
                editable: false
            },
            cellCls: 'b-sprintStatus-column-cell',
            htmlEncode: false,
            filterable: {
                filterField: {
                    type: 'combo',
                    items: [
                        'New', 'In Progress', 'Completed', 'In QA', 'In Staging', 'In Live'
                    ]
                }
            }
        };
    }

    renderer({ record }) {
        const sprintStatus = record.SprintStatus;
        if (!sprintStatus) return '';

        const statusClass = `status-${sprintStatus.replace(/\s+/g, '-').toLowerCase()}`;
        return [
            {
                tag: 'i',
                className: `b-fa b-fa-circle ${statusClass}`
            },
            ` ${sprintStatus}`
        ];
    }

}

ColumnStore.registerColumnType(SprintStatusColumn)
