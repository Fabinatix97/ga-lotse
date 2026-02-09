/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.mapper;

import de.eshg.infectionbriefing.api.ApplicantCategoryDto;
import de.eshg.infectionbriefing.domain.model.ApplicantCategory;

public class ApplicantCategoryMapper {
  private ApplicantCategoryMapper() {}

  public static ApplicantCategoryDto toInterfaceType(ApplicantCategory applicantCategory) {
    return switch (applicantCategory) {
      case REGULAR -> ApplicantCategoryDto.REGULAR;
      case VOLUNTEER -> ApplicantCategoryDto.VOLUNTEER;
      case INTERN -> ApplicantCategoryDto.INTERN;
      case null -> null;
    };
  }

  public static ApplicantCategory toDomainType(ApplicantCategoryDto applicantCategory) {
    return switch (applicantCategory) {
      case REGULAR -> ApplicantCategory.REGULAR;
      case VOLUNTEER -> ApplicantCategory.VOLUNTEER;
      case INTERN -> ApplicantCategory.INTERN;
      case null -> null;
    };
  }
}
