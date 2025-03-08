import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment.repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private readonly answerAttachmentsRepository?: AnswerAttachmentRepository,
  ) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return Promise.resolve(answer)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    return Promise.resolve(
      this.items
        .filter((item) => item.questionId.toString() === questionId)
        .slice((page - 1) * 20, page * 20),
    )
  }

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)

    await this.answerAttachmentsRepository?.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
    await Promise.resolve()
  }

  async save(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)
    this.items[itemIndex] = answer

    await this.answerAttachmentsRepository?.createMany(
      answer.attachments.getNewItems(),
    )

    await this.answerAttachmentsRepository?.deleteMany(
      answer.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
    await Promise.resolve()
  }

  async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)
    this.items.splice(itemIndex, 1)
    await this.answerAttachmentsRepository?.deleteManyByAnswerId(
      answer.id.toString(),
    )
  }
}
