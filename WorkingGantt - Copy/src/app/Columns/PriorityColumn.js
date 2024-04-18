import '../Combos/PriorityCombo.js';
import { Column, ColumnStore } from "@bryntum/gantt";

export default class PriorityColumn extends Column {
    static get $name() {
        return 'PriorityColumn';
    }

    static get type() {
        return 'prioritycolumn';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field: 'priority', 
            text: 'Priority',
            editor: {
                type: 'prioritycombo', 
                editable: false,
            },
            cellCls: 'b-priority-column-cell',
            htmlEncode: false,
            filterable: {
                filterField: {
                    type: 'combo',
                    items: ['Critical', 'Low', 'Urgent']
                }
            }
        };
    }

    renderer({ record }) {
        const priority = record.priority;
        return priority ? [{
            tag: 'i',
            className: `b-fa b-fa-circle ${priority} b-fa-small`
        }, priority] : '';
    }
}

ColumnStore.registerColumnType(PriorityColumn);