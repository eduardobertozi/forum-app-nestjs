import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from '@root/test/factories/make-answer'

describe('Answer', () => {
  it('should be able create a answer and add a event', () => {
    const answer = makeAnswer()

    expect(answer.id).toBeInstanceOf(UniqueEntityID)
    expect(answer.domainEvents).toHaveLength(1)
  })
})
