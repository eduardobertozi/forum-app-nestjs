import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AnswerFactory } from '@root/test/factories/make-answer'
import { AnswerCommentFactory } from '@root/test/factories/make-answer-comment'
import { QuestionFactory } from '@root/test/factories/make-question'
import { StudentFactory } from '@root/test/factories/make-student'
import request from 'supertest'

describe('Fetch Answer Comments (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent()

    const access_token = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    await Promise.all([
      answerCommentFactory.makePrismaAnswerComment({
        answerId: answer.id,
        content: 'Comment 01',
        authorId: user.id,
      }),
      answerCommentFactory.makePrismaAnswerComment({
        answerId: answer.id,
        content: 'Comment 02',
        authorId: user.id,
      }),
    ])

    const questionId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/answers/${questionId}/comments`)
      .set('Authorization', `Bearer ${access_token}`)

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          content: 'Comment 01',
        }),
        expect.objectContaining({
          content: 'Comment 02',
        }),
      ]),
    })
  })
})
