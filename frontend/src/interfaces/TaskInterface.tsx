import { Course } from './CourseInterface';
import { Tag } from './TagInterface';

export interface NewTask {
  user_id: string | null;

  name: string;
  notes: string;
  location: string;
  due_datetime: Date;

  course_id: String | null;
  tags: Array<Tag>;

  next_start_time: Date | null;
  next_end_time: Date | null;

  time_spent: number;
  total_time_estimate: number;

  completed: boolean;
}

export interface CurrentTask {
  name: string;
  notes: string;
  location: string;

  due_datetime: Date;
  course_id: String | null;

  tags: Array<Tag>;

  total_time_estimate: number;
}