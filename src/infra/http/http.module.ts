import { Module } from '@nestjs/common'

import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { AuthenticateStudentUseCase } from '@/domain/authentication/application/use-cases/authenticate-student'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { RegisterStudentUseCase } from '@/domain/authentication/application/use-cases/register-student'
import { GetQuestionBySlugController } from './controllers/get-questions-by-slug.controller'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
  ],
  providers: [
    AuthenticateStudentUseCase,
    RegisterStudentUseCase,
    CreateQuestionUseCase,
    DeleteQuestionCommentUseCase,
    DeleteAnswerCommentUseCase,
    ChooseQuestionBestAnswerUseCase,
    FetchRecentQuestionsUseCase,
    CommentOnQuestionUseCase,
    CommentOnAnswerUseCase,
    GetQuestionBySlugUseCase,
  ],
})
export class HttpModule {}
