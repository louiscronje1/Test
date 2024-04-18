import { Combo } from "@bryntum/gantt";

class TypeCombo extends Combo {
    static type = 'typecombo'
    static defaultConfig = {
        items: [
            { value: 'Bug', text : 'Bug' },
            { value: 'Change Request', text: 'Change Request' },
            { value: 'New Development', text: 'New Development' },
            { value: 'Nuisance Request', text: 'Nuisance Request' },
            { value: 'Report Request', text: 'Report Request' },
            { value: 'Support Request', text: 'Support Request' },
            { value: 'Training Issue', text: 'Training Issue' },
            { value: 'System Generated Check', text: 'System Generated Check' }
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
        const type = this.store.getById(this.value)?.text;
        this.icon.className = `b-fa b-fa-circle ${type}`;
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

TypeCombo.initClass();