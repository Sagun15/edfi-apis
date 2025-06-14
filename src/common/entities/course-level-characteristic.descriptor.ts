import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Descriptor } from './descriptors/descriptor.entity';
import { CourseOffering } from './course-offering.entity';

@Entity('courselevelcharacteristicdescriptor')
export class CourseLevelCharacteristicDescriptor extends Descriptor {
    @PrimaryColumn({ name: 'courseleveldescriptorid', type: 'integer' })
    courseLevelDescriptorId: number;

    @ManyToOne(() => CourseOffering, (co) => co.courseLevelCharacteristics)
    @JoinColumn([
        { name: 'localcoursecode', referencedColumnName: 'localCourseCode' },
        { name: 'schoolid', referencedColumnName: 'schoolId' },
        { name: 'schoolyear', referencedColumnName: 'schoolYear' },
        { name: 'sessionname', referencedColumnName: 'sessionName' }
    ])
    courseOffering: CourseOffering;
} 