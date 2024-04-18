import { Component, OnInit } from '@angular/core';
import ganttConfig from './gantt.config';

@Component({
    selector    : 'app-gantt',
    templateUrl : './gantt.component.html'
})
export class GanttComponent implements OnInit {
    ganttConfig = ganttConfig;
    ngOnInit() {
        // console.log(this.ganttConfig);
    }
}
