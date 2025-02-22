import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteQuestionCommentRequest {
  authorId: string
  questionCommentId: string
}

type DeleteQuestionCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteQuestionCommentUseCase {
  constructor(
    private readonly questionCommentsRepository: QuestionsCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentRequest): Promise<DeleteQuestionCommentResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComment)

    return right(null)
  }
}
