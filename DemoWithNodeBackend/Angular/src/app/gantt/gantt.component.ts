import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { APIService } from '../api.service';
import ganttConfig from './gantt.config';
import { Gantt, Toast, TimeZoneHelper, Popup, PresetManager, PdfExport } from '@bryntum/gantt';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-gantt',
    templateUrl: './gantt.component.html',
    styleUrls: ['./gantt.component.scss']
})
export class GanttComponent implements OnInit, AfterViewInit {
    @ViewChild('ganttContainer') ganttContainer: ElementRef;
    ganttInstance: any;
    ganttConfig = ganttConfig;

    clients: any[] = [];
    selectedClients: string[] = [];
    projects: any[] = [];
    selectedProjects: string[] = [];
    sprints: any[] = [];
    selectedSprints: string[] = [];
    resources: any[] = [];
    selectedResources: string[] = [];

    constructor(private apiService: APIService) { }

    ngOnInit(): void {
        this.initializeFilters();
        this.registerCustomPreset();
    }

    ngAfterViewInit(): void {
        this.initializeGantt();
        this.showInitialMask();
    }

    //initializeGantt(): void { 
    //    this.ganttInstance = new Gantt({
    //        appendTo: this.ganttContainer.nativeElement,
    //        ...this.ganttConfig
    //    });
    //}

    initializeGantt(): void {
        this.ganttInstance = new Gantt({
            appendTo: this.ganttContainer.nativeElement,
            ...this.ganttConfig, // Make sure ganttConfig includes the pdfExport settings or adjust here
            features: {
                ...this.ganttConfig.features, // Ensure existing features are not lost
                pdfExport: {
                    exportServer: 'http://localhost:8080',
                    translateURLsToAbsolute: 'http://localhost:8080/resources',
                    openAfterExport: true
                }
            }
        });
    }

    exportToPDF(): void {
        console.log('Attempting to export PDF:', this.ganttInstance.features.pdfExport);
        if (this.ganttInstance && this.ganttInstance.features.pdfExport) {
            this.ganttInstance.features.pdfExport.showExportDialog();
        } else {
            console.error('PDF Export feature is not available or not properly configured.');
        }
    }

    showInitialMask(): void {
        this.ganttInstance.mask({
            text: 'Filter for appropriate tasks then click apply.',
            icon: false
        });
    }

    initializeFilters(): void {
        this.apiService.fetchAllClients().subscribe({
            next: (data) => (this.clients = data.data),
            error: (error) => console.error('Error fetching clients', error)
        });

        this.apiService.fetchAllProjects().subscribe({
            next: (data) => (this.projects = data.data),
            error: (error) => console.error('Error fetching projects', error)
        });

        this.apiService.fetchAllSprints().subscribe({
            next: (data) => (this.sprints = data.data),
            error: (error) => console.error('Error fetching sprints', error)
        });

        this.apiService.fetchAllResources().subscribe({
            next: (data) => (this.resources = data.data),
            error: (error) => console.error('Error fetching resources', error)
        });
    }

    applyFilters(): void {
        let params = {
            ClientID: this.selectedClients.join(',') || '',
            ProjectID: this.selectedProjects.join(',') || '',
            SprintID: this.selectedSprints.join(',') || '',
            ResourceID: this.selectedResources.join(',') || ''
        };

        Object.keys(params).forEach((key) => {
            if (params[key] === '') {
                delete params[key];
            }
        });

        this.ganttInstance.mask({
            text: 'Applying filters...',
            icon: 'b-icon b-icon-spinner'
        });

        forkJoin({
            filteredData: this.apiService.fetchFilteredData(params),
            resources: this.apiService.fetchInitialResources(),
            assignments: this.apiService.fetchAssignments()
        }).subscribe({
            next: ({ filteredData, resources, assignments }) => {
                this.updateGanttProjectDates(filteredData.data);
                if (
                    this.ganttInstance &&
                    this.ganttInstance.project &&
                    this.ganttInstance.project.taskStore
                ) {
                    this.ganttInstance.project.taskStore.data = [];
                    this.ganttInstance.project.resourceStore.data = [];
                    this.ganttInstance.project.assignmentStore.data = [];

                    this.ganttInstance.project.resourceStore.data = resources.data;
                    this.ganttInstance.project.assignmentStore.data = assignments.data;
                    this.ganttInstance.project.taskStore.loadDataAsync(filteredData.data).then(() => {
                        this.ganttInstance.unmask();
                        console.log('Filters applied, data loaded');
                    }).catch(error => {
                        this.ganttInstance.unmask();
                        console.error('Error loading data into the Gantt chart', error);
                    });
                } else {
                    this.ganttInstance.unmask();
                    console.error('Gantt chart or project not initialized');
                }
            },
            error: (error) => {
                this.ganttInstance.unmask();
                console.error('Failed to apply filters and fetch data', error);
            }
        });
    }



    selectItem(itemId: string, category: string): void {
        let array = this.getSelectionArray(category);
        const index = array.indexOf(itemId);
        if (index === -1) {
            array.push(itemId);
        } else {
            array.splice(index, 1);
        }
        this.updateDropdowns(category);
    }

    getSelectionArray(category: string): string[] {
        switch (category) {
            case 'client':
                return this.selectedClients;
            case 'project':
                return this.selectedProjects;
            case 'sprint':
                return this.selectedSprints;
            case 'resource':
                return this.selectedResources;
            default:
                throw new Error(`Unknown category: ${category}`);
        }
    }

    updateDropdowns(changedCategory: string): void {
        let params = {
            ClientID: this.selectedClients.join(',') || '',
            ProjectID: this.selectedProjects.join(',') || '',
            SprintID: this.selectedSprints.join(',') || '',
            ResourceID: this.selectedResources.join(',') || ''
        };

        switch (changedCategory) {
            case 'client':
                this.apiService
                    .fetchProjects(params)
                    .subscribe((data) => (this.projects = data.data));
                this.apiService
                    .fetchSprints(params)
                    .subscribe((data) => (this.sprints = data.data));
                this.apiService
                    .fetchResources(params)
                    .subscribe((data) => (this.resources = data.data));
                break;
            case 'project':
                this.apiService
                    .fetchClients(params)
                    .subscribe((data) => (this.clients = data.data));
                this.apiService
                    .fetchSprints(params)
                    .subscribe((data) => (this.sprints = data.data));
                this.apiService
                    .fetchResources(params)
                    .subscribe((data) => (this.resources = data.data));
                break;
            case 'sprint':
                this.apiService
                    .fetchClients(params)
                    .subscribe((data) => (this.clients = data.data));
                this.apiService
                    .fetchProjects(params)
                    .subscribe((data) => (this.projects = data.data));
                this.apiService
                    .fetchResources(params)
                    .subscribe((data) => (this.resources = data.data));
                break;
            case 'resource':
                this.apiService
                    .fetchClients(params)
                    .subscribe((data) => (this.clients = data.data));
                this.apiService
                    .fetchProjects(params)
                    .subscribe((data) => (this.projects = data.data));
                this.apiService
                    .fetchSprints(params)
                    .subscribe((data) => (this.sprints = data.data));
                break;
        }
    }

    toggleDropdown(event: Event): void {
        event.stopPropagation();
        const dropdown = (event.target as HTMLElement).closest('.dropdown');
        dropdown.classList.toggle('active');
    }

    autoSaveEnabled: boolean = false;

    toggleAutoSave(): void {
        this.autoSaveEnabled = !this.autoSaveEnabled;
    }

    manualSave(): void {
        if (this.ganttInstance) {
            const data = this.serializeGanttData();
            let unassignedTasks = [];

            data.Sprints.forEach(sprint => {
                sprint.Tasks.forEach(task => {
                    if ((!task.TaskResourceID && task.TaskStatus.toLowerCase() !== "unassigned")) {
                        unassignedTasks.push(task.TaskTitle);
                    }
                });
            });

            if (unassignedTasks.length > 0) {
                const popup = new Popup({
                    anchor: true,
                    modal: true,
                    closable: true,
                    draggable: true,
                    width: 400,
                    title: 'Unassigned Tasks',
                    html: `<p>The following tasks need resources or need to be marked as 'unassigned' before saving:</p><ul>${unassignedTasks.map(task => `<li>${task}</li>`).join('')}</ul>`,
                    items: [
                        { type: 'button', text: 'Close', onClick: () => popup.close() }
                    ]
                });
                popup.show();
                return;
            }

            this.saveData(data);
        }
    }

    serializeGanttData() {
        const offset = new Date().getTimezoneOffset() * 60000;
        const serializedData = { Sprints: [] };

        this.ganttInstance.project.taskStore.rootNode.children.forEach(client => {
            client.children.forEach(project => {
                const clientID = client.ClientID;
                project.children.forEach(sprint => {
                    const projectID = project.ProjectID;
                    const newSprint = {
                        SprintID: sprint.id,
                        Guid: sprint.guid,
                        SprintTitle: sprint.name,
                        SprintCompletedStatus: sprint.completed,
                        ClientID: clientID,
                        ProjectID: projectID,
                        Tasks: []
                    };

                    sprint.children.forEach(task => {
                        const startDate = new Date(new Date(task.startDate).getTime() - offset).toISOString();
                        const endDate = new Date(new Date(task.endDate).getTime() - offset).toISOString();
                        const resourceIds = task.assignments.map(a => a.resource.id).join(',');

                        const newTask = {
                            TaskID: task.id,
                            Guid: task.guid,
                            TaskTitle: task.name,
                            TaskStartDate: startDate,
                            TaskEndDate: endDate,
                            PlannedHours: task.plannedHours,
                            TaskDescription: task.note,
                            TaskStatus: task.status,
                            TaskResourceID: resourceIds || null,
                            TaskPriority: task.priority,
                            SprintStatus: task.SprintStatus,
                            TaskType: task.type
                        };
                        newSprint.Tasks.push(newTask);
                    });

                    serializedData.Sprints.push(newSprint);
                });
            });
        });

        console.log(JSON.stringify(serializedData, null, 2));
        return serializedData;
    }

    saveData(data: any): void {
        this.ganttInstance.mask('Saving data...');

        this.apiService.saveGanttData(data).subscribe({
            next: () => {
                setTimeout(() => {
                    this.ganttInstance.unmask();
                    console.log('Data saved successfully');
                    Toast.show('Data saved successfully');
                }, 2000);
            },
            error: (error) => {
                this.ganttInstance.unmask();
                console.error('Error saving data', error);
                Toast.show('Error saving data');
            }
        });
    }

    logSerializedData(): void {
        this.serializeGanttData();
    }

    logStoreContents(): void {
        if (this.ganttInstance && this.ganttInstance.project) {
            const resources = this.ganttInstance.project.resourceStore.records.map(res => ({
                id: res.id,
                name: res.name
            }));
            const assignments = this.ganttInstance.project.assignmentStore.records.map(assign => ({
                id: assign.id,
                resourceId: assign.resourceId,
                eventId: assign.eventId
            }));

            console.log('ResourceStore contents:', resources);
            console.log('AssignmentStore contents:', assignments);
        } else {
            console.error('Gantt chart or project not initialized');
        }
    }

    registerCustomPreset(): void {
        PresetManager.registerPreset('customPreset', {
            tickWidth: 35,
            displayDateFormat: 'HH:mm',
            shiftIncrement: 1,
            shiftUnit: 'day',
            defaultSpan: 24,
            timeResolution: {
                unit: 'minute',
                increment: 30
            },
            headers: [
                {
                    unit: 'day',
                    dateFormat: 'MMM DD, YYYY'
                },
                {
                    unit: 'hour',
                    dateFormat: 'HH:mm'
                }
            ]
        });
    }

    updateGanttProjectDates(tasks: any[]): void {
        if (tasks.length === 0) {
            console.error('No tasks found to determine date range.');
            return;
        }

        const { minStartDate, maxEndDate } = this.calculateDateRange(tasks);

        this.ganttInstance.project.setStartDate(minStartDate);
        this.ganttInstance.project.setEndDate(maxEndDate);
        console.log('Gantt timeline updated to:', minStartDate, maxEndDate);

        this.zoomToFit(minStartDate, maxEndDate);
    }

    calculateDateRange(tasks: any[]): { minStartDate: Date, maxEndDate: Date } {
        let minStartDate = new Date(tasks[0].startDate);
        let maxEndDate = new Date(tasks[0].endDate);

        tasks.forEach(task => {
            const taskStartDate = new Date(task.startDate);
            const taskEndDate = new Date(task.endDate);
            if (taskStartDate < minStartDate) {
                minStartDate = taskStartDate;
            }
            if (taskEndDate > maxEndDate) {
                maxEndDate = taskEndDate;
            }
        });

        return { minStartDate, maxEndDate };
    }

    zoomToFit(startDate: Date, endDate: Date): void {
        const adjustedStartDate = new Date(startDate);
        adjustedStartDate.setMonth(adjustedStartDate.getMonth() - 1);

        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setMonth(adjustedEndDate.getMonth() + 1);

        this.ganttInstance.setTimeSpan(adjustedStartDate, adjustedEndDate);

        this.ganttInstance.viewPreset = 'customPreset';

        this.ganttInstance.zoomToFit({
            startDate: adjustedStartDate,
            endDate: adjustedEndDate,
        });

        this.ganttInstance.zoomIn();
        this.ganttInstance.zoomIn();

        this.ganttInstance.scrollToDate(startDate, {
            block: 'start',
            animate: true
        });
    }
}