/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.bundid.persistence;

import de.eshg.base.bundid.persistence.entity.BundIdPersonLink;
import de.eshg.base.bundid.persistence.repository.BundIdPersonLinkRepository;
import de.eshg.base.centralfile.persistence.entity.Person;
import de.eshg.base.keycloak.CitizenKeycloakClient;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.keycloak.CitizenUserAttribute;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
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

  public void addBundIdPersonLink(String bpk2, Person refPerson) {
    if (identicalBundIdPersonLinkAlreadyExists(bpk2, refPerson)) {
      return;
    }

    BundIdPersonLink bundIdPersonLink = new BundIdPersonLink();
    bundIdPersonLink.setBpk2(bpk2);
    bundIdPersonLink.setReferencePerson(refPerson);
    refPerson.setBundIdPersonLink(bundIdPersonLink);

    BundIdPersonLink savedBundIdPersonLink = bundIdPersonLinkRepository.save(bundIdPersonLink);
    writeAuditLog(mapAuditLog(savedBundIdPersonLink));
  }

  private boolean identicalBundIdPersonLinkAlreadyExists(String bpk2, Person refPerson) {
    Optional<BundIdPersonLink> potentialMatch = bundIdPersonLinkRepository.findByBpk2(bpk2);
    return potentialMatch
        .map(
            bundIdPersonLink ->
                bundIdPersonLink
                    .getReferencePerson()
                    .getExternalId()
                    .equals(refPerson.getExternalId()))
        .orElse(false);
  }

  public String getBundIdSelfUserBPK2() {
    return citizenKeycloakClient
        .getSelfUser()
        .toRepresentation()
        .firstAttribute(CitizenUserAttribute.BUND_ID_B_PK_2.getKey());
  }

  public Optional<Person> getReferencePersonGraceFully(String bpk2) {
    return bundIdPersonLinkRepository.findByBpk2(bpk2).map(BundIdPersonLink::getReferencePerson);
  }

  public Person getReferencePerson(String bpk2) {
    return getReferencePersonGraceFully(bpk2)
        .orElseThrow(() -> new NotFoundException("BundId Person Link not found"));
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
        "bpk2",
        bundIdPersonLink.getBpk2(),
        "PersonId",
        bundIdPersonLink.getReferencePerson().getExternalId().toString());
  }
}
