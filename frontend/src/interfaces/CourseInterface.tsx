import { Term } from './TermInterface';

export interface Course {
    course_name: string;
    academic_term: Term;
    notes: string;
}