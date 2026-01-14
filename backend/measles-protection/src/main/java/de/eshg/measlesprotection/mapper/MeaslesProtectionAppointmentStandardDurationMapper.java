/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.measlesprotection.api.GetMeaslesProtectionAppointmentStandardDurationsResponse;
import de.eshg.measlesprotection.api.MeaslesProtectionAppointmentStandardDurationsDto;
import de.eshg.measlesprotection.config.MeaslesProtectionAppointmentStandardDuration;

public class MeaslesProtectionAppointmentStandardDurationMapper {

  private MeaslesProtectionAppointmentStandardDurationMapper() {}

  public static GetMeaslesProtectionAppointmentStandardDurationsResponse mapToDto(
      MeaslesProtectionAppointmentStandardDuration domain) {
    return new GetMeaslesProtectionAppointmentStandardDurationsResponse(
        domain.isInitialized()
            ? mapToMeaslesProtectionAppointmentStandardDurationsDto(domain)
            : null);
  }

  public static MeaslesProtectionAppointmentStandardDuration mapToDomain(
      MeaslesProtectionAppointmentStandardDurationsDto dto) {
    MeaslesProtectionAppointmentStandardDuration domain =
        new MeaslesProtectionAppointmentStandardDuration();
    domain.setProofSubmission(dto.proofSubmission());
    return domain;
  }

  public static MeaslesProtectionAppointmentStandardDurationsDto
      mapToMeaslesProtectionAppointmentStandardDurationsDto(
          MeaslesProtectionAppointmentStandardDuration domain) {
    return new MeaslesProtectionAppointmentStandardDurationsDto(domain.getProofSubmission());
  }
}
