//// src/app/Columns/ResourceNameColumn.js
//import { Column, WidgetHelper, ComboBox, ColumnStore } from '@bryntum/gantt';

//export default class ResourceNameColumn extends Column {
//    static get type() {
//        return 'resourceNameColumn';
//    }

//    static get defaults() {
//        return {
//            text: 'Resource',
//            width: 120,
//            field: 'resourceName',
//            editor: false // Disable default editor
//        };
//    }

//    renderer({ record }) {
//        return record.resourceName || '';
//    }

//    // Custom editor to emulate resource assignment but with a simpler backend
//    onBeforeCellEditStart({ editorContext }) {
//        const resources = [
//            { id: 'r1', name: 'Melanie Du Plessis' },
//            { id: 'r2', name: 'Andorette Gerber' },
//            // Add more resources as needed
//        ];

//        editorContext.editor = WidgetHelper.createWidget({
//            type: 'combo',
//            items: resources.map(res => ({ id: res.id, text: res.name })),
//            valueField: 'id',
//            displayField: 'text',
//            pickerWidth: 250,
//            value: resources.find(r => r.name === editorContext.value)?.id,
//            onAction: ({ value }) => {
//                const selectedResource = resources.find(r => r.id === value);
//                editorContext.record.resourceName = selectedResource.name;
//            }
//        });

//        return true; // Return true to indicate that you've handled the editing start
//    }
//}

//ColumnStore.registerColumnType(ResourceNameColumn);











//import { Column, WidgetHelper, ColumnStore, ComboBox } from '@bryntum/gantt';

//export default class ResourceNameColumn extends Column {
//    static get type() {
//        return 'resourceNameColumn';
//    }

//    static get defaults() {
//        return {
//            text: 'Resource',
//            width: 150,
//            field: 'resourceName',
//            htmlEncode: false, // Allow HTML to be rendered
//            editor: false // Custom editor setup
//        };
//    }

//    // Using ChipView to render multiple resources as chips
//    renderer({ record }) {
//        return record.resourceName;
//    }

//    // Custom editor using a ComboBox for selecting multiple resources
//    onBeforeCellEditStart({ editorContext }) {
//        const allResources = this.grid.project.resourceStore.records.map(res => ({ id: res.id, text: res.name }));
//        const selectedResourceIds = allResources.filter(res => editorContext.record.resourceName.split(', ').includes(res.text)).map(res => res.id);

//        editorContext.editor = WidgetHelper.createWidget({
//            type: 'combo',
//            items: allResources,
//            multiSelect: true,
//            value: selectedResourceIds,
//            valueField: 'id',
//            displayField: 'text',
//            pickerWidth: 250,
//            listeners: {
//                change: ({ value, record }) => {
//                    const selectedNames = allResources.filter(res => value.includes(res.id)).map(res => res.text);
//                    record.resourceName = selectedNames.join(', ');
//                }
//            }
//        });

//        editorContext.editor.show();
//        return true; // Indicate that the editor setup is handled
//    }
//}

//ColumnStore.registerColumnType(ResourceNameColumn);







import { Column, ColumnStore, WidgetHelper } from '@bryntum/gantt';

export default class ResourceNameColumn extends Column {
    static get $name() {
        return 'ResourceNameColumn';
    }

    static get type() {
        return 'resourceNameColumn';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field: 'resourceName',
            text: 'Resource',
            htmlEncode: false,
            editor: false // Initially set to false
        };
    }

    constructor(config) {
        super(config);
        this.editor = this.createEditor(); // Properly initialize the editor here
    }

    createEditor() {
        if (this.grid && this.grid.project && this.grid.project.resourceStore.isLoaded) {
            const items = this.grid.project.resourceStore.records.map(res => ({ id: res.id, text: res.name }));
            return {
                type: 'combo',
                multiSelect: true,
                items: items,
                editable: false
            };
        }
        return null;
    }


    renderer({ record }) {
        // Directly use resourceName without splitting into an array
        const resourceName = record.resourceName;
        //return WidgetHelper.createWidget({
        //    type: 'chipview',
        //    items: resourceName ? [{ text: resourceName }] : [],
        //    closable: true,
        //    style: 'display:flex; flex-wrap:wrap;',
        //    listeners: {
        //        closeClick: ({ item }) => {
        //            // Since there's only one resource, we can directly clear it
        //            record.resourceName = '';
        //            this.grid.refresh();
        //        }
        //    }
        //}).element;
    }
}

ColumnStore.registerColumnType(ResourceNameColumn);





