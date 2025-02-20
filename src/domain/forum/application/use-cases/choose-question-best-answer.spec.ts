import { InMemoryAnswersRepository } from '@root/test/repositories/in-memory-answers.repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from '@root/test/repositories/in-memory-questions.repository'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { makeAnswer } from '@root/test/factories/make-answer'
import { makeQuestion } from '@root/test/factories/make-questions'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionRepository,
      inMemoryAnswersRepository,
    )
  })

  it('should be able to thoose the question best answer', async () => {
    const question = makeQuestion()

    const answer = makeAnswer(
      {
        questionId: question.id,
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to thoose another user question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    })

    const answer = makeAnswer(
      {
        questionId: question.id,
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
