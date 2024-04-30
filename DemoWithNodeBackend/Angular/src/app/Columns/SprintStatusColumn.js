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
                        'New', 'InProgress', 'Completed', 'In QA', 'In Staging', 'In Live'
                    ]
                }
            }
        };
    }

    renderer({ record }) {
        const SprintStatus = record.SprintStatus;
        return SprintStatus? [{
            tag: 'i',
            className: `b-fa b-fa-circle ${SprintStatus}`
        }, SprintStatus] : '';
    }
}

ColumnStore.registerColumnType(SprintStatusColumn)