import { Course } from './CourseInterface';
import { Tag } from './TagInterface';

export interface TaskListItem {
  id: string;

  user_id: string | null;

  name: string | null;
  notes: string | null;
  location: string | null;
  due_datetime: Date;

  priority: number;
  course_id: String | null;
  tags: Array<Tag>;

  time_spent: number;
  total_time_estimate: number;

  completed: boolean;
}

export interface WorktimeItem {
  user_id: string;
  task_id: any;
  task_name: string;
  task_due_date: string;

  date: string;
  hours: number;
  completed: boolean;
}