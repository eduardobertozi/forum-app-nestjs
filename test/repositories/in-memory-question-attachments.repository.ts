import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    return Promise.resolve(
      this.items.filter((item) => item.questionId.toString() === questionId),
    )
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments)
    await Promise.resolve()
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const questionAttachments = this.items.filter((item) => {
      /* Compare if exists a current item exists in the list of to remove */
      const equalAttachmentsItems = attachments.some((attachment) =>
        attachment.equals(item),
      )

      /* Return items without removed items */
      const attachmentsNotEqualRemoveAttachmentsList = !equalAttachmentsItems
      return attachmentsNotEqualRemoveAttachmentsList
    })

    /* New list of items without removed */
    this.items = questionAttachments
    await Promise.resolve()
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    this.items = this.items = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )
    await Promise.resolve()
  }
}
