/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.orgunit.persistence.entity;

import de.eshg.lib.common.FederalState;
import java.util.UUID;

public sealed interface OrgUnit permits StagedOrgUnit, AuditedOrgUnit {

  UUID getId();

  String getReadableName();

  void setReadableName(String readableName);

  OrgUnitType getType();

  void setType(OrgUnitType type);

  Boolean isActive();

  void setActive(Boolean active);

  FederalState getFederalState();

  void setFederalState(FederalState federalState);
}
