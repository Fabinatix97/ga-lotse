/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.SortDirection;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.persistence.entity.DataOrigin;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.function.Function;
import org.springframework.data.domain.Sort;

public class MappingUtil {
  private MappingUtil() {}

  public static Sort.Direction mapDirection(SortDirection sortDirection) {
    return switch (sortDirection) {
      case null -> Sort.Direction.ASC;
      case SortDirection.ASC -> Sort.Direction.ASC;
      case SortDirection.DESC -> Sort.Direction.DESC;
    };
  }

  public static Salutation mapSalutationToDm(SalutationDto salutation) {
    return switch (salutation) {
      case null -> Salutation.NOT_SPECIFIED;
      case NOT_SPECIFIED -> Salutation.NOT_SPECIFIED;
      case NEUTRAL -> Salutation.NEUTRAL;
      case FEMALE -> Salutation.FEMALE;
      case MALE -> Salutation.MALE;
    };
  }

  public static Gender mapGenderToDm(GenderDto gender) {
    return switch (gender) {
      case null -> Gender.NOT_SPECIFIED;
      case NOT_SPECIFIED -> Gender.NOT_SPECIFIED;
      case DIVERSE -> Gender.DIVERSE;
      case FEMALE -> Gender.FEMALE;
      case MALE -> Gender.MALE;
    };
  }

  public static SalutationDto mapSalutationToApi(Salutation salutation) {
    return switch (salutation) {
      case NOT_SPECIFIED -> SalutationDto.NOT_SPECIFIED;
      case NEUTRAL -> SalutationDto.NEUTRAL;
      case FEMALE -> SalutationDto.FEMALE;
      case MALE -> SalutationDto.MALE;
    };
  }

  public static GenderDto mapGenderToApi(Gender gender) {
    return switch (gender) {
      case NOT_SPECIFIED -> GenderDto.NOT_SPECIFIED;
      case DIVERSE -> GenderDto.DIVERSE;
      case FEMALE -> GenderDto.FEMALE;
      case MALE -> GenderDto.MALE;
    };
  }

  public static DataOrigin mapDataOriginToDm(DataOriginDto dataOrigin) {
    return switch (dataOrigin) {
      case MANUAL -> DataOrigin.MANUAL;
      case EXTERNAL -> DataOrigin.EXTERNAL;
      case IMPORT -> DataOrigin.IMPORT;
      case EDIT -> DataOrigin.EDIT;
    };
  }

  public static DataOriginDto mapDataOriginToApi(DataOrigin dataOrigin) {
    return switch (dataOrigin) {
      case MANUAL -> DataOriginDto.MANUAL;
      case EXTERNAL -> DataOriginDto.EXTERNAL;
      case IMPORT -> DataOriginDto.IMPORT;
      case EDIT -> DataOriginDto.EDIT;
    };
  }

  public static <T> List<String> extractStrings(List<T> items, Function<T, String> getter) {
    if (items == null) {
      return Collections.emptyList();
    }

    List<String> extractedValues = new ArrayList<>();

    for (T item : items) {
      String value = getter.apply(item);
      if (value != null) {
        extractedValues.add(value);
      }
    }
    return extractedValues;
  }
}
