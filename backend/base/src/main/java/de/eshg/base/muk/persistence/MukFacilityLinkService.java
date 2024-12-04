/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.muk.persistence;

import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.keycloak.CitizenKeycloakClient;
import de.eshg.base.keycloak.RealmBoundKeycloakClient;
import de.eshg.base.muk.persistence.entity.MukFacilityLink;
import de.eshg.base.muk.persistence.repository.MukFacilityLinkRepository;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

@Service
public class MukFacilityLinkService {

  private final MukFacilityLinkRepository mukFacilityLinkRepository;
  private final CitizenKeycloakClient citizenKeycloakClient;
  private final AuditLogger auditLogger;

  public MukFacilityLinkService(
      MukFacilityLinkRepository mukFacilityLinkRepository,
      CitizenKeycloakClient citizenKeycloakClient,
      AuditLogger auditLogger) {
    this.mukFacilityLinkRepository = mukFacilityLinkRepository;
    this.citizenKeycloakClient = citizenKeycloakClient;
    this.auditLogger = auditLogger;
  }

  public void addMukFacilityLink(String mukId, Facility refFacility) {
    if (identicalMukFacilityLinkAlreadyExists(mukId, refFacility)) {
      return;
    }

    if (citizenKeycloakClient.getUserByName(mukId).isEmpty()) {
      throw new NotFoundException("MUK user id not found");
    }

    MukFacilityLink mukFacilityLink = new MukFacilityLink();
    mukFacilityLink.setMukId(mukId);
    mukFacilityLink.setReferenceFacility(refFacility);
    refFacility.setMukFacilityLink(mukFacilityLink);

    MukFacilityLink savedMukFacilityLink = mukFacilityLinkRepository.save(mukFacilityLink);
    writeAuditLog(mapAuditLog(savedMukFacilityLink));
  }

  private boolean identicalMukFacilityLinkAlreadyExists(String mukId, Facility refFacility) {
    Optional<MukFacilityLink> potentialMatch = mukFacilityLinkRepository.findByMukId(mukId);
    return potentialMatch
        .map(
            mukFacilityLink ->
                mukFacilityLink
                    .getReferenceFacility()
                    .getExternalId()
                    .equals(refFacility.getExternalId()))
        .orElse(false);
  }

  // TODO (ISSUE-6556): Use 'DatenuebermittlerPseudonymId' as mukId instead of username
  public String getMukSelfUserId() {
    UserRepresentation selfUserRepresentation =
        citizenKeycloakClient.getSelfUser().toRepresentation();

    RealmBoundKeycloakClient.getSelfUserId();

    return selfUserRepresentation.getUsername();
  }

  public Facility getReferenceFacility(String mukId) {
    MukFacilityLink mukFacilityLink =
        mukFacilityLinkRepository
            .findByMukId(mukId)
            .orElseThrow(() -> new NotFoundException("Muk Facility Link not found"));

    return mukFacilityLink.getReferenceFacility();
  }

  private void writeAuditLog(Map<String, String> attributes) {
    attributes = new LinkedHashMap<>(attributes);
    attributes.put(
        "durch Benutzer", CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"));
    auditLogger.log("MukFacilityLink", "Hinzufügen", attributes);
  }

  private Map<String, String> mapAuditLog(MukFacilityLink savedMukFacilityLink) {
    return Map.of(
        "MukFacilityLink Id",
        savedMukFacilityLink.getId().toString(),
        "MukId",
        savedMukFacilityLink.getMukId(),
        "FacilityId",
        savedMukFacilityLink.getReferenceFacility().getExternalId().toString());
  }
}
