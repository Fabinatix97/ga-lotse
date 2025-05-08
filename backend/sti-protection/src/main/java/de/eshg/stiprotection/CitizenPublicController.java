/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.MappingUtil;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.config.BaseUrls.StiProtection;
import de.eshg.stiprotection.api.ConcernDto;
import de.eshg.stiprotection.api.ResponseEntities;
import de.eshg.stiprotection.api.citizen.AddPersonalDetailsRequest;
import de.eshg.stiprotection.api.citizen.AddPersonalDetailsResponse;
import de.eshg.stiprotection.api.citizen.BookAppointmentRequest;
import de.eshg.stiprotection.api.citizen.BookAppointmentResponse;
import de.eshg.stiprotection.api.citizen.CreateAnonymousUserRequest;
import de.eshg.stiprotection.api.citizen.CreateAnonymousUserResponse;
import de.eshg.stiprotection.api.citizen.GetOpeningHoursResponse;
import de.eshg.stiprotection.department.SexWorkDepartmentInfoConfigService;
import de.eshg.stiprotection.department.SexWorkOpeningHoursService;
import de.eshg.stiprotection.department.StiConsultationDepartmentInfoConfigService;
import de.eshg.stiprotection.department.StiConsultationOpeningHoursService;
import de.eshg.stiprotection.mapper.AppointmentMapper;
import de.eshg.stiprotection.mapper.ConcernMapper;
import de.eshg.stiprotection.mapper.PersonMapper;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = CitizenPublicController.BASE_URL)
@Tag(name = "CitizenPublic")
public class CitizenPublicController {

  private static final Logger log = LoggerFactory.getLogger(CitizenPublicController.class);

  public static final String BASE_URL = StiProtection.CITIZEN_PUBLIC_CONTROLLER;

  private final AppointmentBlockService appointmentBlockService;
  private final AppointmentService appointmentService;
  private final CitizenAppointmentService citizenAppointmentService;
  private final Clock clock;
  private final StiConsultationDepartmentInfoConfigService stiConsultationDepartmentInfoService;
  private final SexWorkDepartmentInfoConfigService sexWorkDepartmentInfoService;
  private final StiConsultationOpeningHoursService stiConsultationOpeningHoursService;
  private final SexWorkOpeningHoursService sexWorkOpeningHoursService;

  public CitizenPublicController(
      AppointmentBlockService appointmentBlockService,
      AppointmentService appointmentService,
      CitizenAppointmentService citizenAppointmentService,
      Clock clock,
      StiConsultationDepartmentInfoConfigService stiConsultationDepartmentInfoService,
      SexWorkDepartmentInfoConfigService sexWorkDepartmentInfoService,
      StiConsultationOpeningHoursService stiConsultationOpeningHoursService,
      SexWorkOpeningHoursService sexWorkOpeningHoursService) {
    this.appointmentBlockService = appointmentBlockService;
    this.appointmentService = appointmentService;
    this.citizenAppointmentService = citizenAppointmentService;
    this.clock = clock;
    this.stiConsultationDepartmentInfoService = stiConsultationDepartmentInfoService;
    this.sexWorkDepartmentInfoService = sexWorkDepartmentInfoService;
    this.stiConsultationOpeningHoursService = stiConsultationOpeningHoursService;
    this.sexWorkOpeningHoursService = sexWorkOpeningHoursService;
  }

  @GetMapping("/department-info")
  @Operation(summary = "Get department info")
  @Transactional(readOnly = true)
  public GetDepartmentInfoResponse getDepartmentInfo(
      @RequestParam(name = "concern") ConcernDto concern) {
    return switch (concern) {
      case HIV_STI_CONSULTATION -> stiConsultationDepartmentInfoService.getDepartmentInfo();
      case SEX_WORK -> sexWorkDepartmentInfoService.getDepartmentInfo();
    };
  }

  @GetMapping("/opening-hours")
  @Operation(summary = "Get opening hours")
  @Transactional(readOnly = true)
  public GetOpeningHoursResponse getOpeningHours(
      @RequestParam(name = "concern") ConcernDto concern) {
    return switch (concern) {
      case HIV_STI_CONSULTATION -> stiConsultationOpeningHoursService.getOpeningHours();
      case SEX_WORK -> sexWorkOpeningHoursService.getOpeningHours();
    };
  }

  @Operation(summary = "Get free appointments for an appointment type.")
  @GetMapping("/free-appointments")
  @Transactional(readOnly = true)
  public GetFreeAppointmentsResponse getFreeAppointmentsForCitizen(
      @RequestParam(name = "appointmentType") @NotNull ConcernDto appointmentType,
      @RequestParam(name = "earliestDate", required = false) Instant earliestDate) {

    if (earliestDate != null && earliestDate.isBefore(Instant.now(clock))) {
      log.warn("Received earliestDate {} is in the past. Adjusting to current time.", earliestDate);
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

  @PostMapping("/appointments")
  @Operation(summary = "Book an appointment.")
  @Transactional
  public BookAppointmentResponse bookAppointment(
      @Valid @RequestBody BookAppointmentRequest request) {
    StiProtectionProcedure procedure = doBookAppointment(request);
    return new BookAppointmentResponse(procedure.getExternalId());
  }

  private StiProtectionProcedure doBookAppointment(BookAppointmentRequest request) {
    Assert.notNull(request, "BookAppointmentRequest must not be null");
    StiProtectionProcedure procedure =
        citizenAppointmentService.createProcedureWithExpiryDate(
            ConcernMapper.toDatabaseType(request.concern()));
    appointmentService.bookPublicAppointment(procedure, AppointmentMapper.toDataType(request));
    return procedure;
  }

  @PostMapping("/appointments/{id}/anonymous-user")
  @Operation(summary = "Create a new anonymous user identified by an access code and PIN")
  @Transactional
  public CreateAnonymousUserResponse createAnonymousUser(
      @PathVariable("id") UUID procedureId,
      @Valid @RequestBody CreateAnonymousUserRequest request) {
    StiProtectionProcedure procedure;
    try {
      procedure = citizenAppointmentService.findByExternalId(procedureId);
      validateDraftStatus(procedure);
    } catch (NotFoundException e) {
      log.debug("{}: procedure not found, creating personal details", procedureId, e);
      procedure = doAddPersonalDetails(procedureId, request.personalDetails());
    }
    UUID procedureExternalId = procedure.getExternalId();
    CitizenAccessCodeUserDto user =
        citizenAppointmentService.createAnonymousUser(procedureExternalId, request.pin());
    citizenAppointmentService.confirmAppointment(procedureExternalId);
    return new CreateAnonymousUserResponse(user.accessCode(), procedureExternalId);
  }

  @PutMapping("/appointments/{id}/personal-details")
  @Operation(summary = "Add personal details for an appointment")
  @Transactional
  public AddPersonalDetailsResponse addPersonalDetails(
      @PathVariable("id") UUID procedureId, @Valid @RequestBody AddPersonalDetailsRequest request) {
    return PersonMapper.toInterfaceType(doAddPersonalDetails(procedureId, request));
  }

  private StiProtectionProcedure doAddPersonalDetails(
      UUID procedureId, @NotNull AddPersonalDetailsRequest request) {
    StiProtectionProcedure procedure;
    try {
      procedure = citizenAppointmentService.findByExternalId(procedureId);
      validateDraftStatus(procedure);
    } catch (NotFoundException e) {
      log.debug("{}: procedure not found, booking appointment", procedureId, e);
      procedure = doBookAppointment(request.appointmentBooking());
    }
    return citizenAppointmentService.setPersonalDetails(
        procedure.getExternalId(), PersonMapper.toDataType(request));
  }

  @PostMapping(path = "/appointments/{id}/anon-ident-document")
  @Operation(summary = "Get an anonymous identification document for an appointment")
  @Transactional
  @ApiResponse(
      responseCode = "200",
      content =
          @Content(
              mediaType = MediaType.APPLICATION_PDF_VALUE,
              schema = @Schema(format = "binary")))
  public ResponseEntity<byte[]> getInitialCitizenAnonymousIdentificationDocument(
      @PathVariable("id") UUID procedureId) {
    StiProtectionProcedure procedure = citizenAppointmentService.findByExternalId(procedureId);
    validateDraftStatus(procedure);
    citizenAppointmentService.finalizeDraftProcedure(procedureId);
    Pdf pdf = citizenAppointmentService.getAnonymousIdentificationDocument(procedureId);
    return ResponseEntities.pdfContent(pdf.getFileName(), pdf.getFileContent().getContent());
  }

  private void validateDraftStatus(StiProtectionProcedure procedure) {
    if (procedure.getProcedureStatus() != ProcedureStatus.DRAFT) {
      throw new BadRequestException(
          "Procedure is not DRAFT and cannot be edited without authorization anymore.");
    }
  }

  @DeleteMapping("/appointments/{id}")
  @Operation(summary = "Cancel pending appointment of an STI procedure.")
  @Transactional
  public void cancelPendingAppointment(@PathVariable("id") UUID procedureId) {
    citizenAppointmentService.cancelPendingAppointment(procedureId);
  }
}
