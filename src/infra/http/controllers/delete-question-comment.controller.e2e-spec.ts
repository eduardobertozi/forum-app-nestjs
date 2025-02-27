import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { QuestionCommentFactory } from '@root/test/factories/make-question-comment'
import { QuestionFactory } from '@root/test/factories/make-questions'
import { StudentFactory } from '@root/test/factories/make-student'
import request from 'supertest'

describe('Delete Question Comment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /questions/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent()
    const access_token = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const questionComment = await questionCommentFactory.makePrismaQuestion({
      authorId: user.id,
      questionId: question.id,
    })

    const questionCommentId = questionComment.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${questionCommentId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(response.statusCode).toBe(204)

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        id: questionCommentId,
      },
    })

    expect(commentOnDatabase).toBeNull()
  })
})
