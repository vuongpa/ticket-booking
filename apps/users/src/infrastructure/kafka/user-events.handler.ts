import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../../domain/events/user-created.event';
import { KafkaService } from './kafka.service';

@Injectable()
@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  constructor(private readonly kafkaService: KafkaService) {}

  async handle(event: UserCreatedEvent) {
    const producer = this.kafkaService.getProducer();

    // Publish event to Kafka for other services
    await producer.send({
      topic: 'user.events',
      messages: [
        {
          key: event.userId,
          value: JSON.stringify({
            type: 'UserCreated',
            data: {
              userId: event.userId,
              email: event.email,
              timestamp: new Date().toISOString(),
            },
          }),
        },
      ],
    });
  }
}
