import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Injectable } from '@nestjs/common'

interface CommentOnQuestionRequest {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionCommentsRepository: QuestionsCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionRequest): Promise<CommentOnQuestionResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.questionCommentsRepository.create(questionComment)

    return right({
      questionComment,
    })
  }
}
