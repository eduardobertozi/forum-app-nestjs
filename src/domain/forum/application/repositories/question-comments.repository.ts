import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'

export abstract class QuestionsCommentsRepository {
  abstract findById(id: string): Promise<QuestionComment | null>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
  abstract create(questionComment: QuestionComment): Promise<void>
  abstract delete(questionComment: QuestionComment): Promise<void>
}
