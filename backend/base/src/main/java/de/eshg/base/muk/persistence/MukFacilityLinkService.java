/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.muk.persistence;

import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.keycloak.CitizenKeycloakClient;
import de.eshg.base.muk.persistence.entity.MukFacilityLink;
import de.eshg.base.muk.persistence.repository.MukFacilityLinkRepository;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.keycloak.CitizenUserAttribute;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
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

  public void addMukFacilityLink(String dataTransmitterPseudonymId, Facility refFacility) {
    if (identicalMukFacilityLinkAlreadyExists(dataTransmitterPseudonymId, refFacility)) {
      return;
    }

    MukFacilityLink mukFacilityLink = new MukFacilityLink();
    mukFacilityLink.setDataTransmitterPseudonymId(dataTransmitterPseudonymId);
    mukFacilityLink.setReferenceFacility(refFacility);
    refFacility.setMukFacilityLink(mukFacilityLink);

    MukFacilityLink savedMukFacilityLink = mukFacilityLinkRepository.save(mukFacilityLink);
    writeAuditLog(mapAuditLog(savedMukFacilityLink));
  }

  private boolean identicalMukFacilityLinkAlreadyExists(
      String dataTransmitterPseudonymId, Facility refFacility) {
    Optional<MukFacilityLink> potentialMatch =
        mukFacilityLinkRepository.findByDataTransmitterPseudonymId(dataTransmitterPseudonymId);
    return potentialMatch
        .map(
            mukFacilityLink ->
                mukFacilityLink
                    .getReferenceFacility()
                    .getExternalId()
                    .equals(refFacility.getExternalId()))
        .orElse(false);
  }

  public String getMukSelfUserDataTransmitterPseudonymId() {
    return citizenKeycloakClient
        .getSelfUser()
        .toRepresentation()
        .firstAttribute(CitizenUserAttribute.MUK_DATA_TRANSMITTER_PSEUDONYM_ID.getKey());
  }

  public Optional<Facility> getReferenceFacilityGracefully(String dataTransmitterPseudonymId) {
    return mukFacilityLinkRepository
        .findByDataTransmitterPseudonymId(dataTransmitterPseudonymId)
        .map(MukFacilityLink::getReferenceFacility);
  }

  public Facility getReferenceFacility(String dataTransmitterPseudonymId) {
    return getReferenceFacilityGracefully(dataTransmitterPseudonymId)
        .orElseThrow(() -> new NotFoundException("Muk Facility Link not found"));
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
        "DatenübermittlerPseudonymId",
        savedMukFacilityLink.getDataTransmitterPseudonymId(),
        "FacilityId",
        savedMukFacilityLink.getReferenceFacility().getExternalId().toString());
  }
}
