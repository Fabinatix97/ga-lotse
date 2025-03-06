/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config;

import de.eshg.domain.model.BaseEntity;
import de.eshg.persistence.TransactionHelper;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

public abstract class EshgConfigurationService<T extends BaseEntity> {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private final EntityManager entityManager;
  private final TransactionHelper transactionHelper;
  private final Class<T> configClass;

  protected EshgConfigurationService(
      EntityManager entityManager, TransactionHelper transactionHelper, Class<T> configClass) {
    this.entityManager = entityManager;
    this.transactionHelper = transactionHelper;
    this.configClass = configClass;
  }

  protected abstract T getInitialConfiguration() throws Exception;

  @Transactional(readOnly = true)
  public T getConfig() {
    List<T> configEntries = getConfigEntries();
    Assert.isTrue(
        configEntries.size() == 1,
        "Expected exactly one config entries in the database, but found " + configEntries.size());

    return configEntries.getFirst();
  }

  @PostConstruct
  public void init() {
    // explicit transaction handling necessary for @PostConstruct
    transactionHelper.executeInTransaction(
        () -> {
          long numberOfConfigEntries = countConfigEntries();
          if (numberOfConfigEntries == 0) {
            T initialConfiguration = getInitialConfiguration();
            Assert.notNull(initialConfiguration, "No initial config provided.");
            log.info("Initializing configurations in db.");
            entityManager.persist(initialConfiguration);
          } else {
            Assert.isTrue(
                numberOfConfigEntries == 1, "Found more than one config entry in the database.");
          }
        });
  }

  private long countConfigEntries() {
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
    countQuery.select(criteriaBuilder.count(countQuery.from(configClass)));
    return entityManager.createQuery(countQuery).getSingleResult();
  }

  private List<T> getConfigEntries() {
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<T> query = criteriaBuilder.createQuery(this.configClass);
    query.from(this.configClass);
    return entityManager.createQuery(query).getResultList();
  }
}
