import { StudentsRepository } from '@/domain/authentication/application/repositories/students.repository'
import { Student } from '@/domain/authentication/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((student) => student.email === email)
    return Promise.resolve(student || null)
  }

  create(student: Student): Promise<void> {
    this.items.push(student)
    return Promise.resolve()
  }
}
