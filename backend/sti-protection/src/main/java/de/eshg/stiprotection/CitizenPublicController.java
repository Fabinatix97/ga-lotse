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
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.api.AddPersonalDetailsRequest;
import de.eshg.stiprotection.api.AddPersonalDetailsResponse;
import de.eshg.stiprotection.api.ConcernDto;
import de.eshg.stiprotection.api.CreateAnonymousUserRequest;
import de.eshg.stiprotection.api.CreateAnonymousUserResponse;
import de.eshg.stiprotection.api.citizen.BookAppointmentRequest;
import de.eshg.stiprotection.api.citizen.BookAppointmentResponse;
import de.eshg.stiprotection.api.citizen.GetOpeningHoursResponse;
import de.eshg.stiprotection.mapper.AppointmentMapper;
import de.eshg.stiprotection.mapper.ConcernMapper;
import de.eshg.stiprotection.mapper.PersonMapper;
import de.eshg.stiprotection.persistence.data.PersonData;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
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

  public static final String BASE_URL = BaseUrls.StiProtection.CITIZEN_PUBLIC_CONTROLLER;

  private final DepartmentInfoService departmentInfoService;
  private final AppointmentBlockService appointmentBlockService;
  private final AppointmentService appointmentService;
  private final CitizenAppointmentService citizenAppointmentService;
  private final Clock clock;

  public CitizenPublicController(
      DepartmentInfoService departmentInfoService,
      AppointmentBlockService appointmentBlockService,
      AppointmentService appointmentService,
      CitizenAppointmentService citizenAppointmentService,
      Clock clock) {
    this.departmentInfoService = departmentInfoService;
    this.appointmentBlockService = appointmentBlockService;
    this.appointmentService = appointmentService;
    this.citizenAppointmentService = citizenAppointmentService;
    this.clock = clock;
  }

  @GetMapping("/department-info")
  @Operation(summary = "Get department info")
  @Transactional(readOnly = true)
  public GetDepartmentInfoResponse getDepartmentInfo(
      @RequestParam(name = "concern", required = false) ConcernDto concern) {
    return departmentInfoService.getDepartmentInfo(ConcernMapper.toDatabaseType(concern));
  }

  @GetMapping("/opening-hours")
  @Operation(summary = "Get opening hours")
  @Transactional(readOnly = true)
  public GetOpeningHoursResponse getOpeningHours(
      @RequestParam(name = "concern") ConcernDto concern) {
    return departmentInfoService.getOpeningHours(ConcernMapper.toDatabaseType(concern));
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
    StiProtectionProcedure procedure =
        citizenAppointmentService.createProcedureWithExpiryDate(
            ConcernMapper.toDatabaseType(request.concern()));
    appointmentService.bookPublicAppointment(procedure, AppointmentMapper.toDataType(request));
    return new BookAppointmentResponse(procedure.getExternalId());
  }

  @PostMapping("/appointments/{id}/anonymous-user")
  @Operation(summary = "Create a new anonymous user identified by an access code and PIN")
  @Transactional
  public CreateAnonymousUserResponse createAnonymousUser(
      @PathVariable("id") UUID procedureId,
      @Valid @RequestBody CreateAnonymousUserRequest request) {
    CitizenAccessCodeUserDto user =
        citizenAppointmentService.createAnonymousUser(procedureId, request.pin());
    return new CreateAnonymousUserResponse(user.userId(), user.accessCode());
  }

  @PutMapping("/appointments/{id}/personal-details")
  @Operation(summary = "Add personal details for an appointment")
  @Transactional
  public AddPersonalDetailsResponse addPersonalDetails(
      @PathVariable("id") UUID procedureId, @Valid @RequestBody AddPersonalDetailsRequest request) {
    PersonData personData = PersonMapper.toDataType(request);
    StiProtectionProcedure procedure =
        citizenAppointmentService.setPersonalDetails(procedureId, personData);
    return PersonMapper.toInterfaceType(procedure);
  }

  @PostMapping("/appointments/{id}/confirm")
  @Transactional
  public void confirmAppointment(@PathVariable("id") UUID procedureId) {
    citizenAppointmentService.confirmAppointment(procedureId);
  }
}
