import { Combo } from "@bryntum/gantt";

class SprintStatusCombo extends Combo {
    static type = 'sprintstatuscombo';
    static defaultConfig = {
        items: [
            { value: 'New', text: 'New' },
            { value: 'InProgress', text: 'InProgress' },
            { value: 'Completed', text: 'Completed' },
            { value: 'In QA', text: 'In QA' },
            { value: 'In Staging', text: 'In Staging' },
            { value: 'In Live', text: 'In Live' }
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
    
    syncInpitValue(...args) {
        const status = this.store.getById(this.value)?.text;
        this.icon.className = `b-fa b-fa-circle ${status}`;
        super.syncInpitValue(...args);
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

SprintStatusCombo.initClass();