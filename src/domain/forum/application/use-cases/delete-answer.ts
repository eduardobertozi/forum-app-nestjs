import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface DeleteAnswerRequest {
  authorId: string
  answerId: string
}

type DeleteAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerRequest): Promise<DeleteAnswerResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(answer)

    return right(null)
  }
}
