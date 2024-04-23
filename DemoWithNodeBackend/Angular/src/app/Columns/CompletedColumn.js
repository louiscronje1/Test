import { Column, ColumnStore } from '@bryntum/gantt';
import '../Combos/CompletedCombo.js';

export default class CompletedColumn extends Column {
    static get $name() {
        return 'CompletedColumn';
    }

    static get type() {
        return 'completedcolumn';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field: 'completed',
            text: 'Sprint Status',
            editor: {
                type: 'completedcombo',
                editable: true
            },
            cellCls: 'b-type-column-cell',
            htmlEncode: false,
            filterable: {
                type: 'combo',
                items: ['Completed, NotCompleted']
            }
        };
    }

    renderer({ record }) {
        const completed = record.completed;
        return completed ? [{
            tag: 'i',
            style: {
                marginInlineStart: '.8em',
                marginInlineEnd: '.3em'
            },
            className: `b-fa b-fa-circle ${completed} b-fa-small`
        }, completed] : ``;
    }
}

ColumnStore.registerColumnType(CompletedColumn);