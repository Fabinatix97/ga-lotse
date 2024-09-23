/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype.persistence;

import de.eshg.inspection.objecttype.ObjectTypeProperties;
import de.eshg.persistence.TransactionHelper;
import jakarta.annotation.PostConstruct;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class CreateObjectTypeTask {

  private final ObjectTypeRepository objectTypeRepository;
  private final ObjectTypeProperties objectTypeProperties;
  private final TransactionHelper transactionHelper;

  public CreateObjectTypeTask(
      ObjectTypeRepository objectTypeRepository,
      ObjectTypeProperties objectTypeProperties,
      TransactionHelper transactionHelper) {
    this.objectTypeRepository = objectTypeRepository;
    this.objectTypeProperties = objectTypeProperties;
    this.transactionHelper = transactionHelper;
  }

  @PostConstruct
  public void createObjectTypes() {
    transactionHelper.executeInTransaction(
        () -> {
          Set<String> existingObjectTypes =
              objectTypeRepository.findAll().stream()
                  .map(ObjectType::getName)
                  .collect(Collectors.toSet());

          this.objectTypeProperties.defaultObjectTypes().stream()
              .filter(o -> !existingObjectTypes.contains(o))
              .forEach(
                  newObjTypeName -> {
                    ObjectType newObjectType = new ObjectType();
                    newObjectType.setName(newObjTypeName);
                    newObjectType.setRoutineInterval(this.objectTypeProperties.routineInterval());
                    newObjectType.setComplaintInterval(
                        this.objectTypeProperties.complaintInterval());
                    newObjectType.setStandardDuration(this.objectTypeProperties.standardDuration());
                    newObjectType.setStandardBufferTime(
                        this.objectTypeProperties.standardBufferTime());
                    objectTypeRepository.save(newObjectType);
                  });
        });
  }
}
