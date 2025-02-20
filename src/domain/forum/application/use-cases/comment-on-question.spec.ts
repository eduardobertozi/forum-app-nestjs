import { InMemoryQuestionsRepository } from '@root/test/repositories/in-memory-questions.repository'
import { makeQuestion } from '@root/test/factories/make-questions'
import { InMemoryQuestionCommentsRepository } from '@root/test/repositories/in-memory-questions-comment.repository'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Comentário teste',
    })

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      'Comentário teste',
    )
  })
})
