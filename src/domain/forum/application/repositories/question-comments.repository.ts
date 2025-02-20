import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface QuestionsCommentsRepository {
  findById(id: string): Promise<QuestionComment | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
  create(questionComment: QuestionComment): Promise<void>
  delete(questionComment: QuestionComment): Promise<void>
}
