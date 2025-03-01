import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments.repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  create(attachment: Attachment): Promise<Attachment> {
    this.items.push(attachment)
    return Promise.resolve(attachment)
  }
}
