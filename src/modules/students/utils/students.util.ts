import { Student } from 'src/common/entities/student.entity';
import { StudentDTO } from '../dto/student.dto';
import { BadRequestError } from 'src/common/errors/BadRequestError';

/**
 * Utility class for Student DTO transformations
 * Contains reusable transformation functions for Student entities
 */
export class StudentUtil {
    /**
     * Transforms an array of Student entities to StudentDTO array
     * 
     * @param students - Array of Student entities
     * @returns StudentDTO[] Array of transformed DTOs
     */
    static transformStudentsToDTO(students: Student[]): StudentDTO[] {
        return students.map(student => new StudentDTO(student));
    }

    /**
     * Transforms a single Student entity to StudentDTO
     * 
     * @param student - Student entity
     * @returns StudentDTO Transformed DTO
     */
    static transformStudentToDTO(student: Student): StudentDTO {
        return new StudentDTO(student);
    }

    /**
     * Validates Student business rules
     * 
     * @param studentData - Student data to validate
     * @returns boolean True if valid, throws BadRequestError if invalid
     */
    static validateBusinessRules(studentData: any): boolean {
        // Validate birth date is not in the future
        if (studentData.birthDate) {
            const birthDate = new Date(studentData.birthDate);
            const now = new Date();
            if (birthDate > now) {
                throw new BadRequestError('Birth date cannot be in the future');
            }
        }

        // Validate date entered US is not in the future and not before birth date
        if (studentData.dateEnteredUS) {
            const dateEnteredUS = new Date(studentData.dateEnteredUS);
            const now = new Date();
            if (dateEnteredUS > now) {
                throw new BadRequestError('Date entered US cannot be in the future');
            }
            
            if (studentData.birthDate) {
                const birthDate = new Date(studentData.birthDate);
                if (dateEnteredUS < birthDate) {
                    throw new BadRequestError('Date entered US cannot be before birth date');
                }
            }
        }

        // Validate name fields are not empty when provided
        if (studentData.firstName && !studentData.firstName.trim()) {
            throw new BadRequestError('First name cannot be empty');
        }
        
        if (studentData.lastSurname && !studentData.lastSurname.trim()) {
            throw new BadRequestError('Last surname cannot be empty');
        }

        // Validate student unique ID format (alphanumeric)
        if (studentData.studentUniqueId) {
            const alphanumericRegex = /^[a-zA-Z0-9]+$/;
            if (!alphanumericRegex.test(studentData.studentUniqueId)) {
                throw new BadRequestError('Student unique ID must be alphanumeric');
            }
        }

        return true;
    }

    /**
     * Validates and converts descriptor URI to numeric ID
     * 
     * @param descriptorUri - Descriptor URI (e.g., "uri://ed-fi.org/SexDescriptor#Male")
     * @returns number Extracted numeric ID from URI
     * @throws BadRequestError if URI format is invalid
     */
    static extractDescriptorId(descriptorUri: string): number {
        // For now, we'll assume the descriptor URI contains the ID at the end
        // This would need to be implemented based on your descriptor resolution strategy
        // Example: "uri://ed-fi.org/SexDescriptor#1" -> 1
        const match = descriptorUri.match(/#(\d+)$/);
        if (match) {
            return parseInt(match[1], 10);
        }
        
        // If no numeric ID in URI, this would require a lookup service
        // For now, throw an error indicating the need for descriptor resolution
        throw new BadRequestError(`Invalid descriptor URI format: ${descriptorUri}. Descriptor resolution not implemented.`);
    }
}

// Export transformation functions for service usage
export const transformStudentsToDTO = StudentUtil.transformStudentsToDTO;
export const transformStudentToDTO = StudentUtil.transformStudentToDTO;
export const validateBusinessRules = StudentUtil.validateBusinessRules; 