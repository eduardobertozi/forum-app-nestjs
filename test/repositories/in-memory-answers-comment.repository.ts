import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comments.repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'

export class InMemoryAnswerCommentsRepository
  implements AnswersCommentsRepository
{
  public items: AnswerComment[] = []

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return Promise.resolve(answerComment)
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    return Promise.resolve(
      this.items
        .filter((item) => item.answerId.toString() === answerId)
        .slice((page - 1) * 20, page * 20),
    )
  }

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment)
    await Promise.resolve()
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )
    this.items.splice(itemIndex, 1)
    await Promise.resolve()
  }
}
