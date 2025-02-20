import { makeAnswer } from '@root/test/factories/make-answer'
import { makeQuestion } from '@root/test/factories/make-questions'
import { InMemoryAnswersRepository } from '@root/test/repositories/in-memory-answers.repository'
import { InMemoryNotificationsRepository } from '@root/test/repositories/in-memory-notifications.repository'
import { InMemoryQuestionsRepository } from '@root/test/repositories/in-memory-questions.repository'
import { MockInstance } from 'vitest'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { OnAnswerCreated } from './on-answer-created'
import { waitFor } from '@root/test/utils/wait-for'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase

/* SpyInstance não existe mais */
let sendNotificationExecutionSpy: MockInstance<
  SendNotificationUseCase['execute']
>

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    /**
     * Espia o método execute da classe sendNotification
     * Verifica se foi disparado ou não
     */
    sendNotificationExecutionSpy = vi.spyOn(sendNotification, 'execute')

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotification)
  })

  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    await waitFor(() => {
      expect(sendNotificationExecutionSpy).toHaveBeenCalled()
    })
  })
})
