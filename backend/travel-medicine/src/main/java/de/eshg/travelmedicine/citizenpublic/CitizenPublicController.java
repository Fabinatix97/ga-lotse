/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.citizenpublic;

import static de.eshg.travelmedicine.config.TravelMedicineAppointmentStandardDurationMapper.mapToTravelMedicineAppointmentStandardDurationsDto;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.config.departmentinfo.OpeningHoursService;
import de.eshg.config.departmentinfo.PrivacyDocumentService;
import de.eshg.config.domain.OpeningHours;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.MappingUtil;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.citizenpublic.api.GetOpeningHoursResponse;
import de.eshg.travelmedicine.citizenpublic.api.PostCitizenVaccinationConsultationRequest;
import de.eshg.travelmedicine.config.TravelMedicineAppointmentStandardDurationService;
import de.eshg.travelmedicine.config.TravelMedicineAppointmentStandardDurationsDto;
import de.eshg.travelmedicine.disease.DiseaseService;
import de.eshg.travelmedicine.disease.api.GetDiseasesResponse;
import de.eshg.travelmedicine.vaccinationconsultation.VaccinationConsultationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.Clock;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = CitizenPublicController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "CitizenPublic")
public class CitizenPublicController {

  public static final String BASE_URL = BaseUrls.TravelMedicine.CITIZEN_PUBLIC_CONTROLLER;
  public static final String APPOINTMENT_STANDARD_DURATIONS_URL = "/appointment-standard-duration";

  private final DiseaseService diseaseService;
  private final AppointmentBlockService appointmentBlockService;
  private final TravelMedicineAppointmentStandardDurationService appointmentStandardDurationService;
  private final VaccinationConsultationService vaccinationConsultationService;
  private final DepartmentInfoConfigService departmentInfoService;
  private final OpeningHoursService openingHoursService;
  private final PrivacyDocumentService privacyDocumentService;
  private final Clock clock;

  public CitizenPublicController(
      DiseaseService diseaseService,
      AppointmentBlockService appointmentBlockService,
      TravelMedicineAppointmentStandardDurationService appointmentStandardDurationService,
      VaccinationConsultationService vaccinationConsultationService,
      DepartmentInfoConfigService departmentInfoService,
      OpeningHoursService openingHoursService,
      PrivacyDocumentService privacyDocumentService,
      Clock clock) {
    this.diseaseService = diseaseService;
    this.appointmentBlockService = appointmentBlockService;
    this.appointmentStandardDurationService = appointmentStandardDurationService;
    this.vaccinationConsultationService = vaccinationConsultationService;
    this.departmentInfoService = departmentInfoService;
    this.openingHoursService = openingHoursService;
    this.privacyDocumentService = privacyDocumentService;
    this.clock = clock;
  }

  @GetMapping("/diseases")
  @Operation(summary = "Gets all public Diseases")
  @Transactional(readOnly = true)
  public GetDiseasesResponse getPublicDiseases() {
    return diseaseService.getPublicDiseases();
  }

  @Operation(summary = "Get free appointments for an appointment type.")
  @GetMapping("/free-appointments")
  @Transactional(readOnly = true)
  public GetFreeAppointmentsResponse getFreeAppointmentsForCitizen(
      @RequestParam(name = "appointmentType") AppointmentTypeDto appointmentType,
      @RequestParam(name = "earliestDate", required = false) Instant earliestDate) {
    if (earliestDate != null && earliestDate.isBefore(Instant.now(clock))) {
      earliestDate = Instant.now(clock);
    }
    List<AppointmentDto> appointments =
        appointmentBlockService.getFreeAppointments(
            earliestDate,
            null,
            MappingUtil.mapEnum(AppointmentType.class, appointmentType),
            null,
            null);

    return new GetFreeAppointmentsResponse(appointments);
  }

  @Operation(summary = "Get standard durations for travel medicine appointments for citizen")
  @GetMapping(APPOINTMENT_STANDARD_DURATIONS_URL)
  @Transactional(readOnly = true)
  public TravelMedicineAppointmentStandardDurationsDto getAppointmentStandardDurationsForCitizen() {
    return mapToTravelMedicineAppointmentStandardDurationsDto(
        appointmentStandardDurationService.getConfig());
  }

  @PostMapping("/vaccination-consultations")
  @Operation(summary = "Save a new vaccination consultation")
  @Transactional
  public UUID postVaccinationConsultationForCitizen(
      @RequestBody @Valid
          PostCitizenVaccinationConsultationRequest postCitizenVaccinationConsultationRequest) {
    return vaccinationConsultationService.createCitizenProcedure(
        postCitizenVaccinationConsultationRequest);
  }

  @Operation(summary = "Get department info.")
  @GetMapping("/department-info")
  @Transactional(readOnly = true)
  public GetDepartmentInfoResponse getDepartmentInfo() {
    return departmentInfoService.getDepartmentInfo();
  }

  @Operation(summary = "Get opening hours.")
  @GetMapping("/opening-hours")
  @Transactional(readOnly = true)
  public GetOpeningHoursResponse getOpeningHours() {

    OpeningHours openingHours = openingHoursService.getConfig();
    return new GetOpeningHoursResponse(
        Collections.unmodifiableList(openingHours.getDe()),
        Collections.unmodifiableList(openingHours.getEn()));
  }

  @GetMapping(path = "/documents/privacy-notice")
  @Operation(summary = "Get the privacy-notice document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyNotice() {
    return privacyDocumentService.getPrivacyNotice();
  }

  @GetMapping(path = "/documents/privacy-policy")
  @Operation(summary = "Get the privacy-policy document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return privacyDocumentService.getPrivacyPolicy();
  }
}
