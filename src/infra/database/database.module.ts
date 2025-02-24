import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions.reporitory'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments.repository'
import { PrismaQuestionAttatchmentsRepository } from './prisma/repositories/prisma-question-attachments.repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers.repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments.repository'
import { PrismaAnswerAttatchmentsRepository } from './prisma/repositories/prisma-answer-attachments.repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository'
import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository'
import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comments.repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository'
import { StudentsRepository } from '@/domain/authentication/application/repositories/students.repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students.repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: QuestionsCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttatchmentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: AnswersCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttatchmentsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
  ],
  exports: [
    PrismaService,
    StudentsRepository,
    QuestionsRepository,
    QuestionsCommentsRepository,
    QuestionAttachmentsRepository,
    AnswersRepository,
    AnswersCommentsRepository,
    AnswerAttachmentsRepository,
  ],
})
export class DatabaseModule {}
