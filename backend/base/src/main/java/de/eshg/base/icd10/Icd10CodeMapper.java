/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.icd10;

import de.eshg.base.icd10.api.Icd10CodeDto;
import de.eshg.base.icd10.persistence.repository.Icd10CodeRepository.Icd10SearchResult;

public final class Icd10CodeMapper {

  private Icd10CodeMapper() {}

  public static Icd10CodeDto mapToDto(Icd10SearchResult icd10Code) {
    return new Icd10CodeDto(
        icd10Code.getCode(),
        icd10Code.getOriginalCode(),
        icd10Code.getTitle(),
        icd10Code.isGroup());
  }
}
