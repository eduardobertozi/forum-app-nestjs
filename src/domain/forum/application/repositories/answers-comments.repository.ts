import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface AnswersCommentsRepository {
  findById(id: string): Promise<AnswerComment | null>
  findManyByAnswerId(
    questionId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>
  create(answerComment: AnswerComment): Promise<void>
  delete(answerComment: AnswerComment): Promise<void>
}
