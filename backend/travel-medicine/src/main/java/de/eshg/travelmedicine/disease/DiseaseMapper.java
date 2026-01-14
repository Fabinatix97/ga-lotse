/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.disease;

import de.eshg.travelmedicine.disease.api.DiseaseDto;
import de.eshg.travelmedicine.disease.persistence.entity.Disease;

public class DiseaseMapper {

  private DiseaseMapper() {}

  public static DiseaseDto toInterfaceType(Disease disease) {
    if (disease == null) return null;

    return new DiseaseDto(
        disease.getId(),
        disease.getName(),
        disease.getEstimatedFee(),
        disease.isVisibleToCitizenPortal(),
        disease.getCreatedAt(),
        disease.getModifiedAt());
  }

  public static Disease toDomainType(DiseaseDto disease) {
    if (disease == null) return null;

    return new Disease(
        disease.id(), disease.name(), disease.estimatedFee(), disease.visibleToCitizenPortal());
  }
}
