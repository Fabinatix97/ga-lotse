/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.DiseaseTypeDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.DiseaseType;

public final class DiseaseTypeMapper {
  private DiseaseTypeMapper() {}

  public static DiseaseTypeDto toInterfaceType(DiseaseType diseaseType) {
    return switch (diseaseType) {
      case HEPATITIS_A -> DiseaseTypeDto.HEPATITIS_A;
      case HEPATITIS_B -> DiseaseTypeDto.HEPATITIS_B;
      case HEPATITIS_C -> DiseaseTypeDto.HEPATITIS_C;
      case HIV -> DiseaseTypeDto.HIV;
      case SYPHILIS -> DiseaseTypeDto.SYPHILIS;
      case GONORRHEA -> DiseaseTypeDto.GONORRHEA;
      case CHLAMYDIA -> DiseaseTypeDto.CHLAMYDIA;
      case HPV -> DiseaseTypeDto.HPV;
      case null -> null;
    };
  }

  public static DiseaseType toDatabaseType(DiseaseTypeDto diseaseType) {
    return switch (diseaseType) {
      case HEPATITIS_A -> DiseaseType.HEPATITIS_A;
      case HEPATITIS_B -> DiseaseType.HEPATITIS_B;
      case HEPATITIS_C -> DiseaseType.HEPATITIS_C;
      case HIV -> DiseaseType.HIV;
      case SYPHILIS -> DiseaseType.SYPHILIS;
      case GONORRHEA -> DiseaseType.GONORRHEA;
      case CHLAMYDIA -> DiseaseType.CHLAMYDIA;
      case HPV -> DiseaseType.HPV;
      case null -> null;
    };
  }
}
