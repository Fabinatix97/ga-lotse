/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.InfectionBriefingPublicCitizenController.BASE_URL;
import static de.eshg.infectionbriefing.mapper.InfectionBriefingAppointmentTypeMapper.toDomainType;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.config.api.OpeningHoursDto;
import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.config.departmentinfo.OpeningHoursService;
import de.eshg.config.departmentinfo.PrivacyDocumentService;
import de.eshg.config.domain.OpeningHours;
import de.eshg.config.i18n.MultiLangDocumentHelper;
import de.eshg.config.mapper.OpeningHoursMapper;
import de.eshg.infectionbriefing.api.BookAppointmentResponse;
import de.eshg.infectionbriefing.api.BookNewCertificateAppointmentRequest;
import de.eshg.infectionbriefing.api.BookReplacementCertificateAppointmentRequest;
import de.eshg.infectionbriefing.api.InfectionBriefingAppointTypeDto;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.rest.service.security.config.BaseUrls.InfectionBriefing;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
@RequestMapping(BASE_URL)
@Tag(name = "InfectionBriefingPublicCitizen")
public class InfectionBriefingPublicCitizenController {

  public static final String BASE_URL = InfectionBriefing.PUBLIC_CITIZEN_CONTROLLER;

  private final CreateInfectionBriefingProcedureService createInfectionBriefingProcedureService;
  private final AppointmentBlockService appointmentBlockService;
  private final DepartmentInfoConfigService departmentInfoService;
  private final OpeningHoursService openingHoursService;
  private final PrivacyDocumentService privacyDocumentService;
  private final InfectionBriefingConfigService configService;

  public InfectionBriefingPublicCitizenController(
      CreateInfectionBriefingProcedureService createInfectionBriefingProcedureService,
      AppointmentBlockService appointmentBlockService,
      DepartmentInfoConfigService departmentInfoService,
      OpeningHoursService openingHoursService,
      PrivacyDocumentService privacyDocumentService,
      InfectionBriefingConfigService configService) {
    this.createInfectionBriefingProcedureService = createInfectionBriefingProcedureService;
    this.appointmentBlockService = appointmentBlockService;
    this.departmentInfoService = departmentInfoService;
    this.openingHoursService = openingHoursService;
    this.privacyDocumentService = privacyDocumentService;
    this.configService = configService;
  }

  @GetMapping(path = "/department-info")
  @Operation(summary = "Get department info.")
  public GetDepartmentInfoResponse getDepartmentInfo() {
    return departmentInfoService.getDepartmentInfo();
  }

  @GetMapping(path = "/opening-hours")
  @Operation(summary = "Get the official opening hours.")
  @Transactional(readOnly = true)
  public OpeningHoursDto getOpeningHours() {
    OpeningHours openingHours = openingHoursService.getConfig();
    return OpeningHoursMapper.mapToDto(openingHours);
  }

  @GetMapping(path = "/privacy-notice")
  @Operation(summary = "Get the privacy-notice document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyNotice() {
    return privacyDocumentService.getPrivacyNotice();
  }

  @GetMapping(path = "/privacy-policy")
  @Operation(summary = "Get the privacy-policy document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return privacyDocumentService.getPrivacyPolicy();
  }

  @GetMapping(path = "/landing", produces = MediaType.TEXT_MARKDOWN_VALUE)
  @Operation(summary = "Get the landing page markdowns from the config.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getLandingPageContent() {
    return MultiLangDocumentHelper.getAsResponseByCurrentLanguageWithFallback(
        configService.getConfig().getLandingContent(),
        configService.getMultiLangFileName(),
        MediaType.TEXT_MARKDOWN);
  }

  @Transactional
  @PostMapping("appointment/new-certificate")
  public BookAppointmentResponse bookNewCertificateAppointment(
      @Valid @RequestBody BookNewCertificateAppointmentRequest request) {
    return createInfectionBriefingProcedureService.createNewCertificateProcedureByCitizen(request);
  }

  @Transactional
  @PostMapping("appointment/replacement-certificate")
  public BookAppointmentResponse bookReplacementCertificateAppointment(
      @Valid @RequestBody BookReplacementCertificateAppointmentRequest request) {
    return createInfectionBriefingProcedureService.createReplacementCertificateProcedureByCitizen(
        request);
  }

  @Operation(summary = "Get free appointments for an appointment type.")
  @GetMapping(path = "free-appointments", produces = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(readOnly = true)
  public GetFreeAppointmentsResponse getFreeAppointmentsForCitizen(
      @RequestParam(name = "appointmentType") InfectionBriefingAppointTypeDto appointmentType) {
    return new GetFreeAppointmentsResponse(
        appointmentBlockService.getFreeAppointments(
            null, null, toDomainType(appointmentType), null, null));
  }
}
