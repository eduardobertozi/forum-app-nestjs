import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment.repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentRepository
{
  public items: AnswerAttachment[] = []

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments)
    await Promise.resolve()
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    const answerAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = answerAttachments
    await Promise.resolve()
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    return Promise.resolve(
      this.items.filter((item) => item.answerId.toString() === answerId),
    )
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    )
    await Promise.resolve()
  }
}
