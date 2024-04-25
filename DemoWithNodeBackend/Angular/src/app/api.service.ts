import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIService {
    constructor(private http: HttpClient) {}

    fetchClients(params: { ResourceID: string, ClientID: string, ProjectID: string }): Observable<any> {
        return this.http.post('api/FilteredClients', params);
      }

    fetchProjects(params: { ClientID: string, SprintID: string, ResourceID: string }): Observable<any> {
        return this.http.post('api/FilteredProjects', params);
    }

    fetchSprints(params: { ClientID: string, ProjectID: string, ResourceID: string}): Observable<any> {
        return this.http.post('api/FilteredSprints', params);
    }

    fetchResources( params: { ClientID: string, ProjectID: string, SprintID: string}): Observable<any> {
        return this.http.post('api/FileredResources', params);
    }

    fetchFilteredData(filters: any): Observable<any> {
        return this.http.post('api/FilteredData', filters);
    }

    fetchAllClients(): Observable<any> {
        return this.http.get('api/Clients');
    }

    fetchAllProjects(): Observable<any> {
        return this.http.get('api/Projects');
    }

    fetchAllSprints(): Observable<any> {
        return this.http.get('api/Sprints');
    }

    fetchAllResources(): Observable<any> {
        return this.http.get('api/Resources');
    }

    saveGanttData(data: any) {
        const url = 'https://your-api-url.com/saveGanttData';
        return this.http.post(url, data);
    }
}
