/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.statistics;

import de.eshg.inspection.objecttype.ObjectTypeProperties;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class ConfigurationInitializer {

  private final ObjectTypeProperties objectTypeProperties;

  public ConfigurationInitializer(ObjectTypeProperties objectTypeProperties) {
    this.objectTypeProperties = objectTypeProperties;
  }

  @PostConstruct
  public void init() {
    InspectionAttributes.OBJECT_TYPE
        .getValueOptions()
        .addAll(AttributeUtil.createObjectTypeOptions(objectTypeProperties));
    FacilityAttributes.OBJECT_TYPE
        .getValueOptions()
        .addAll(AttributeUtil.createObjectTypeOptions(objectTypeProperties));
  }
}
