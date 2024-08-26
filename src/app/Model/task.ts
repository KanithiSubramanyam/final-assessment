export interface Task {
    id?: string; // Optional for new tasks, required for existing tasks
    clientName: string;
    taskTitle: string;
    description?: string;
    dueDate: string; // Typically a datetime string or Date object
    priority: 'Low' | 'Medium' | 'High';
    status: 'Not Started' | 'In Progress' | 'Completed';
    assignedTo?: string;
  }
  