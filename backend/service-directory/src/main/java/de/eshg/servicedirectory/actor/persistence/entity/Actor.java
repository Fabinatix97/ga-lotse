/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.actor.persistence.entity;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public sealed interface Actor permits StagedActor, AuditedActor {

  UUID getId();

  String getReadableName();

  void setReadableName(String readableName);

  String getCommonName();

  void setCommonName(String commonName);

  Certificate getCurrentCertificate();

  void setCurrentCertificate(Certificate currentCertificate);

  Certificate getPreviousCertificate();

  void setPreviousCertificate(Certificate previousCertificate);

  ActorType getType();

  void setType(ActorType type);

  String getNetworkId();

  void setNetworkId(String networkId);

  Boolean isActive();

  void setActive(Boolean active);

  Boolean isManualCertificate();

  void setManualCertificate(Boolean manualCertificate);

  record Certificate(@NotNull String value, String signature, String signatory) {}
}
