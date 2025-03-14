import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private readonly questionAttachmentsRepository?: QuestionAttachmentsRepository,
  ) {}

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return Promise.resolve(question)
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return Promise.resolve(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const sortedItems = this.items.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )

    return Promise.resolve(sortedItems.slice((page - 1) * 20, page * 20))
  }

  async create(question: Question): Promise<void> {
    this.items.push(question)

    /* Save question attachemts in questionAttachments repository */
    await this.questionAttachmentsRepository?.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
    await Promise.resolve()
  }

  async save(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items[itemIndex] = question

    /* Save question new attachemts in questionAttachments repository */
    await this.questionAttachmentsRepository?.createMany(
      question.attachments.getNewItems(),
    )

    /* Save question deleted attachemts in questionAttachments repository */
    await this.questionAttachmentsRepository?.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
    await Promise.resolve()
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items.splice(itemIndex, 1)

    await this.questionAttachmentsRepository?.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
