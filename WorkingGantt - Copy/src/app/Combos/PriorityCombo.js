import { Combo } from '@bryntum/gantt';

class PriorityCombo extends Combo {
    static type = 'prioritycombo';
    static defaultConfig = {
        items: [
            { value: 'Critical', text: 'Critical' },
            { value: 'Low', text: 'Low' },
            { value: 'Urgent', text: 'Urgent' }
        ],
        picker: {
            minWidth: '8em'
        },
        listItemTpl: ({ text }) => `
            <div>
                <i style="margin-inline-end: 0.5em" class="b-fa b-fa-circle ${text}"></i>
                <small>${text}</small>
            </div>
        `
    };

    syncInputFieldValue(...args) {
        const priority = this.store.getById(this.value)?.text;
        this.icon.className = `b-fa b-fa-circle ${priority}`;
        super.syncInputFieldValue(...args);
    }

    get innerElements() {
        return [
            {
                reference: 'icon',
                tag: 'i',
                style: {
                    marginInlineStart: '.8em',
                    marginInlineEnd: '-.3em'
                }
            },
            ...super.innerElements
        ];
    }
}

PriorityCombo.initClass();
