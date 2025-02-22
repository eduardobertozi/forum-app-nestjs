import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comments.repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Injectable } from '@nestjs/common'

interface CommentOnAnswerRequest {
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: AnswerComment
  }
>

@Injectable()
export class CommentOnAnswerUseCase {
  constructor(
    private readonly questionsRepository: AnswersRepository,
    private readonly questionCommentsRepository: AnswersCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerRequest): Promise<CommentOnAnswerResponse> {
    const question = await this.questionsRepository.findById(answerId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content,
    })

    await this.questionCommentsRepository.create(questionComment)

    return right({ questionComment })
  }
}
