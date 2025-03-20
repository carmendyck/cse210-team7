import { Course } from './CourseInterface';
import { Tag } from './TagInterface';

export interface NewTask {
  user_id: string | null;

  name: string;
  notes: string;
  location: string;
  due_datetime: Date;

  priority: number;
  course_id: String | null;
  tags: Array<Tag>;

  time_spent: number;
  total_time_estimate: number;

  completed: boolean;
}

export interface CurrentTask {
  name: string;
  notes: string;
  location: string;

  priority: number;
  due_datetime: Date;
  course_id: String | null;

  tags: Array<Tag>;

  total_time_estimate: number;
}

export interface FullQueriedTask {
  completed: boolean;
  course_id: string | null;
  due_datetime: string;
  id: string;
  location: string;
  name: string;
  notes: string;
  priority: number;
  tags: Array<Tag>;
  time_spent: number;
  total_time_estimate: number;
  user_id: string;
};