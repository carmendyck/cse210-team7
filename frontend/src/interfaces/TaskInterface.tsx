import { Category } from './CategoryInterface';

export interface Task {
    name: string;
    notes: string;
    due_datetime: Date | null;
    time_estimate: number;
    category: Category | null;
    worktimes: Array<Date> | null;
}