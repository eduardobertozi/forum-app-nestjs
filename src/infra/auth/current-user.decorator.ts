import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserPayload } from './strategy'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request: { user: UserPayload } = context.switchToHttp().getRequest()

    return request.user
  },
)
