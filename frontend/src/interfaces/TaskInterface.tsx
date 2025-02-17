import { Course } from './CourseInterface';
import { Tag } from './TagInterface';

export interface Task {
    name: string | null;
    notes: string | null;
    location: string | null;
    due_datetime: Date;

    course: Course | null;
    tags: Array<Tag>;

    next_worktimes: Array<Date>;
    prev_worktimes: Array<Date>;
    time_left_estimate: number;
    time_spent: number;

    completed: boolean;
}