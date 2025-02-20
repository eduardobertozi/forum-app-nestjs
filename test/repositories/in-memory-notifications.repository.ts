import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications.repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async findByID(id: string): Promise<Notification | null> {
    const notification = this.items.find(
      (notification) => notification.id.toString() === id,
    )

    if (!notification) {
      return null
    }

    return Promise.resolve(notification)
  }

  async create(notification: Notification) {
    this.items.push(notification)
    await Promise.resolve()
  }

  async save(notification: Notification): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === notification.id,
    )
    this.items[itemIndex] = notification
    await Promise.resolve()
  }
}
