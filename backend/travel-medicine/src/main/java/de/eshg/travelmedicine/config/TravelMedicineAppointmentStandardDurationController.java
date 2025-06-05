/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.config;

import static de.eshg.rest.service.security.config.BaseUrls.LibAppointmentBlock.APPOINTMENT_STANDARD_DURATION_API;
import static de.eshg.travelmedicine.config.TravelMedicineAppointmentStandardDurationController.BASE_URL;
import static de.eshg.travelmedicine.config.TravelMedicineAppointmentStandardDurationMapper.mapToDomain;
import static de.eshg.travelmedicine.config.TravelMedicineAppointmentStandardDurationMapper.mapToDto;

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
@Tag(name = "TravelMedicineAppointmentStandardDuration")
public class TravelMedicineAppointmentStandardDurationController {

  public static final String BASE_URL = APPOINTMENT_STANDARD_DURATION_API;

  private final TravelMedicineAppointmentStandardDurationService service;

  public TravelMedicineAppointmentStandardDurationController(
      TravelMedicineAppointmentStandardDurationService service) {
    this.service = service;
  }

  @Operation(summary = "Get the standard durations for travel medicine appointments")
  @ApiResponse(
      responseCode = "200",
      description =
          "A response containing the standard durations if initialized, or an empty response body otherwise.")
  @GetMapping
  @Transactional(readOnly = true)
  public GetTravelMedicineAppointmentStandardDurationsResponse getStandardDurations() {
    return mapToDto(service.getConfig());
  }

  @Operation(summary = "Update the standard durations for travel medicine appointments")
  @PutMapping
  @Transactional
  public void updateStandardDurations(
      @Valid
          @RequestBody
          @Parameter(
              description =
                  "A request containing the standard durations. All standard durations must be set.")
          TravelMedicineAppointmentStandardDurationsDto request) {
    service.updateAppointmentStandardDurations(mapToDomain(request));
  }
}
