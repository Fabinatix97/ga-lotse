/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.actor.mapper;

import de.eshg.lib.servicedirectory.api.ActorMetadataDto;
import de.eshg.lib.servicedirectory.api.ActorRequestDto;
import de.eshg.lib.servicedirectory.api.ActorResponseDto;
import de.eshg.lib.servicedirectory.api.CertificateDto;
import de.eshg.servicedirectory.actor.persistence.entity.Actor.Certificate;
import de.eshg.servicedirectory.actor.persistence.entity.ActorMetadata;
import de.eshg.servicedirectory.actor.persistence.entity.ActorType;
import de.eshg.servicedirectory.actor.persistence.entity.AuditedActor;
import de.eshg.servicedirectory.actor.persistence.entity.StagedActor;
import de.eshg.servicedirectory.common.AdminNameHolder;
import de.eshg.servicedirectory.orgunit.persistence.entity.AuditedOrgUnit;
import de.eshg.servicedirectory.staging.persistence.entity.StagedEntityType;
import de.eshg.servicedirectory.staging.persistence.entity.StagingStatus;
import java.util.Objects;

public class ActorMapperApi {

  private ActorMapperApi() {
    throw new IllegalStateException("Utility class");
  }

  public static ActorResponseDto mapActorToApi(AuditedActor actor) {
    if (actor == null) {
      return null;
    }
    return new ActorResponseDto(
        actor.getId(),
        calculateNaturalId(actor),
        actor.getReadableName(),
        ActorType.convert(actor.getType(), de.eshg.lib.servicedirectory.api.ActorTypeDto.class),
        actor.isActive(),
        actor.isManualCertificate(),
        actor.getCommonName(),
        toApi(actor.getCurrentCertificate()),
        toApi(actor.getPreviousCertificate()),
        toApi(actor.getActorMetadata()),
        actor.getNetworkId(),
        actor.getOrgUnit() == null ? null : actor.getOrgUnit().getId());
  }

  public static String calculateNaturalId(AuditedActor actor) {
    AuditedOrgUnit orgUnit = actor.getOrgUnit();
    String federalState = Objects.requireNonNull(orgUnit.getFederalState()).name();
    String orgUnitType = Objects.requireNonNull(orgUnit.getType()).name();
    String orgUnitReadableName = Objects.requireNonNull(orgUnit.getReadableName());

    String actorType = Objects.requireNonNull(actor.getType()).name();
    String actorReadableName = Objects.requireNonNull(actor.getReadableName());

    String orgUnitPart = federalState + "/" + orgUnitType + "/" + orgUnitReadableName;
    String actorPart = actorType + "/" + actorReadableName;

    return orgUnitPart + "/" + actorPart;
  }

  public static Certificate toPersistence(CertificateDto certificate) {
    if (certificate == null) {
      return null;
    }
    return new Certificate(certificate.value(), certificate.signature(), certificate.signatory());
  }

  public static CertificateDto toApi(Certificate certificate) {
    if (certificate == null) {
      return null;
    }
    return new CertificateDto(
        certificate.value(), certificate.signature(), certificate.signatory());
  }

  public static ActorMetadataDto toApi(ActorMetadata actorMetadata) {
    if (actorMetadata == null) {
      return null;
    }
    return new ActorMetadataDto(
        actorMetadata.getId(), actorMetadata.getContent(), actorMetadata.getChangedAt());
  }

  public static StagedActor toStaged(AuditedActor auditedActor) {
    StagedActor actor = new StagedActor();
    actor.setAuditedEntity(auditedActor);
    actor.setStagedEntityType(StagedEntityType.MOD);
    actor.setCreatedBy(AdminNameHolder.getAdminName());
    actor.setCommonName(auditedActor.getCommonName());
    actor.setReadableName(auditedActor.getReadableName());
    actor.setNetworkId(auditedActor.getNetworkId());
    actor.setCurrentCertificate(auditedActor.getCurrentCertificate());
    actor.setPreviousCertificate(auditedActor.getPreviousCertificate());
    actor.setActive(auditedActor.isActive());
    actor.setManualCertificate(auditedActor.isManualCertificate());
    actor.setType(auditedActor.getType());

    // will most likely be overwritten but set to WIP just in case
    actor.setStagingStatus(StagingStatus.WORK_IN_PROGRESS);

    return actor;
  }

  public static AuditedActor toAudited(
      ActorRequestDto actorRequestDto, String commonName, String networkId) {
    var actor = new AuditedActor();
    actor.setReadableName(actorRequestDto.readableName());
    actor.setCurrentCertificate(toPersistence(actorRequestDto.certificate()));
    actor.setType(ActorType.convert(actorRequestDto.type(), ActorType.class));
    actor.setCommonName(commonName);
    actor.setNetworkId(networkId);
    actor.setActive(false);
    actor.setManualCertificate(false);
    return actor;
  }

  public static void toAudited(AuditedActor auditedActor, StagedActor actor) {
    auditedActor.setCommonName(actor.getCommonName());
    auditedActor.setReadableName(actor.getReadableName());
    auditedActor.setManualCertificate(actor.isManualCertificate());
    if (auditedActor.isManualCertificate()) {
      auditedActor.setCurrentCertificate(actor.getCurrentCertificate());
      auditedActor.setPreviousCertificate(actor.getPreviousCertificate());
    }
    auditedActor.setNetworkId(actor.getNetworkId());
    auditedActor.setType(actor.getType());
    auditedActor.setActive(actor.isActive());
  }
}
