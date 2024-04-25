import { TaskModel } from '@bryntum/gantt';

export default class Task extends TaskModel {
    static get $name() {
        return 'Task';
    }

    static fields = [ 'status', 'clientName', 'priority', 'completed', 'type', 'ProjectID' ]
}