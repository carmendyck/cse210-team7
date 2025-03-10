import { Term } from './TermInterface';

export interface Course {
    user_id: string | null;
    course_name: string | null;
    avg_time_homework: string | null;
    avg_time_project: string | null;
    avg_time_quiz: string | null;
    avg_time_reading: string | null;
    avg_time_test: string | null;
    course_index: number | null;
}