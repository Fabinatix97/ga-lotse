/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.persistence;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManagerFactory;
import org.hibernate.event.service.spi.EventListenerRegistry;
import org.hibernate.event.spi.EventType;
import org.hibernate.internal.SessionFactoryImpl;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
public class EshgHibernateEventListenerConfiguration {
  private final EntityManagerFactory entityManagerFactory;

  public EshgHibernateEventListenerConfiguration(EntityManagerFactory entityManagerFactory) {
    this.entityManagerFactory = entityManagerFactory;
  }

  @Bean
  public ControlCharacterValidationEventListener characterVerificationEventListener() {
    return new ControlCharacterValidationEventListener();
  }

  @PostConstruct
  public void registerListeners() {
    SessionFactoryImpl sessionFactory = entityManagerFactory.unwrap(SessionFactoryImpl.class);
    EventListenerRegistry registry =
        sessionFactory.getServiceRegistry().getService(EventListenerRegistry.class);
    ControlCharacterValidationEventListener listener = characterVerificationEventListener();
    assert registry != null;
    registry.getEventListenerGroup(EventType.PRE_INSERT).appendListener(listener);
    registry.getEventListenerGroup(EventType.PRE_UPDATE).appendListener(listener);
  }
}
