/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.schoolentry.api.Icd10CodeDto;
import de.eshg.schoolentry.domain.repository.Icd10CodeRepository.Icd10FuzzySearchResult;

public final class Icd10CodeMapper {

  private Icd10CodeMapper() {}

  public static Icd10CodeDto mapToDto(Icd10FuzzySearchResult icd10Code) {
    return new Icd10CodeDto(icd10Code.getCode(), icd10Code.getTitle(), icd10Code.isGroup());
  }
}
