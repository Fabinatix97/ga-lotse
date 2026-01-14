/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.rule;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AdminActorSelector")
public record ActorSelectorDto(
    String federalState,
    String orgUnitType,
    String orgUnitName,
    String actorType,
    String actorName) {

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
