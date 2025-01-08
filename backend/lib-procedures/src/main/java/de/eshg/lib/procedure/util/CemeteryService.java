/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.util;

import de.eshg.domain.model.EntityWithExternalId;
import de.eshg.domain.model.GenericEntity;
import de.eshg.domain.model.serialization.SerializationService;
import de.eshg.lib.procedure.domain.model.Cemetery;
import de.eshg.lib.procedure.domain.repository.CemeteryRepository;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class CemeteryService {

  private final CemeteryRepository cemeteryRepository;
  private final SerializationService serializationService;

  public CemeteryService(
      CemeteryRepository cemeteryRepository, SerializationService serializationService) {
    this.cemeteryRepository = cemeteryRepository;

    this.serializationService = serializationService;
  }

  public <T extends GenericEntity<Long>> void writeToCemetery(T entity) {
    Cemetery cemetery = prepareCemeteryEntity(entity);
    cemeteryRepository.save(cemetery);
  }

  private <T extends GenericEntity<Long>> Cemetery prepareCemeteryEntity(T entity) {
    Cemetery cemetery = new Cemetery();
    cemetery.setType(entity.getClass().getTypeName());
    cemetery.setFormerId(entity.getId());
    if (entity instanceof EntityWithExternalId entityWithExternalId) {
      cemetery.setFormerExternalId(entityWithExternalId.getExternalId());
    }
    cemetery.setContent(serializationService.toJson(entity));
    return cemetery;
  }

  public <T extends GenericEntity<Long>> void writeToCemetery(List<T> entities) {
    List<Cemetery> cemeteryEntities = entities.stream().map(this::prepareCemeteryEntity).toList();
    cemeteryRepository.saveAll(cemeteryEntities);
  }
}
