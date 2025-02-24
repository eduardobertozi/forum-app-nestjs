import { Student } from '@/domain/authentication/enterprise/entities/student'

export abstract class StudentsRepository {
  abstract findByEmail(email: string): Promise<Student | null>
  abstract create(student: Student): Promise<void>
}
