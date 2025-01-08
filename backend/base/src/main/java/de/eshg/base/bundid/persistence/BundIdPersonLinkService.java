/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.bundid.persistence;

import de.eshg.base.bundid.persistence.entity.BundIdPersonLink;
import de.eshg.base.bundid.persistence.repository.BundIdPersonLinkRepository;
import de.eshg.base.centralfile.persistence.entity.Person;
import de.eshg.base.keycloak.CitizenKeycloakClient;
import de.eshg.base.keycloak.RealmBoundKeycloakClient;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

@Service
public class BundIdPersonLinkService {

  private final BundIdPersonLinkRepository bundIdPersonLinkRepository;
  private final CitizenKeycloakClient citizenKeycloakClient;
  private final AuditLogger auditLogger;

  public BundIdPersonLinkService(
      BundIdPersonLinkRepository bundIdPersonLinkRepository,
      CitizenKeycloakClient citizenKeycloakClient,
      AuditLogger auditLogger) {
    this.citizenKeycloakClient = citizenKeycloakClient;
    this.bundIdPersonLinkRepository = bundIdPersonLinkRepository;
    this.auditLogger = auditLogger;
  }

  public void addBundIdPersonLink(String bundId, Person refPerson) {
    if (identicalBundIdPersonLinkAlreadyExists(bundId, refPerson)) {
      return;
    }

    if (citizenKeycloakClient.getUserByName(bundId).isEmpty()) {
      throw new NotFoundException("BundId user id not found");
    }

    BundIdPersonLink bundIdPersonLink = new BundIdPersonLink();
    bundIdPersonLink.setBundId(bundId);
    bundIdPersonLink.setReferencePerson(refPerson);
    refPerson.setBundIdPersonLink(bundIdPersonLink);

    BundIdPersonLink savedBundIdPersonLink = bundIdPersonLinkRepository.save(bundIdPersonLink);
    writeAuditLog(mapAuditLog(savedBundIdPersonLink));
  }

  private boolean identicalBundIdPersonLinkAlreadyExists(String mukId, Person refPerson) {
    Optional<BundIdPersonLink> potentialMatch = bundIdPersonLinkRepository.findByBundId(mukId);
    return potentialMatch
        .map(
            mukFacilityLink ->
                mukFacilityLink
                    .getReferencePerson()
                    .getExternalId()
                    .equals(refPerson.getExternalId()))
        .orElse(false);
  }

  // TODO (ISSUE-6575): Use 'bPK2' as bundId instead of username
  public String getBundIdSelfUserId() {
    UserRepresentation selfUserRepresentation =
        citizenKeycloakClient.getSelfUser().toRepresentation();

    RealmBoundKeycloakClient.getSelfUserId();

    return selfUserRepresentation.getUsername();
  }

  public Person getReferencePersons(String bundId) {
    BundIdPersonLink bundIdPersonLink =
        bundIdPersonLinkRepository
            .findByBundId(bundId)
            .orElseThrow(() -> new NotFoundException("BundId Person Link not found"));

    return bundIdPersonLink.getReferencePerson();
  }

  private void writeAuditLog(Map<String, String> attributes) {
    attributes = new LinkedHashMap<>(attributes);
    attributes.put(
        "durch Benutzer", CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"));
    auditLogger.log("BundIdPersonLink", "Hinzufügen", attributes);
  }

  private Map<String, String> mapAuditLog(BundIdPersonLink bundIdPersonLink) {
    return Map.of(
        "BundIdPersonLink Id",
        bundIdPersonLink.getId().toString(),
        "MukId",
        bundIdPersonLink.getBundId(),
        "PersonId",
        bundIdPersonLink.getReferencePerson().getExternalId().toString());
  }
}
