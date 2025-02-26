import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/strategy'
import { Controller, Delete, HttpCode, Param } from '@nestjs/common'

@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private readonly deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const userId = user.sub

    await this.deleteAnswer.execute({
      authorId: userId,
      answerId,
    })
  }
}
