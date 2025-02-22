import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers.repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Injectable } from '@nestjs/common'

interface AnswerQuestionRequest {
  instructorId: string
  questionId: string
  content: string
  attachmentsIds: string[]
}

type AnswerQuestionResponse = Either<
  null,
  {
    answer: Answer
  }
>

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    instructorId,
    content,
    attachmentsIds,
  }: AnswerQuestionRequest): Promise<AnswerQuestionResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    })

    const answerAttachments = attachmentsIds.map((attachmentsId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentsId),
        answerId: answer.id,
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachments)

    await this.answersRepository.create(answer)

    return right({ answer })
  }
}
