import { Course } from '../../../common/entities/course.entity';
import { CourseDTO } from '../dto/course.dto';

/**
 * Transforms array of Course entities to CourseDTO array
 * @param coursesFromDatabase Array of Course entities
 * @returns Array of CourseDTOs
 */
export function transformCoursesToDTO(coursesFromDatabase: Course[]): CourseDTO[] {
    return coursesFromDatabase.map((courseEntity: Course) => new CourseDTO(courseEntity));
} 