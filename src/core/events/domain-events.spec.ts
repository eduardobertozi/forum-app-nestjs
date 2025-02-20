import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

/**
 * Representa um evento de domínio para uma entidade criada
 * É o molde de um evento de dominio que será disparado para uma determinada entidade
 */
class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

/**
 * Quando um novo agregado (entidade) é criado, um evento é adicionado
 */
class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    /**
     * Simula o listener que será executado no disparo do evento
     * O spy retorna a informação se foi chamado ou não
     */
    const callBackSpy = vi.fn()

    /**
     * Registra o Subscreber para ouvir o evento de resposta criada
     * O nome do evento é o nome da classe acessível no javascript
     */
    DomainEvents.register(callBackSpy, CustomAggregateCreated.name)

    /* Executando a criação de uma entidade aggregate para fazer o disparo do evento */
    const aggregate = CustomAggregate.create()

    /* Estou assegurando que o evento foi criado porém não foi disparado */
    expect(aggregate.domainEvents).toHaveLength(1)

    /**
     * O repositório de persistência será chamado e marca o evento para ser disparado
     */
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    /* O subscriber ouve o evento e faz o que precisa ser feito com o dado */
    expect(callBackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
