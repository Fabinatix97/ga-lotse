/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserWithPinCredentialRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.stiprotection.persistence.data.PersonData;
import de.eshg.stiprotection.persistence.db.Concern;
import de.eshg.stiprotection.persistence.db.CreatedByUserType;
import de.eshg.stiprotection.persistence.db.ProcedureExpiration;
import de.eshg.stiprotection.persistence.db.ProcedureExpirationRepository;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class CitizenAppointmentService {

  private final ProcedureExpirationRepository procedureExpirationRepository;
  private final CitizenAccessCodeUserApi citizenAccessCodeUserApi;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final StiProtectionProcedureService stiProtectionService;

  public CitizenAppointmentService(
      ProcedureExpirationRepository procedureExpirationRepository,
      CitizenAccessCodeUserApi citizenAccessCodeUserApi,
      ModuleClientAuthenticator moduleClientAuthenticator,
      StiProtectionProcedureService stiProtectionService) {
    this.procedureExpirationRepository = procedureExpirationRepository;
    this.citizenAccessCodeUserApi = citizenAccessCodeUserApi;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.stiProtectionService = stiProtectionService;
  }

  public StiProtectionProcedure createProcedureWithExpiryDate(Concern concern) {
    StiProtectionProcedure procedure =
        stiProtectionService.saveProcedure(concern, CreatedByUserType.CITIZEN_PORTAL);
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
}
