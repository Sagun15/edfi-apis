import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Descriptor } from './descriptors/descriptor.entity';
import { CourseOffering } from './course-offering.entity';

@Entity('gradeleveldescriptor')
export class GradeLevelDescriptor extends Descriptor {
    @PrimaryColumn({ name: 'gradeleveldescriptorid', type: 'integer' })
    gradeLevelDescriptorId: number;

    @ManyToOne(() => CourseOffering, (co) => co.offeredGradeLevels)
    @JoinColumn([
        { name: 'localcoursecode', referencedColumnName: 'localCourseCode' },
        { name: 'schoolid', referencedColumnName: 'schoolId' },
        { name: 'schoolyear', referencedColumnName: 'schoolYear' },
        { name: 'sessionname', referencedColumnName: 'sessionName' }
    ])
    courseOffering: CourseOffering;
} 