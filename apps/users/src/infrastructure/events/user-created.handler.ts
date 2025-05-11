import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KafkaService } from '../kafka/kafka.service';

interface UserCreatedEvent {
  userId: string;
  email: string;
  timestamp: string;
}

@Controller()
export class UserEventHandler {
  constructor(private readonly kafkaService: KafkaService) {}

  @EventPattern('user.created')
  async handleUserCreated(@Payload() event: UserCreatedEvent) {
    const producer = this.kafkaService.getProducer();

    // Forward the event to Kafka for external services
    await producer.send({
      topic: 'user.events',
      messages: [
        {
          key: event.userId,
          value: JSON.stringify({
            type: 'UserCreated',
            data: event,
          }),
        },
      ],
    });

    // Here you can also:
    // 1. Transform the event for different consumers
    // 2. Store event in event store
    // 3. Trigger other business processes
    // 4. Send notifications
  }
}
