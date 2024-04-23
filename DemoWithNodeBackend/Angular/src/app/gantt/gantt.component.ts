import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { APIService } from '../api.service';
import ganttConfig from './gantt.config';
import { Gantt } from '@bryntum/gantt';

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

    constructor(private apiService: APIService) {}

    ngOnInit(): void {
        this.initializeFilters();
    }

    ngAfterViewInit(): void {
        this.initializeGantt();
    }

    initializeGantt(): void {
        this.ganttInstance = new Gantt({
            appendTo: this.ganttContainer.nativeElement,
            ...this.ganttConfig
        });
    }

    initializeFilters(): void {
        this.apiService.fetchAllClients().subscribe({
            next: (data) => this.clients = data.data,
            error: (error) => console.error('Error fetching clients', error)
        });
    
        this.apiService.fetchAllProjects().subscribe({
            next: (data) => this.projects = data.data,
            error: (error) => console.error('Error fetching projects', error)
        });
    
        this.apiService.fetchAllSprints().subscribe({
            next: (data) => this.sprints = data.data,
            error: (error) => console.error('Error fetching sprints', error)
        });
    
        this.apiService.fetchAllResources().subscribe({
            next: (data) => this.resources = data.data,
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
    
        Object.keys(params).forEach(key => {
            if (params[key] === '') {
                delete params[key];
            }
        });
    
        this.apiService.fetchFilteredData(params).subscribe({
            next: (response) => {
                if (this.ganttInstance && this.ganttInstance.project && this.ganttInstance.project.taskStore) {
                    this.ganttInstance.project.taskStore.loadData(response.data);
                    console.log('Filters applied, data loaded');
                } else {
                    console.error('Gantt chart or project not initialized');
                }
            },
            error: (error) => {
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
        console.log(`Selected ${category}:`, array);
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
        console.log(`Updating dropdowns, changed category: ${changedCategory}`);
        console.log('Current selections:', {
            clients: this.selectedClients,
            projects: this.selectedProjects,
            sprints: this.selectedSprints,
            resources: this.selectedResources
        });
    
        let params = {
            ClientID: this.selectedClients.join(',') || '',
            ProjectID: this.selectedProjects.join(',') || '',
            SprintID: this.selectedSprints.join(',') || '',
            ResourceID: this.selectedResources.join(',') || ''
        };
    
        switch (changedCategory) {
            case 'client':
                this.apiService.fetchProjects(params).subscribe(data => this.projects = data.data);
                this.apiService.fetchSprints(params).subscribe(data => this.sprints = data.data);
                this.apiService.fetchResources(params).subscribe(data => this.resources = data.data);
                break;
            case 'project':
                this.apiService.fetchClients(params).subscribe(data => this.clients = data.data);
                this.apiService.fetchSprints(params).subscribe(data => this.sprints = data.data);
                this.apiService.fetchResources(params).subscribe(data => this.resources = data.data);
                break;
            case 'sprint':
                this.apiService.fetchClients(params).subscribe(data => this.clients = data.data);
                this.apiService.fetchProjects(params).subscribe(data => this.projects = data.data);
                this.apiService.fetchResources(params).subscribe(data => this.resources = data.data);
                break;
            case 'resource':
                this.apiService.fetchClients(params).subscribe(data => this.clients = data.data);
                this.apiService.fetchProjects(params).subscribe(data => this.projects = data.data);
                this.apiService.fetchSprints(params).subscribe(data => this.sprints = data.data);
                break;
        }
    }
    
    


    toggleDropdown(event: Event): void {
        event.stopPropagation();
        const dropdown = (event.target as HTMLElement).closest('.dropdown');
        dropdown.classList.toggle('active');
    }
}
