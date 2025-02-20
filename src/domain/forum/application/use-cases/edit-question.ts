import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Either, left, right } from '@/core/either'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditQuestionRequest {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionRequest): Promise<EditQuestionResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

    const questionAttachmentsList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    const questionAttachments = attachmentsIds.map((attachmentsId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentsId),
        questionId: question.id,
      })
    })

    questionAttachmentsList.update(questionAttachments)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentsList

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
