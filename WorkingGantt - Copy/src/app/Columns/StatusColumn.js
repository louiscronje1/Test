import '../Combos/StatusCombo.js';
import { Column, ColumnStore } from '@bryntum/gantt';

export default class StatusColumn extends Column {
    static get $name() {
        return 'StatusColumn';
    }

    static get type() {
        return 'statuscolumn';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field: 'status', 
            text: 'Status',
            editor: {
                type: 'statuscombo',
                editable: false,
            },
            cellCls: 'b-status-column-cell',
            htmlEncode: false,
            filterable: {
                filterField: {
                    type: 'combo',
                    items: ['Assigned', 'Completed', 'InProgress', 'Parked', 'Unassigned', 'DELETED', 'Requested', 'AwaitingFeedback']
                }
            }
        };
    }

    renderer({ record }) {
        const status = record.status;
        return status ? [{
            tag: 'i',
            className: `b-fa b-fa-circle ${status}`
        }, status] : '';
    }
}

ColumnStore.registerColumnType(StatusColumn);
