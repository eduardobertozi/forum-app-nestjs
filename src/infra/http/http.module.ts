import { Module } from '@nestjs/common'

import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    CreateQuestionUseCase,
    DeleteQuestionCommentUseCase,
    DeleteAnswerCommentUseCase,
    ChooseQuestionBestAnswerUseCase,
    FetchAnswerCommentsUseCase,
    CommentOnQuestionUseCase,
    CommentOnAnswerUseCase,
  ],
})
export class HttpModule {}
