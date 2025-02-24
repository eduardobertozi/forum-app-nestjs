import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { EncrypterGateway } from '../cryptography/encrypter'
import { HashComparerGateway } from '../cryptography/hasher'
import { StudentsRepository } from '../repositories/students.repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateStudentRequest {
  email: string
  password: string
}

type AuthenticateStudentResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly hashCompare: HashComparerGateway,
    private readonly encrypter: EncrypterGateway,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentRequest): Promise<AuthenticateStudentResponse> {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      student.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
