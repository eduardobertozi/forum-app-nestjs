import { makeAnswer } from '@root/test/factories/make-answer'
import { makeQuestion } from '@root/test/factories/make-questions'
import { InMemoryAnswersRepository } from '@root/test/repositories/in-memory-answers.repository'
import { InMemoryNotificationsRepository } from '@root/test/repositories/in-memory-notifications.repository'
import { InMemoryQuestionsRepository } from '@root/test/repositories/in-memory-questions.repository'
import { waitFor } from '@root/test/utils/wait-for'
import { MockInstance } from 'vitest'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase

let sendNotificationExecutionSpy: MockInstance<
  SendNotificationUseCase['execute']
>

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecutionSpy = vi.spyOn(sendNotification, 'execute')

    new OnQuestionBestAnswerChosen(inMemoryAnswersRepository, sendNotification)
  })

  it('should send a notification when an question has new best answer chosen', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    question.bestAnswerId = answer.id
    await inMemoryQuestionsRepository.save(question)

    await waitFor(() => {
      expect(sendNotificationExecutionSpy).toHaveBeenCalled()
    })
  })
})
