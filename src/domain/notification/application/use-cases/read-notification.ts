import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications.repository'

interface ReadNotificationRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationRequest): Promise<ReadNotificationResponse> {
    const notification =
      await this.notificationsRepository.findByID(notificationId)

    if (!notificationId) {
      return left(new ResourceNotFoundError())
    }

    if (recipientId !== notification?.recipientId.toString()) {
      return left(new NotAllowedError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return right({
      notification,
    })
  }
}
