/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.rule.persistence.entity;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embeddable;

@Embeddable
@DataSensitivity(SensitivityLevel.PUBLIC)
public record ActorSelector(
    String federalState,
    String orgUnitType,
    String orgUnitName,
    String actorType,
    String actorName) {

  public static ActorSelector empty() {
    return new ActorSelector(null, null, null, null, null);
  }

  @Override
  public String toString() {
    return (federalState == null ? "*" : federalState)
        + "/"
        + (orgUnitType == null ? "*" : orgUnitType)
        + "/"
        + (orgUnitName == null ? "*" : orgUnitName)
        + "/"
        + (actorType == null ? "*" : actorType)
        + "/"
        + (actorName == null ? "*" : actorName);
  }
}
