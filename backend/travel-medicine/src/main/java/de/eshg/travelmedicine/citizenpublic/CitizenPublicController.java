/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.citizenpublic;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.AppointmentTypeService;
import de.eshg.lib.appointmentblock.MappingUtil;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.api.GetAppointmentTypesResponse;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.citizenpublic.api.GetOpeningHoursResponse;
import de.eshg.travelmedicine.citizenpublic.api.PostCitizenVaccinationConsultationRequest;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
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

  private final DiseaseService diseaseService;
  private final AppointmentBlockService appointmentBlockService;
  private final AppointmentTypeService appointmentTypeService;
  private final VaccinationConsultationService vaccinationConsultationService;
  private final DepartmentInfoService departmentInfoService;
  private final Resource privacyNotice;
  private final Resource privacyPolicy;
  private final OpeningHoursProperties openingHoursProperties;
  private final Clock clock;

  public CitizenPublicController(
      DiseaseService diseaseService,
      AppointmentBlockService appointmentBlockService,
      AppointmentTypeService appointmentTypeService,
      VaccinationConsultationService vaccinationConsultationService,
      DepartmentInfoService departmentInfoService,
      @Value("${de.eshg.travel-medicine.privacy-notice-location}") Resource privacyNotice,
      @Value("${de.eshg.travel-medicine.privacy-policy-location}") Resource privacyPolicy,
      OpeningHoursProperties openingHoursProperties,
      Clock clock) {
    this.diseaseService = diseaseService;
    this.appointmentBlockService = appointmentBlockService;
    this.appointmentTypeService = appointmentTypeService;
    this.vaccinationConsultationService = vaccinationConsultationService;
    this.departmentInfoService = departmentInfoService;
    this.privacyNotice = privacyNotice;
    this.privacyPolicy = privacyPolicy;
    this.openingHoursProperties = openingHoursProperties;
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
            earliestDate, null, MappingUtil.mapEnum(AppointmentType.class, appointmentType), null);

    return new GetFreeAppointmentsResponse(appointments);
  }

  @Operation(summary = "Gets all Appointment Types")
  @GetMapping("/appointment-types")
  @Transactional(readOnly = true)
  public GetAppointmentTypesResponse getAppointmentTypesForCitizen() {
    return appointmentTypeService.getAppointmentTypes();
  }

  @PostMapping("/vaccination-consultations")
  @Operation(summary = "Save a new vaccination consultation")
  @Transactional
  public UUID postVaccinationConsultationForCitizen(
      @RequestBody @Valid
          PostCitizenVaccinationConsultationRequest postCitizenVaccinationConsultationRequest) {
    return vaccinationConsultationService.createProcedure(
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

    return new GetOpeningHoursResponse(
        openingHoursProperties.de() == null ? Collections.emptyList() : openingHoursProperties.de(),
        openingHoursProperties.en() == null
            ? Collections.emptyList()
            : openingHoursProperties.en());
  }

  @GetMapping(path = "/documents/privacy-notice")
  @Operation(summary = "Get the privacy-notice document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyNotice() {
    return getPrivacyDocument(privacyNotice);
  }

  @GetMapping(path = "/documents/privacy-policy")
  @Operation(summary = "Get the privacy-policy document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return getPrivacyDocument(privacyPolicy);
  }

  private static ResponseEntity<Resource> getPrivacyDocument(Resource privacyDocument) {
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            fileAttachment(privacyDocument.getFilename()).toString())
        .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
        .body(privacyDocument);
  }

  private static ContentDisposition fileAttachment(String filename) {
    return file(filename, ContentDisposition.attachment());
  }

  private static ContentDisposition file(String filename, ContentDisposition.Builder builder) {
    return builder.name("file").filename(filename).build();
  }
}
