import { Combo } from "@bryntum/gantt";

class SprintStatusCombo extends Combo {
    static type = 'sprintstatuscombo';
    static defaultConfig = {
        items: [
            { value: 'New', text: 'New' },
            { value: 'In Progress', text: 'In Progress' },
            { value: 'Completed', text: 'Completed' },
            { value: 'In QA', text: 'In QA' },
            { value: 'In Staging', text: 'In Staging' },
            { value: 'In Live', text: 'In Live' }
        ],
        picker: {
            minWidth: '8em'
        },
        listItemTpl: ({ value, text }) => {
            const statusClass = `status-${text.replace(/\s+/g, '-').toLowerCase()}`;
            return `
                <div>
                    <i style="margin-inline-end: 0.5em; color: var(--${statusClass})" class="b-fa b-fa-circle"></i>
                    <small>${text}</small>
                </div>
            `;
        }        
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
