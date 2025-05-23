/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import static de.eshg.stiprotection.persistence.db.StiProcedureOrigin.CITIZEN_PORTAL;

import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserWithPinCredentialRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.stiprotection.persistence.Appointments;
import de.eshg.stiprotection.persistence.data.PersonData;
import de.eshg.stiprotection.persistence.db.AppointmentHistoryEntry;
import de.eshg.stiprotection.persistence.db.AppointmentStatus;
import de.eshg.stiprotection.persistence.db.Concern;
import de.eshg.stiprotection.persistence.db.ProcedureExpiration;
import de.eshg.stiprotection.persistence.db.ProcedureExpirationRepository;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class CitizenAppointmentService {

  private final ProcedureExpirationRepository procedureExpirationRepository;
  private final CitizenAccessCodeUserApi citizenAccessCodeUserApi;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final StiProtectionProcedureService stiProtectionService;
  private final AppointmentCooldownService appointmentCooldownService;

  public CitizenAppointmentService(
      ProcedureExpirationRepository procedureExpirationRepository,
      CitizenAccessCodeUserApi citizenAccessCodeUserApi,
      ModuleClientAuthenticator moduleClientAuthenticator,
      StiProtectionProcedureService stiProtectionService,
      AppointmentCooldownService appointmentCooldownService) {
    this.procedureExpirationRepository = procedureExpirationRepository;
    this.citizenAccessCodeUserApi = citizenAccessCodeUserApi;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.stiProtectionService = stiProtectionService;
    this.appointmentCooldownService = appointmentCooldownService;
  }

  public StiProtectionProcedure createProcedureWithExpiryDate(Concern concern) {
    StiProtectionProcedure procedure =
        stiProtectionService.saveProcedure(concern, ProcedureStatus.DRAFT, CITIZEN_PORTAL);
    ProcedureExpiration procedureExpiration = new ProcedureExpiration(procedure);
    procedureExpirationRepository.save(procedureExpiration);
    return procedure;
  }

  public CitizenAccessCodeUserDto createAnonymousUser(UUID procedureId, String pin) {
    StiProtectionProcedure procedure = stiProtectionService.findByExternalId(procedureId);
    Assert.isNull(procedure.getAnonymousUserId(), "User already registered.");
    CitizenAccessCodeUserDto user =
        moduleClientAuthenticator.doWithModuleClientAuthentication(
            () ->
                citizenAccessCodeUserApi.addCitizenAccessCodeUserWithPinCredential(
                    new AddCitizenAccessCodeUserWithPinCredentialRequest(pin)));
    procedure.setAnonymousUserId(user.userId());
    procedure.setAccessCode(user.accessCode());
    return user;
  }

  public void deleteCitizenAccessCodeUser(UUID userId) {
    this.moduleClientAuthenticator.doWithModuleClientAuthentication(
        () -> citizenAccessCodeUserApi.deleteCitizenAccessCodeUser(userId));
  }

  public StiProtectionProcedure setPersonalDetails(UUID procedureId, PersonData personData) {
    StiProtectionProcedure procedure = stiProtectionService.findByExternalId(procedureId);
    stiProtectionService.addPerson(procedure, personData);
    return procedure;
  }

  public void confirmAppointment(UUID procedureId) {
    StiProtectionProcedure procedure = stiProtectionService.findByExternalId(procedureId);
    Assert.notNull(procedure.getAnonymousUserId(), "User registration is required");
    Assert.notNull(procedure.getAppointment(), "Appointment is required");
    Assert.notNull(procedure.getPerson(), "Personal information is required");
    procedureExpirationRepository
        .findByProcedureExternalId(procedureId)
        .ifPresent(procedureExpirationRepository::delete);
  }

  public Pdf getAnonymousIdentificationDocument(UUID procedureId) {
    return moduleClientAuthenticator.doWithModuleClientAuthentication(
        () -> stiProtectionService.getAnonymousIdentificationDocument(procedureId));
  }

  public void cancelPendingAppointment(UUID procedureId) {
    Optional<ProcedureExpiration> expirationOptional =
        procedureExpirationRepository.findByProcedureExternalId(procedureId);
    Assert.isTrue(
        expirationOptional.isPresent(), "Pending appointment must have an expiration procedure");
    StiProtectionProcedure procedure = stiProtectionService.findByExternalId(procedureId);
    Appointment appointment = procedure.getAppointment();
    Assert.notNull(appointment, "A procedure must reference an appointment to cancel");
    Assert.isTrue(
        CITIZEN_PORTAL.equals(procedure.getStiProcedureOrigin()),
        "Required a procedure originated from Citizen Portal");

    appointmentCooldownService.removeAppointmentCooldown(appointment);
    stiProtectionService.deleteProcedure(procedure);
    procedureExpirationRepository.delete(expirationOptional.get());
  }

  public void cancelAppointment(StiProtectionProcedure procedure) {
    Appointment appointment = procedure.getAppointment();
    Appointments.removeAppointmentFromBlock(appointment);
    appointmentCooldownService.setAppointmentOnCooldown(appointment);

    procedure.setAppointment(null);
    procedure.setCalendarEventId(null);
    procedure.setUserDefinedAppointment(null);
    cancelAppointmentHistoryEntry(procedure);
  }

  private void cancelAppointmentHistoryEntry(StiProtectionProcedure procedure) {
    List<AppointmentHistoryEntry> appointmentHistory = procedure.getAppointmentHistory();
    if (!appointmentHistory.isEmpty()) {
      AppointmentHistoryEntry appointmentHistoryEntry = appointmentHistory.getLast();
      appointmentHistoryEntry.setAppointmentStatus(AppointmentStatus.CANCELLED);
    }
  }

  public StiProtectionProcedure findByExternalId(UUID procedureId) {
    return stiProtectionService.findByExternalId(procedureId);
  }

  public void finalizeDraftProcedure(UUID procedureId) {
    stiProtectionService.openProcedure(procedureId);
  }
}
