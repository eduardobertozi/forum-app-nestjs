import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'

interface EditAnswerRequest {
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds,
  }: EditAnswerRequest): Promise<EditAnswerResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    const answerAttachmentsList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    const answerAttachments = attachmentsIds.map((attachmentsId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentsId),
        answerId: answer.id,
      })
    })

    answerAttachmentsList.update(answerAttachments)

    answer.content = content
    answer.attachments = answerAttachmentsList

    await this.answersRepository.save(answer)

    return right({
      answer,
    })
  }
}
