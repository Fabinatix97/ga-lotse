/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.staging.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Embeddable;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.envers.NotAudited;

@Embeddable
@DataSensitivity(SensitivityLevel.PUBLIC)
public class StagedInfo<T extends GloballyUniqueEntityBase> {

  @OneToMany(
      mappedBy = "stagingInfo.auditedEntity",
      cascade = CascadeType.REMOVE,
      fetch = FetchType.LAZY)
  @OrderBy
  @NotAudited
  private final List<T> stagedEntities = new ArrayList<>();
}
