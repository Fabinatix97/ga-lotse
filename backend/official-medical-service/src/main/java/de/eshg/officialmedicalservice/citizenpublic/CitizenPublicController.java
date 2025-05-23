/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.citizenpublic;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.config.departmentinfo.OpeningHoursService;
import de.eshg.config.departmentinfo.PrivacyDocumentService;
import de.eshg.config.domain.OpeningHours;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.AppointmentTypeService;
import de.eshg.lib.appointmentblock.MappingUtil;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.api.GetAppointmentTypesResponse;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.officialmedicalservice.citizenpublic.api.GetOpeningHoursResponse;
import de.eshg.officialmedicalservice.concern.ConcernService;
import de.eshg.officialmedicalservice.document.OmsDocumentService;
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
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(path = CitizenPublicController.BASE_URL)
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
  public static final String APPOINTMENT_TYPES_URL = "/appointment-types";
  public static final String LANDING_URL = "/landing";
  public static final String VALIDATE_FILES_URL = "/validate-files";

  private final OpeningHoursService openingHoursService;
  private final DepartmentInfoConfigService departmentInfoService;
  private final CitizenPublicProcedureService citizenPublicProcedureService;
  private final AppointmentBlockService appointmentBlockService;
  private final Clock clock;
  private final ConcernService concernService;
  private final AppointmentTypeService appointmentTypeService;
  private final PrivacyDocumentService privacyDocumentService;
  private final OmsDocumentService omsDocumentService;

  public CitizenPublicController(
      OpeningHoursService openingHoursService,
      DepartmentInfoConfigService departmentInfoService,
      CitizenPublicProcedureService citizenPublicProcedureService,
      AppointmentBlockService appointmentBlockService,
      Clock clock,
      ConcernService concernService,
      AppointmentTypeService appointmentTypeService,
      PrivacyDocumentService privacyDocumentService,
      OmsDocumentService omsDocumentService) {
    this.openingHoursService = openingHoursService;
    this.departmentInfoService = departmentInfoService;
    this.citizenPublicProcedureService = citizenPublicProcedureService;
    this.appointmentBlockService = appointmentBlockService;
    this.clock = clock;
    this.concernService = concernService;
    this.appointmentTypeService = appointmentTypeService;
    this.privacyDocumentService = privacyDocumentService;
    this.omsDocumentService = omsDocumentService;
  }

  @Operation(summary = "Get opening hours.")
  @GetMapping(path = OPENING_HOURS_URL, produces = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(readOnly = true)
  public GetOpeningHoursResponse getOpeningHours() {
    OpeningHours openingHours = openingHoursService.getConfig();
    return new GetOpeningHoursResponse(
        Collections.unmodifiableList(openingHours.getDe()),
        Collections.unmodifiableList(openingHours.getEn()));
  }

  @Operation(summary = "Get department info.")
  @GetMapping(path = DEPARTMENT_INFO_URL, produces = MediaType.APPLICATION_JSON_VALUE)
  public GetDepartmentInfoResponse getDepartmentInfo() {
    return departmentInfoService.getDepartmentInfo();
  }

  @Operation(summary = "Get landing content")
  @GetMapping(path = LANDING_URL, produces = MediaType.TEXT_MARKDOWN_VALUE)
  public ResponseEntity<byte[]> getLandingContent() {
    byte[] markdownContent = citizenPublicProcedureService.getLandingContent();

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.TEXT_MARKDOWN);

    return ResponseEntity.ok().headers(headers).body(markdownContent);
  }

  @Operation(summary = "Save a new citizen oms procedure.")
  @PostMapping(
      path = PROCEDURES_URL,
      consumes = MULTIPART_FORM_DATA_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  public UUID postCitizenProcedure(
      @RequestPart(name = "request") @Valid PostCitizenProcedureRequest request,
      @RequestPart(name = "files") List<MultipartFile> files) {
    return citizenPublicProcedureService.createCitizenProcedure(request, files);
  }

  @Operation(summary = "Get free appointments for an appointment type.")
  @GetMapping(path = FREE_APPOINTMENTS_URL, produces = MediaType.APPLICATION_JSON_VALUE)
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

  @Operation(summary = "Get the privacy-notice document.")
  @GetMapping(path = PRIVACY_NOTICE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Resource> getPrivacyNotice() {
    return privacyDocumentService.getPrivacyNotice();
  }

  @Operation(summary = "Get the privacy-policy document.")
  @GetMapping(path = PRIVACY_POLICY_URL, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return privacyDocumentService.getPrivacyPolicy();
  }

  @Operation(summary = "Get all available concerns for the online portal.")
  @GetMapping(path = CONCERNS_URL, produces = MediaType.APPLICATION_JSON_VALUE)
  public GetConcernsResponse getVisibleConcerns() {
    return concernService.getConcernsVisibleInOnlinePortal();
  }

  @Operation(summary = "Gets all Appointment Types")
  @GetMapping(path = APPOINTMENT_TYPES_URL, produces = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(readOnly = true)
  public GetAppointmentTypesResponse getAppointmentTypesForCitizen() {
    return appointmentTypeService.getAppointmentTypes();
  }

  @Operation(summary = "Validate files")
  @PostMapping(
      path = VALIDATE_FILES_URL,
      consumes = MULTIPART_FORM_DATA_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  public ValidateFilesResponse validateFiles(
      @RequestPart(name = "files") List<MultipartFile> files) {
    return omsDocumentService.validateFilesBeforeUpload(files);
  }
}
