import { Toolbar, Toast, DateHelper, CSSHelper } from '@bryntum/gantt';
/**
 * @module GanttToolbar
 */

/**
 * @extends Core/widget/Toolbar
 */
export default class GanttToolbar extends Toolbar {
    // Factoryable type name
    static get type() {
        return 'gantttoolbar';
    }

    static get $name() {
        return 'GanttToolbar';
    }

    set parent(parent) {
        super.parent = parent;
        const me = this;
        me.gantt = parent;

    parent.project.on({
        load: ()=>{console.log('onLoad')},
        refresh: ()=> {console.log('onRefresh')},
        thisObj: me
    });

    me.styleNode = document.createElement('style');
    document.head.appendChild(me.styleNode);
    }
    

    get parent() {
        return super.parent;
    }

    static get configurable() {
        return {
            items: [
                {
                    type: 'buttonGroup',
                    cls: 'first-button-group',
                    items: [
                        {
                            ref: 'expandAllButton',
                            icon: 'b-fa b-fa-angle-double-down',
                            tooltip: 'Expand all',
                            onAction: 'up.onExpandAllClick'
                        },
                        {
                            ref: 'collapseAllButton',
                            icon: 'b-fa b-fa-angle-double-up',
                            tooltip: 'Collapse all',
                            onAction: 'up.onCollapseAllClick'
                        }
                    ]
                },
                {
                    type: 'buttonGroup',
                    items: [
                        {
                            ref: 'zoomInButton',
                            icon: 'b-fa b-fa-search-plus',
                            tooltip: 'Zoom in',
                            onAction: 'up.onZoomInClick'
                        },
                        {
                            ref: 'zoomOutButton',
                            icon: 'b-fa b-fa-search-minus',
                            tooltip: 'Zoom out',
                            onAction: 'up.onZoomOutClick'
                        },
                        {
                            ref: 'previousButton',
                            icon: 'b-fa b-fa-angle-left',
                            tooltip: 'Previous time span',
                            onAction: 'up.onShiftPreviousClick'
                        },
                        {
                            ref: 'nextButton',
                            icon: 'b-fa b-fa-angle-right',
                            tooltip: 'Next time span',
                            onAction: 'up.onShiftNextClick'
                        }
                    ]
                },
                {
                    type: 'textfield',
                    ref: 'filterByName',
                    cls: 'filter-by-name',
                    flex: '0 0 12.5em',
                    label: 'Find Task By Name',
                    placeholder: 'Find Task By Name',
                    clearable: true,
                    keyStrokeChangeDelay: 100,
                    triggers: {
                        filter: {
                            align: 'end',
                            cls: 'b-fa b-fa-filter'
                        }
                    },
                    onChange: 'up.onFilterChange'
                },
                {
                    type: 'buttonGroup',
                    items: [
                        {
                            ref: 'undoRedo',
                            type: 'undoredo',
                            items: {
                                transactionsCombo: null
                            }
                        }
                    ]
                }
            ]
        };
    }

    onExpandAllClick() {
        this.gantt.expandAll();
    }

    onCollapseAllClick() {
        this.gantt.collapseAll();
    }

    onZoomInClick() {
        this.gantt.zoomIn();
    }

    onZoomOutClick() {
        this.gantt.zoomOut();
    }

    onZoomToFitClick() {
        this.gantt.zoomToFit({
            leftMargin: 50,
            rightMargin: 50
        });
    }

    onShiftPreviousClick() {
        this.gantt.shiftPrevious();
    }

    onShiftNextClick() {
        this.gantt.shiftNext();
    }

    onFilterChange({ value }) {
        if (value === '') {
            this.gantt.taskStore.clearFilters();
        }
        else {
            value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            this.gantt.taskStore.filter({
                filters : task => task.name && task.name.match(new RegExp(value, 'i')),
                replace : true
            });
        }
    }

}

GanttToolbar.initClass();
