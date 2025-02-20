import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'

export class InMemoryQuestionCommentsRepository
  implements QuestionsCommentsRepository
{
  public items: QuestionComment[] = []

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    if (!questionComment) {
      return null
    }

    return Promise.resolve(questionComment)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    return Promise.resolve(
      this.items
        .filter((item) => item.questionId.toString() === questionId)
        .slice((page - 1) * 20, page * 20),
    )
  }

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment)
    await Promise.resolve()
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )
    this.items.splice(itemIndex, 1)
    await Promise.resolve()
  }
}
