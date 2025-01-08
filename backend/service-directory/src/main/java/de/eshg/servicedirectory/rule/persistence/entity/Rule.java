/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.rule.persistence.entity;

import java.util.UUID;

public sealed interface Rule permits StagedRule, AuditedRule {

  UUID getId();

  String getDescription();

  void setDescription(String description);

  ActorSelector getClient();

  void setClient(ActorSelector client);

  ActorSelector getServer();

  void setServer(ActorSelector server);

  Boolean isActive();

  void setActive(Boolean active);
}
