import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'

export abstract class AnswersCommentsRepository {
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract findManyByAnswerId(
    questionId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract delete(answerComment: AnswerComment): Promise<void>
}
