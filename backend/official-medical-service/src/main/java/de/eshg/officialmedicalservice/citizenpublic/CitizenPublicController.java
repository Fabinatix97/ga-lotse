/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.citizenpublic;

import static de.eshg.rest.service.PrivacyDocumentHelper.privacyNoticeAttachmentResponse;
import static de.eshg.rest.service.PrivacyDocumentHelper.privacyPolicyAttachmentResponse;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.MappingUtil;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.officialmedicalservice.citizenpublic.api.GetOpeningHoursResponse;
import de.eshg.officialmedicalservice.concern.ConcernService;
import de.eshg.officialmedicalservice.procedure.api.GetConcernsResponse;
import de.eshg.officialmedicalservice.procedure.api.PostCitizenProcedureRequest;
import de.eshg.rest.service.security.config.BaseUrls;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(
    path = CitizenPublicController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "CitizenPublic")
public class CitizenPublicController {

  public static final String BASE_URL = BaseUrls.OfficialMedicalService.CITIZEN_PUBLIC_API;
  public static final String OPENING_HOURS_URL = "/opening-hours";
  public static final String DEPARTMENT_INFO_URL = "/department-info";
  public static final String PROCEDURES_URL = "/procedures";
  public static final String FREE_APPOINTMENTS_URL = "/free-appointments";
  public static final String PRIVACY_NOTICE_URL = "/privacy-notice";
  public static final String PRIVACY_POLICY_URL = "/privacy-policy";
  public static final String CONCERNS_URL = "/concerns";

  private final OpeningHoursProperties openingHoursProperties;
  private final DepartmentInfoService departmentInfoService;
  private final CitizenProcedureService citizenProcedureService;
  private final AppointmentBlockService appointmentBlockService;
  private final Clock clock;
  private final Resource privacyNotice;
  private final Resource privacyPolicy;
  private final ConcernService concernService;

  public CitizenPublicController(
      OpeningHoursProperties openingHoursProperties,
      DepartmentInfoService departmentInfoService,
      CitizenProcedureService citizenProcedureService,
      AppointmentBlockService appointmentBlockService,
      Clock clock,
      @Value("${de.eshg.official-medical-service.privacy-notice-location}") Resource privacyNotice,
      @Value("${de.eshg.official-medical-service.privacy-policy-location}") Resource privacyPolicy,
      ConcernService concernService) {
    this.openingHoursProperties = openingHoursProperties;
    this.departmentInfoService = departmentInfoService;
    this.citizenProcedureService = citizenProcedureService;
    this.appointmentBlockService = appointmentBlockService;
    this.clock = clock;
    this.privacyNotice = privacyNotice;
    this.privacyPolicy = privacyPolicy;
    this.concernService = concernService;
  }

  @Operation(summary = "Get opening hours.")
  @GetMapping(path = OPENING_HOURS_URL)
  public GetOpeningHoursResponse getOpeningHours() {

    return new GetOpeningHoursResponse(
        openingHoursProperties.de() == null ? Collections.emptyList() : openingHoursProperties.de(),
        openingHoursProperties.en() == null
            ? Collections.emptyList()
            : openingHoursProperties.en());
  }

  @Operation(summary = "Get department info.")
  @GetMapping(path = DEPARTMENT_INFO_URL)
  public GetDepartmentInfoResponse getDepartmentInfo() {
    return departmentInfoService.getDepartmentInfo();
  }

  @Operation(summary = "Save a new citizen oms procedure.")
  @PostMapping(path = PROCEDURES_URL, consumes = MULTIPART_FORM_DATA_VALUE)
  public UUID postCitizenProcedure(
      @RequestPart(name = "request") @Valid PostCitizenProcedureRequest request,
      @RequestPart(name = "files") List<MultipartFile> files) {
    return citizenProcedureService.createCitizenProcedure(request, files);
  }

  @Operation(summary = "Get free appointments for an appointment type.")
  @GetMapping(path = FREE_APPOINTMENTS_URL)
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

  @Operation(summary = "Get the privacy-notice document.")
  @GetMapping(path = PRIVACY_NOTICE_URL)
  public ResponseEntity<Resource> getPrivacyNotice() {
    return privacyNoticeAttachmentResponse(privacyNotice);
  }

  @Operation(summary = "Get the privacy-policy document.")
  @GetMapping(path = PRIVACY_POLICY_URL)
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return privacyPolicyAttachmentResponse(privacyPolicy);
  }

  @Operation(summary = "Get all available concerns for the online portal.")
  @GetMapping(path = CONCERNS_URL)
  public GetConcernsResponse getVisibleConcerns() {
    return concernService.getConcernsVisibleInOnlinePortal();
  }
}
