/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.config;

import static de.eshg.rest.service.security.config.BaseUrls.LibAppointmentBlock.APPOINTMENT_STANDARD_DURATION_API;
import static de.eshg.stiprotection.config.StiProtectionAppointmentStandardDurationController.BASE_URL;
import static de.eshg.stiprotection.config.StiProtectionAppointmentStandardDurationMapper.mapToGetHivStiConsultationAppointmentStandardDurationsResponse;
import static de.eshg.stiprotection.config.StiProtectionAppointmentStandardDurationMapper.mapToGetSexWorkAppointmentStandardDurationsResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BASE_URL)
@Tag(name = "StiProtectionAppointmentStandardDuration")
public class StiProtectionAppointmentStandardDurationController {

  public static final String BASE_URL = APPOINTMENT_STANDARD_DURATION_API;
  public static final String SEX_WORK = "sex-work";
  public static final String HIV_STI_CONSULTATION = "hiv-sti-consultation";

  private final StiProtectionAppointmentStandardDurationService service;

  public StiProtectionAppointmentStandardDurationController(
      StiProtectionAppointmentStandardDurationService service) {
    this.service = service;
  }

  @Operation(summary = "Get standard durations for sex work consultation appointments")
  @ApiResponse(
      responseCode = "200",
      description =
          "A response containing the standard durations if initialized, or an empty response body otherwise.")
  @Transactional(readOnly = true)
  @GetMapping(SEX_WORK)
  public GetSexWorkAppointmentStandardDurationsResponse getSexWorkAppointmentStandardDurations() {
    return mapToGetSexWorkAppointmentStandardDurationsResponse(service.getConfig());
  }

  @Operation(summary = "Update the standard durations for sex work consultation appointments")
  @Transactional
  @PutMapping(SEX_WORK)
  public void updateSexWorkAppointmentStandardDurations(
      @Valid
          @RequestBody
          @Parameter(
              description =
                  "A request containing the standard durations. All standard durations must be set. N.B.: the value for "
                      + "'results review' is shared with hiv/sti consultations. Meaning if it is changed here, it also changes "
                      + "for hiv/sti consultations accordingly")
          SexWorkAppointmentStandardDurationsDto request) {
    service.updateSexWorkAppointmentStandardDurations(
        request.resultReview(), request.consultation());
  }

  @Operation(summary = "Get standard durations for hiv/sti consultation appointments")
  @ApiResponse(
      responseCode = "200",
      description =
          "A response containing the standard durations if initialized, or an empty response body otherwise.")
  @Transactional(readOnly = true)
  @GetMapping(HIV_STI_CONSULTATION)
  public GetHivStiConsultationAppointmentStandardDurationsResponse
      getHivStiConsultationAppointmentStandardDurations() {
    return mapToGetHivStiConsultationAppointmentStandardDurationsResponse(service.getConfig());
  }

  @Operation(summary = "Update the standard durations for hiv/sti consultation appointments")
  @Transactional
  @PutMapping(HIV_STI_CONSULTATION)
  public void updateHivStiConsultationAppointmentStandardDurations(
      @Valid
          @RequestBody
          @Parameter(
              description =
                  "A request containing the standard durations. All standard durations must be set. N.B.: the value for "
                      + "'results review' is shared with sex work consultations. Meaning if it is changed here, it also changes "
                      + "for sex work consultations accordingly")
          HivStiConsultationAppointmentStandardDurationsDto request) {
    service.updateHivStiConsultationAppointmentStandardDurations(
        request.resultsReview(), request.consultation());
  }
}
