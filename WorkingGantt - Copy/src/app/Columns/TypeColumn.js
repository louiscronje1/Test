import '../Combos/TypeCombo.js';
import { Column, ColumnStore } from '@bryntum/gantt';

export default class TypeColumn extends Column {
    static get $name() {
        return 'TypeColumn';
    }

    static get type() {
        return 'typecolumn';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field: 'type',
            text: 'Type',
            editor: {
                type: 'typecombo',
                editable: false,
            },
            cellCls: 'b-type-column-cell',
            htmlEncode: false,
            filterable: {
                filterField: {
                    type: 'combo',
                    itmes: ['Bug', 'Change Request', 'New Development', 'Nuisance Request', 'Report Request', 'Support Request', 'Training Issue', 'System Genererated Check']
                }
            }
        };
    }

    renderer({ record }) {
        const type = record.type;
        return type ? [{
            tag: 'i',
            style: {
                marginInlineStart: '.8em',
                marginInlineEnd: '.3em'
            },
            className:  `b-fa b-fa-circle ${type} b-fa-small`
        }, type] : ``;
    }
}

ColumnStore.registerColumnType(TypeColumn);