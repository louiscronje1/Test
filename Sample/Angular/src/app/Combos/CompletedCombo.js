import { Combo } from "@bryntum/gantt";

class CompletedCombo extends Combo {
    static type = 'completedcombo'
    static defaultConfig = {
        items: [
            { value: 'Completed', text: 'Completed' },
            { value: 'NotCompleted', text: 'NotCompleted' }
        ],
        picker: {
            minWidth: '8em'
        },
        listItemTpl: ({ text }) => `
            <div>
                <i style="margin-inline-end: 0.5em" class="b-fa-circle ${text}"></i>
                <small>${text}</small>
            </div>
        `
    };

    syncInputFieldValue(...args) {
        const completed = this.store.getById(this.value)?.text;
        this.icon.className = `b-fa b-fa-circle ${completed}`;
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
        ]
    }
}
CompletedCombo.initClass();