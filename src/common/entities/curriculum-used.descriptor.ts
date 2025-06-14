import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Descriptor } from './descriptors/descriptor.entity';
import { CourseOffering } from './course-offering.entity';

@Entity('curriculumuseddescriptor')
export class CurriculumUsedDescriptor extends Descriptor {
    @PrimaryColumn({ name: 'curriculumuseddescriptorid', type: 'integer' })
    curriculumUsedDescriptorId: number;

    @ManyToOne(() => CourseOffering, (co) => co.curriculumUseds)
    @JoinColumn([
        { name: 'localcoursecode', referencedColumnName: 'localCourseCode' },
        { name: 'schoolid', referencedColumnName: 'schoolId' },
        { name: 'schoolyear', referencedColumnName: 'schoolYear' },
        { name: 'sessionname', referencedColumnName: 'sessionName' }
    ])
    courseOffering: CourseOffering;
} 