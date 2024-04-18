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

    // Called when toolbar is added to the Gantt panel
    set parent(parent) {
        super.parent = parent;
        const me = this;
        me.gantt = parent;

        parent.project.on({
            load: 'updateStartDateField',
            refresh: 'updateStartDateField',
            thisObj: me
        });

        me.styleNode = document.createElement('style');
        document.head.appendChild(me.styleNode);

        // Fetch initial data for clients
        this.fetchClients();
        this.fetchProjects();
        this.fetchSprints();
        this.fetchResources();
    }

    constructor() {
        super();
        this.selectedClients = [];
        this.selectedProjects = [];
        this.selectedSprints = [];
        this.selectedResources = [];
    }

    currentHighlight = null;
    selectedItems = {};
    selectedItemsTexts = {};

    get parent() {
        return super.parent;
    }

    static get configurable() {
        return {
            items: [
                {
                    type: 'buttonGroup',
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
                    // Label used for material, hidden in other themes
                    label: 'Find tasks by name',
                    // Placeholder for others
                    placeholder: 'Find tasks by name',
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
                // {
                //     type: 'button',
                //     text: 'Filter By Client',
                //     ref: 'clientDropdown', // Reference for later use
                //     menu: {
                //         type: 'menu',
                //         items: [
                //             // Initial list of clients
                //         ],
                //         onItem: 'up.onClientSelect'
                //     }
                // },
                // {
                //     type: 'button',
                //     text: 'Filter By Project',
                //     ref: 'projectDropdown', // Reference for later use
                //     menu: {
                //         type: 'menu',
                //         items: [
                //             // This will be populated dynamically based on the selected client
                //         ],
                //         onItem: 'up.onProjectSelect'
                //     }
                // },
                // {
                //     type: 'button',
                //     text: 'Filter By Sprint',
                //     ref: 'sprintDropdown', // Reference for later use
                //     menu: {
                //         type: 'menu',
                //         items: [
                //             // This will be populated dynamically based on the selected project
                //         ],
                //         onItem: 'up.onSprintSelect'
                //     }
                // },
                // {
                //     type: 'button',
                //     text: 'Filter By Resource',
                //     ref: 'resourceDropdown', // Reference for later use
                //     menu: {
                //         type: 'menu',
                //         items: [
                //             // This will be populated dynamically based on the selected project
                //         ],
                //         onItem: 'up.onResourceSelect'
                //     }
                // },
                {
                    type: 'button',
                    text: 'Filter By Client',
                    ref: 'clientDropdown',
                    menu: {
                        type: 'menu',
                        items: [],
                        onItem: 'up.onClientSelect',
                        keepOpen: true // Keep the dropdown open after item selection
                    }
                },
                {
                    type: 'button',
                    text: 'Filter By Project',
                    ref: 'projectDropdown',
                    menu: {
                        type: 'menu',
                        items: [],
                        onItem: 'up.onProjectSelect',
                        keepOpen: true // Keep the dropdown open after item selection
                    }
                },
                {
                    type: 'button',
                    text: 'Filter By Sprint',
                    ref: 'sprintDropdown',
                    menu: {
                        type: 'menu',
                        items: [],
                        onItem: 'up.onSprintSelect',
                        keepOpen: true // Keep the dropdown open after item selection
                    }
                },
                {
                    type: 'button',
                    text: 'Filter By Resource',
                    ref: 'resourceDropdown',
                    menu: {
                        type: 'menu',
                        items: [],
                        onItem: 'up.onResourceSelect',
                        keepOpen: true // Keep the dropdown open after item selection
                    }
                },
                {
                    type: 'button',
                    text: 'SELECT',
                    onAction: 'up.onSelectAction',
                    color: 'b-green'
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

    async fetchClients(projectId = null, sprintId = null, resourceId = null) {
        try {
            let url = 'api/DataAccess/ClientsGet?';
            if (projectId) {
                url += `projectId=${projectId}&`;
            }
            if (sprintId) {
                url += `sprintId=${sprintId}&`;
            }
            if (resourceId) {
                url += `resourceId=${resourceId}`;
            }

            const response = await fetch(url);
            const result = await response.json();
            const clients = result.data;
            this.updateClientDropdown(clients);
        } catch (error) {
            console.error('Failed to fetch clients:', error);
            Toast.show('Failed to load clients');
        }
    }

    async fetchResources(clientId = null, projectId = null, sprintId = null) {
        try {
            let url = 'api/DataAccess/ResourceGetByClientProjectSprintID?';
            if (clientId) {
                url += `clientId=${clientId}&`;
            }
            if (projectId) {
                url += `projectId=${projectId}&`;
            }
            if (sprintId) {
                url += `sprintId=${sprintId}`;
            }

            const response = await fetch(url);
            const result = await response.json();
            const resources = result.data;
            this.updateResourceDropdown(resources);
        } catch (error) {
            console.error('Failed to fetch resources:', error);
            Toast.show('Failed to load resources');
        }
    }

    async fetchProjects(clientId = null, sprintId = null, resourceId = null) {
        try {
            let url = 'api/DataAccess/ProjectGetByClientID?';
            if (clientId) {
                url += `clientId=${clientId}&`;
            }
            if (sprintId) {
                url += `sprintId=${sprintId}&`;
            }
            if (resourceId) {
                url += `resourceId=${resourceId}`;
            }

            const response = await fetch(url);
            const result = await response.json();
            const projects = result.data;
            this.updateProjectDropdown(projects);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            Toast.show('Failed to load projects');
        }
    }

    async fetchSprints(clientId = null, projectId = null, resourceId = null) {
        try {
            let url = 'api/DataAccess/SprintGetByProjectID?';
            if (clientId) {
                url += `clientId=${clientId}&`;
            }
            if (projectId) {
                url += `projectId=${projectId}&`;
            }
            if (resourceId) {
                url += `resourceId=${resourceId}`;
            }

            const response = await fetch(url);
            const result = await response.json();
            const sprints = result.data;
            this.updateSprintDropdown(sprints);
        } catch (error) {
            console.error('Failed to fetch sprints:', error);
            Toast.show('Failed to load sprints');
        }
    }

    // async fetchResourcesForSprint(clientId, projectId, sprintId) {
    //     try {
    //         const response = await fetch(`api/DataAccess/ResourceGetByClientProjectSprintID?clientId=${clientId}&projectId=${projectId}&sprintId=${sprintId}`);
    //         const result = await response.json();
    //         const resources = result.data;
    //         this.updateResourceDropdown(resources);
    //     } catch (error) {
    //         console.error('Failed to fetch resources:', error);
    //         Toast.show('Failed to load resources');
    //     }
    // }

    // async fetchProjectsForClient(clientId) {
    //     try {
    //         const response = await fetch(`api/DataAccess/ProjectGetByClientID?ID=${clientId}`);
    //         const result = await response.json();
    //         const projects = result.data;
    //         this.updateProjectDropdown(projects);
    //     } catch (error) {
    //         console.error('Failed to fetch projects:', error);
    //         Toast.show('Failed to load projects');
    //     }
    // }

    // async fetchSprintsForProject(projectId) {
    //     try {
    //         const response = await fetch(`api/DataAccess/SprintGetByProjectID?ID=${projectId}`);
    //         const result = await response.json();
    //         const sprints = result.data;
    //         this.updateSprintDropdown(sprints);
    //     } catch (error) {
    //         console.error('Failed to fetch sprints:', error);
    //         Toast.show('Failed to load sprints');
    //     }
    // }

    // onClientSelect({ source: item }) {
    //     this.selectedClient = item.itemId;
    //     this.fetchProjects(this.selectedClient, this.selectedSprint, this.selectedResource);
    //     this.fetchSprints(this.selectedClient, this.selectedProject, this.selectedResource);
    //     this.fetchResources(this.selectedClient, this.selectedProject, this.selectedSprint);
    // }

    // onSprintSelect({ source: item }) {
    //     this.selectedSprint = item.itemId;
    //     this.fetchClients(this.selectedProject, this.selectedSprint, this.selectedResource);
    //     this.fetchProjects(this.selectedClient, this.selectedSprint, this.selectedResource);
    //     this.fetchResources(this.selectedClient, this.selectedProject, this.selectedSprint);
    // }

    // onProjectSelect({ source: item }) {
    //     this.selectedProject = item.itemId;
    //     this.fetchClients(this.selectedProject, this.selectedSprint, this.selectedResource);
    //     this.fetchSprints(this.selectedClient, this.selectedProject, this.selectedResource);
    //     this.fetchResources(this.selectedClient, this.selectedProject, this.selectedSprint);
    // }

    // onResourceSelect({ source: item }) {
    //     this.selectedResource = item.itemId;
    //     this.fetchClients(this.selectedProject, this.selectedSprint, this.selectedResource);
    //     this.fetchProjects(this.selectedClient, this.selectedSprint, this.selectedResource);
    //     this.fetchSprints(this.selectedClient, this.selectedProject, this.selectedResource);
    // }

    // onSelectAction() {
    //     // Example: Fetch tasks based on selected filters
    //     this.gantt.project.taskStore.load({
    //         params: {
    //             clientId: this.selectedClient,
    //             projectId: this.selectedProject,
    //             sprintId: this.selectedSprint,
    //             resourceId: this.selectedResource
    //         }
    //     });
    // }

    onClientSelect({ source: item }) {
        const clientId = item.itemId;
        const isSelected = item.selected;

        if (isSelected) {
            this.selectedClients.push(clientId);
        } else {
            const index = this.selectedClients.indexOf(clientId);
            if (index > -1) {
                this.selectedClients.splice(index, 1);
            }
        }

        this.updateClientDropdown(this.widgetMap.clientDropdown.menu.items);
        this.fetchProjects(
            this.selectedClients.join(','),
            this.selectedSprints.join(','),
            this.selectedResources.join(',')
        );
        this.fetchSprints(
            this.selectedClients.join(','),
            this.selectedProjects.join(','),
            this.selectedResources.join(',')
        );
        this.fetchResources(
            this.selectedClients.join(','),
            this.selectedProjects.join(','),
            this.selectedSprints.join(',')
        );

        this.widgetMap.clientDropdown.menu.show();
    }

    onProjectSelect({ source: item }) {
        const projectId = item.itemId;
        const isSelected = item.selected;

        if (isSelected) {
            this.selectedProjects.push(projectId);
        } else {
            const index = this.selectedProjects.indexOf(projectId);
            if (index > -1) {
                this.selectedProjects.splice(index, 1);
            }
        }

        this.updateProjectDropdown(this.widgetMap.projectDropdown.menu.items);
        this.fetchClients(
            this.selectedProjects.join(','),
            this.selectedSprints.join(','),
            this.selectedResources.join(',')
        );
        this.fetchSprints(
            this.selectedClients.join(','),
            this.selectedProjects.join(','),
            this.selectedResources.join(',')
        );
        this.fetchResources(
            this.selectedClients.join(','),
            this.selectedProjects.join(','),
            this.selectedSprints.join(',')
        );

        this.widgetMap.projectDropdown.menu.show();
    }
    
    onSprintSelect({ source: item }) {
        const sprintId = item.itemId;
        const isSelected = item.selected;

        if (isSelected) {
            this.selectedSprints.push(sprintId);
        } else {
            const index = this.selectedSprints.indexOf(sprintId);
            if (index > -1) {
                this.selectedSprints.splice(index, 1);
            }
        }

        this.updateSprintDropdown(this.widgetMap.sprintDropdown.menu.items);
        this.fetchClients(
            this.selectedProjects.join(','),
            this.selectedSprints.join(','),
            this.selectedResources.join(',')
        );
        this.fetchProjects(
            this.selectedClients.join(','),
            this.selectedSprints.join(','),
            this.selectedResources.join(',')
        );
        this.fetchResources(
            this.selectedClients.join(','),
            this.selectedProjects.join(','),
            this.selectedSprints.join(',')
        );

        this.widgetMap.sprintDropdown.menu.show()
    }

    onResourceSelect({ source: item }) {
        const resourceId = item.itemId;
        const isSelected = item.selected;

        if (isSelected) {
            this.selectedResources.push(resourceId);
        } else {
            const index = this.selectedResources.indexOf(resourceId);
            if (index > -1) {
                this.selectedResources.splice(index, 1);
            }
        }

        this.updateResourceDropdown(this.widgetMap.resourceDropdown.menu.items);
        this.fetchClients(
            this.selectedProjects.join(','),
            this.selectedSprints.join(','),
            this.selectedResources.join(',')
        );
        this.fetchProjects(
            this.selectedClients.join(','),
            this.selectedSprints.join(','),
            this.selectedResources.join(',')
        );
        this.fetchSprints(
            this.selectedClients.join(','),
            this.selectedProjects.join(','),
            this.selectedResources.join(',')
        );

        this.widgetMap.resourceDropdown.menu.show()
    }

    updateProjectDropdown(projects) {
        const projectDropdown = this.widgetMap.projectDropdown;
        if (projectDropdown && projectDropdown.menu) {
            projectDropdown.menu.items = projects.map(project => ({
                text: project.name,
                itemId: project.itemId,
                icon: this.selectedProjects.includes(project.itemId) ? 'b-fa b-fa-check-circle' : 'b-fa b-fa-circle'
            }));
        }
    }

    updateClientDropdown(clients) {
        const clientDropdown = this.widgetMap.clientDropdown;
        if (clientDropdown && clientDropdown.menu) {
            clientDropdown.menu.items = clients.map(client => ({
                text: client.name,
                itemId: client.itemId,
                icon: this.selectedClients.includes(client.itemId) ? 'b-fa b-fa-check-circle' : 'b-fa b-fa-circle'
            }));
        }
    }


    updateSprintDropdown(sprints) {
        const sprintDropdown = this.widgetMap.sprintDropdown;
        if (sprintDropdown && sprintDropdown.menu) {
            sprintDropdown.menu.items = sprints.map(sprint => ({
                text: sprint.name,
                itemId: sprint.itemId,
                icon: this.selectedSprints.includes(sprint.itemId) ? 'b-fa b-fa-check-circle' : 'b-fa b-fa-circle'
            }));
        }
    }

    updateResourceDropdown(resources) {
        const resourceDropdown = this.widgetMap.resourceDropdown;
        if (resourceDropdown && resourceDropdown.menu) {
            resourceDropdown.menu.items = resources.map(resource => ({
                text: resource.name,
                itemId: resource.itemId,
                icon: this.selectedResources.includes(resource.itemId) ? 'b-fa b-fa-check-circle' : 'b-fa b-fa-circle'
            }));
        }
    }

    async onSelectAction() {
        const url = `api/DataAccess/DataGet?clientIds=${this.selectedClients.join(',')}&projectIds=${this.selectedProjects.join(',')}&sprintIds=${this.selectedSprints.join(',')}&resourceIds=${this.selectedResources.join(',')}`;
    
        try {
            const response = await fetch(url);
            const result = await response.json();
            const data = result.data;
            // Process the retrieved data and update the Gantt chart accordingly
            // For example, you can load the data into the Gantt chart's task store
            this.gantt.taskStore.data = data;
        } catch (error) {
            console.error('Failed to fetch data:', error);
            Toast.show('Failed to load data');
        }
    }
    
}

GanttToolbar.initClass();
