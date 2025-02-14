export interface Task {
    name: string;
    notes: string;
    due_datetime: Date | null;
    time_estimate: number;
    category: Category | null;
    worktimes: Array<Date> | null;
}

export interface Category {
    category_name: string;
    academic_term: Term;
}

export interface Term {
    is_quarter: boolean;
    start_date: Date;
    end_date: Date;
}