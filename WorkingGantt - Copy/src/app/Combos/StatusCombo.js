import { Combo } from '@bryntum/gantt';

class StatusCombo extends Combo {
    static type = 'statuscombo';
    static defaultConfig = {
        items: [
            { value: 'Assigned', text: 'Assigned' },
            { value: 'Completed', text: 'Completed' },
            { value: 'InProgress', text: 'InProgress' },
            { value: 'Parked', text: 'Parked' },
            { value: 'Unassigned', text: 'Unassigned' },
            { value: 'DELETED', text: 'DELETED' },
            { value: 'Requested', text: 'Requested' },
            { value: 'Awaiting Feedback', text: 'Awaiting Feedback' }
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
        const status = this.store.getById(this.value)?.text;
        this.icon.className = `b-fa b-fa-circle ${status}`;
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

StatusCombo.initClass();
