/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.cemetery;

import de.eshg.domain.model.EntityWithExternalId;
import de.eshg.domain.model.GenericEntity;
import de.eshg.domain.model.serialization.SerializationService;
import de.eshg.lib.procedure.domain.model.Cemetery;
import de.eshg.lib.procedure.domain.repository.CemeteryRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.Period;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional(propagation = Propagation.MANDATORY)
public class CemeteryService {

  private final CemeteryRepository cemeteryRepository;
  private final CemeteryProperties cemeteryProperties;
  private final SerializationService serializationService;
  private final Clock clock;

  public CemeteryService(
      CemeteryRepository cemeteryRepository,
      CemeteryProperties cemeteryProperties,
      SerializationService serializationService,
      Clock clock) {
    this.cemeteryRepository = cemeteryRepository;
    this.cemeteryProperties = cemeteryProperties;
    this.serializationService = serializationService;
    this.clock = clock;
  }

  /**
   * Writes an entity in serialized form (as a json string) into the cemetery table. After the
   * specified retention period has passed, the serialized entity will also be deleted from the
   * cemetery table.
   *
   * @param entity
   * @param retentionPeriod The retention period, after which the serialized entity should be
   *     deleted from the table. If <code>null</code>, the default retention period (from {@link
   *     CemeteryProperties#getDefaultRetentionTimeDays()}) will be used instead.
   * @param <T>
   */
  public <T extends GenericEntity<Long>> void writeToCemetery(T entity, Period retentionPeriod) {
    Cemetery cemetery = prepareCemeteryEntity(entity, getDeleteAt(retentionPeriod));
    cemeteryRepository.save(cemetery);
  }

  /**
   * A convenience method which does exactly the same as {@link
   * CemeteryService#writeToCemetery(GenericEntity, Period)}
   *
   * @param entity
   * @param <T>
   */
  public <T extends GenericEntity<Long>> void writeToCemetery(T entity) {
    writeToCemetery(entity, null);
  }

  private <T extends GenericEntity<Long>> Cemetery prepareCemeteryEntity(
      T entity, Instant deleteAt) {
    Cemetery cemetery = new Cemetery();
    cemetery.setType(entity.getClass().getTypeName());
    cemetery.setFormerId(entity.getId());
    cemetery.setDeleteAt(deleteAt);
    if (entity instanceof EntityWithExternalId entityWithExternalId) {
      cemetery.setFormerExternalId(entityWithExternalId.getExternalId());
    }
    cemetery.setContent(serializationService.toJson(entity));
    return cemetery;
  }

  /**
   * Writes multiple entities in serialized form (as json strings) into the cemetery table. After
   * the specified retention period has passed, the serialized entities will also be deleted from
   * the cemetery table.
   *
   * @param entities
   * @param retentionPeriod The retention period, after which the serialized entities should be
   *     deleted from the table. If <code>null</code>, the default retention period (from {@link
   *     CemeteryProperties#getDefaultRetentionTimeDays()}) will be used instead.
   * @param <T>
   */
  public <T extends GenericEntity<Long>> void writeToCemetery(
      List<T> entities, Period retentionPeriod) {
    Instant deleteAt = getDeleteAt(retentionPeriod);
    List<Cemetery> cemeteryEntities =
        entities.stream().map(entity -> prepareCemeteryEntity(entity, deleteAt)).toList();
    cemeteryRepository.saveAll(cemeteryEntities);
  }

  /**
   * A convenience method which does exactly the same as {@link
   * CemeteryService#writeToCemetery(List, Period)}
   *
   * @param entities
   * @param <T>
   */
  public <T extends GenericEntity<Long>> void writeToCemetery(List<T> entities) {
    writeToCemetery(entities, null);
  }

  private Instant getDeleteAt(Period retentionPeriod) {
    return ZonedDateTime.now(clock)
        .plus(
            Optional.ofNullable(retentionPeriod)
                .orElse(Period.ofDays(cemeteryProperties.getDefaultRetentionTimeDays())))
        .toInstant();
  }
}
