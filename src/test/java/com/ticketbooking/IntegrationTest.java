package com.ticketbooking;

import com.ticketbooking.config.AsyncSyncConfiguration;
import com.ticketbooking.config.EmbeddedElasticsearch;
import com.ticketbooking.config.EmbeddedKafka;
import com.ticketbooking.config.EmbeddedSQL;
import com.ticketbooking.config.JacksonConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { TicketbookingApp.class, JacksonConfiguration.class, AsyncSyncConfiguration.class })
@EmbeddedElasticsearch
@EmbeddedSQL
@EmbeddedKafka
public @interface IntegrationTest {
}
