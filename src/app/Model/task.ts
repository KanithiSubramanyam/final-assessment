export interface Task {
    id?: string;
    clientName: string;
    taskTitle: string;
    description?: string;
    dueDate: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Not Started' | 'In Progress' | 'Completed';
    assignedTo?: string;
    assignedToEmail?: string;
    clientToEmail?: string;
  }
  