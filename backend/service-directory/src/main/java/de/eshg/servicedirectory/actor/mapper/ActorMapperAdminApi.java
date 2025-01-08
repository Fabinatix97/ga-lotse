/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.actor.mapper;

import de.eshg.libservicedirectoryadminapi.api.actor.*;
import de.eshg.libservicedirectoryadminapi.api.actor.ActorDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagedEntityDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagedEntityTypeDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagingStatusDto;
import de.eshg.servicedirectory.actor.persistence.entity.*;
import de.eshg.servicedirectory.actor.persistence.entity.Actor.Certificate;
import de.eshg.servicedirectory.common.AdminNameHolder;
import de.eshg.servicedirectory.staging.persistence.entity.StagedEntityType;
import de.eshg.servicedirectory.staging.persistence.entity.StagingStatus;

public class ActorMapperAdminApi {

  private ActorMapperAdminApi() {
    throw new IllegalStateException("Utility class");
  }

  public static PartialActorDto toApi(StagedActor actor) {
    if (actor == null) return null;
    return new PartialActorDto(
        actor.getId(),
        actor.getReadableName(),
        ActorType.convert(actor.getType(), ActorTypeDto.class),
        actor.isActive(),
        actor.isManualCertificate(),
        actor.getCommonName(),
        toApi(actor.getCurrentCertificate()),
        toApi(actor.getPreviousCertificate()),
        actor.getNetworkId(),
        actor.getOrgUnitId(),
        StagingStatus.convert(actor.getStagingStatus(), StagingStatusDto.class));
  }

  public static StagedEntityDto<PartialActorDto> toApiStaged(StagedActor actor) {
    if (actor == null) return null;
    PartialActorDto actorResponseDto = actor.isPreserved() ? toApi(actor) : null;
    return new StagedEntityDto<>(
        actor.getId(),
        actorResponseDto,
        StagedEntityTypeDto.from(actor.getStagedEntityType()),
        actor.getAuditedEntityIdOrNull(),
        actor.getCreatedBy(),
        StagingStatusDto.from(actor.getStagingStatus()));
  }

  public static Certificate toPersistence(CertificateDto certificate) {
    if (certificate == null) {
      return null;
    }
    return new Certificate(certificate.value(), certificate.signature(), certificate.signatory());
  }

  public static ActorMetadata toPersistence(ActorMetadataDto dto) {
    if (dto == null) {
      return null;
    }
    ActorMetadata metadata = new ActorMetadata();
    metadata.setContent(dto.content());
    metadata.setChangedAt(dto.changedAt());
    return metadata;
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

  public static StagedActor toStaged(PartialActorDto partialActorDto) {
    StagedActor actor = new StagedActor();
    actor.setStagedEntityType(StagedEntityType.ADD);
    actor.setCreatedBy(AdminNameHolder.getAdminName());
    actor.setReadableName(partialActorDto.readableName());
    actor.setType(ActorType.convert(partialActorDto.type(), ActorType.class));
    actor.setNetworkId(partialActorDto.networkId());
    actor.setCommonName(partialActorDto.commonName());
    actor.setCurrentCertificate(toPersistence(partialActorDto.currentCertificate()));
    actor.setPreviousCertificate(toPersistence(partialActorDto.previousCertificate()));
    actor.setActive(partialActorDto.active());
    actor.setManualCertificate(partialActorDto.manualCertificate());
    actor.setStagingStatus(StagingStatus.from(partialActorDto.stagingStatus()));
    return actor;
  }

  public static ActorDto toApi(AuditedActor auditedActor) {
    return toApi(auditedActor, true);
  }

  public static ActorDto toApi(AuditedActor auditedActor, boolean withCertificates) {
    Certificate currentCertificate = auditedActor.getCurrentCertificate();
    Certificate previousCertificate = auditedActor.getPreviousCertificate();

    return new ActorDto(
        auditedActor.getId(),
        ActorMapperApi.calculateNaturalId(auditedActor),
        auditedActor.getReadableName(),
        ActorType.convert(auditedActor.getType(), ActorTypeDto.class),
        auditedActor.isActive(),
        auditedActor.isManualCertificate(),
        auditedActor.getCommonName(),
        withCertificates && currentCertificate != null
            ? new CertificateDto(
                currentCertificate.value(),
                currentCertificate.signature(),
                currentCertificate.signatory())
            : null,
        withCertificates && previousCertificate != null
            ? new CertificateDto(
                previousCertificate.value(),
                previousCertificate.signature(),
                previousCertificate.signatory())
            : null,
        auditedActor.getNetworkId(),
        toApi(auditedActor.getActorMetadata()));
  }
}
