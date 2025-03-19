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

  next_start_time: Date | null;
  next_end_time: Date | null;

  time_spent: number;
  total_time_estimate: number;

  completed: boolean;
}