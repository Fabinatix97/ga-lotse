/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory;

import static java.util.stream.Collectors.*;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.lib.servicedirectory.api.*;
import de.eshg.lib.servicedirectory.util.CertificateSignatureUtil;
import de.eshg.servicedirectory.actor.exception.ActorNotActiveException;
import de.eshg.servicedirectory.actor.exception.ActorNotFoundException;
import de.eshg.servicedirectory.actor.mapper.ActorMapperApi;
import de.eshg.servicedirectory.actor.persistence.entity.Actor.Certificate;
import de.eshg.servicedirectory.actor.persistence.entity.ActorMetadata;
import de.eshg.servicedirectory.actor.persistence.entity.ActorType;
import de.eshg.servicedirectory.actor.persistence.entity.AuditedActor;
import de.eshg.servicedirectory.actor.persistence.repository.AuditedActorRepository;
import de.eshg.servicedirectory.common.exception.ServiceDirectoryBadRequestException;
import de.eshg.servicedirectory.common.exception.ServiceDirectoryForbiddenException;
import de.eshg.servicedirectory.orgunit.exception.OrgUnitNotFoundException;
import de.eshg.servicedirectory.orgunit.persistence.entity.AuditedOrgUnit;
import de.eshg.servicedirectory.orgunit.persistence.entity.OrgUnitType;
import de.eshg.servicedirectory.orgunit.persistence.repository.AuditedOrgUnitRepository;
import de.eshg.servicedirectory.rule.persistence.entity.ActorSelector;
import de.eshg.servicedirectory.rule.persistence.entity.AuditedRule;
import de.eshg.servicedirectory.rule.persistence.repository.AuditedRuleRepository;
import de.eshg.servicedirectory.util.X509Utils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.security.cert.X509Certificate;
import java.time.Clock;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceDirectoryService {

  private final AuditedActorRepository auditedActorRepository;

  private final AuditedOrgUnitRepository auditedOrgUnitRepository;

  private final AuditedRuleRepository auditedRuleRepository;

  private static final Logger log = LoggerFactory.getLogger(ServiceDirectoryService.class);

  private final Clock clock;

  @PersistenceContext private EntityManager entityManager;

  public ServiceDirectoryService(
      AuditedActorRepository auditedActorRepository,
      AuditedOrgUnitRepository auditedOrgUnitRepository,
      AuditedRuleRepository auditedRuleRepository,
      Clock clock) {
    this.auditedActorRepository = auditedActorRepository;
    this.auditedOrgUnitRepository = auditedOrgUnitRepository;
    this.auditedRuleRepository = auditedRuleRepository;
    this.clock = clock;
  }

  @Transactional(readOnly = true)
  public long getCurrentRevisionId() {
    Long currentRevision =
        (Long) entityManager.createNativeQuery("select max(id) from revinfo").getSingleResult();
    return Optional.ofNullable(currentRevision).orElse(0L);
  }

  @Transactional(readOnly = true)
  public ActiveActorsWithRevision getActiveActors(
      ActorTypeDto type, OrgUnitTypeDto orgUnitTypeDto, UUID orgUnitId) {
    AuditedActor actor = new AuditedActor();
    actor.setActive(true);
    actor.setType(ActorType.from(type));
    if (orgUnitTypeDto != null || orgUnitId != null) {
      AuditedOrgUnit orgUnit =
          new AuditedOrgUnit() {
            {
              this.type = OrgUnitType.from(orgUnitTypeDto);
              this.id = orgUnitId;
              this.active = true;
            }
          };
      actor.setOrgUnit(orgUnit);
    }
    return new ActiveActorsWithRevision(
        auditedActorRepository.findAll(Example.of(actor)).stream()
            .map(ActorMapperApi::mapActorToApi)
            .toList(),
        getCurrentRevisionId());
  }

  public GetTrustedActorsResponse getTrustedActorsForActor(AuditedActor actor) {

    AuditedOrgUnit orgUnit = actor.getOrgUnit();

    List<AuditedActor> allAuditedActiveActors = getAllActiveActors();
    List<AuditedRule> allAuditedActiveRules = auditedRuleRepository.findAllByActiveIsTrue();

    // rules with actor as client
    Set<AuditedRule> matchingClientRules =
        allAuditedActiveRules.stream()
            .filter(auditedRule -> matching(orgUnit, actor, auditedRule.getClient()))
            .collect(toSet());

    // rules with actor as server
    Set<AuditedRule> matchingServerRules =
        allAuditedActiveRules.stream()
            .filter(auditedRule -> matching(orgUnit, actor, auditedRule.getServer()))
            .collect(toSet());

    // clients allowed to call actor as server = inbound
    Set<ActorResponseDto> trustedInboundActors =
        allAuditedActiveActors.stream()
            .filter(
                potentialClientActor -> {
                  AuditedOrgUnit potentialClientOrgUnit = potentialClientActor.getOrgUnit();
                  // use matchingServerRules to obtain trusted clients of actor
                  return matchingServerRules.stream()
                      .anyMatch(
                          auditedRule ->
                              matching(
                                  potentialClientOrgUnit,
                                  potentialClientActor,
                                  auditedRule.getClient()));
                })
            .map(ActorMapperApi::mapActorToApi)
            .collect(toSet());

    // Servers allowed to be called by the actor as server = outbound
    Set<ActorResponseDto> trustedOutboundActors =
        allAuditedActiveActors.stream()
            .filter(
                potentialServerActor -> {
                  AuditedOrgUnit potentialServerOrgUnit = potentialServerActor.getOrgUnit();
                  // use matchingClientRules to obtain trusted servers of actor
                  return matchingClientRules.stream()
                      .anyMatch(
                          auditedRule ->
                              matching(
                                  potentialServerOrgUnit,
                                  potentialServerActor,
                                  auditedRule.getServer()));
                })
            .map(ActorMapperApi::mapActorToApi)
            .collect(toSet());

    return new GetTrustedActorsResponse(trustedInboundActors, trustedOutboundActors);
  }

  public List<AuditedActor> getAllActiveActors() {
    return auditedActorRepository.findAllActive();
  }

  private static boolean matching(
      AuditedOrgUnit orgUnit, AuditedActor actor, ActorSelector selector) {
    return (selector.federalState() == null
            || selector.federalState().equals(orgUnit.getFederalState().name()))
        && (selector.orgUnitType() == null
            || selector.orgUnitType().equals(orgUnit.getType().name()))
        && (selector.orgUnitName() == null
            || selector.orgUnitName().equals(orgUnit.getReadableName()))
        && (selector.actorType() == null || selector.actorType().equals(actor.getType().name()))
        && (selector.actorName() == null || selector.actorName().equals(actor.getReadableName()));
  }

  public record ActiveActorsWithRevision(List<ActorResponseDto> actors, long revision) {}

  @Transactional(readOnly = true)
  public ActorResponseDto getActorByCommonName(String commonName) {
    return ActorMapperApi.mapActorToApi(getAuditedActorByCommonName(commonName));
  }

  @Transactional(readOnly = true)
  public AuditedActor getAuditedActorByCommonName(String commonName) {
    Optional<AuditedActor> optionalActor = auditedActorRepository.findByCommonName(commonName);
    return optionalActor.orElseThrow(() -> new ActorNotFoundException(commonName));
  }

  @Transactional
  public void updateTopology(String lsdCommonName, List<ActorRequestDto> actorRequestDtos) {
    AuditedActor auditedLSD = getValidLSD(lsdCommonName);
    AuditedOrgUnit orgUnit = getValidOrgUnit(auditedLSD);

    for (ActorRequestDto actorRequestDto : actorRequestDtos) {
      if (CertificateSignatureUtil.validateSignature(actorRequestDto)) {
        upsertActor(actorRequestDto, orgUnit.getId(), auditedLSD.getNetworkId());
      }
    }
  }

  private AuditedActor getValidLSD(String lsdCommonName) {
    AuditedActor auditedLSD = getActorOrThrow(lsdCommonName);
    verifyLSD(lsdCommonName, auditedLSD);
    return auditedLSD;
  }

  private static void verifyLSD(String lsdCommonName, AuditedActor auditedLSD) {
    if (!ActorType.LSD.equals(auditedLSD.getType())) {
      throw new ServiceDirectoryForbiddenException(
          "The actor with common name '" + lsdCommonName + "' is not a Local Service Directory");
    }
    if (!Boolean.TRUE.equals(auditedLSD.isActive())) {
      throw new ActorNotActiveException(lsdCommonName);
    }
  }

  private static AuditedOrgUnit getValidOrgUnit(AuditedActor auditedLSD) {
    AuditedOrgUnit orgUnit = auditedLSD.getOrgUnit();
    verifyOrgUnit(orgUnit);
    return orgUnit;
  }

  private static void verifyOrgUnit(AuditedOrgUnit orgUnit) {
    Objects.requireNonNull(orgUnit.getId(), "organization unit must not be null");

    if (!Boolean.TRUE.equals(orgUnit.isActive())) {
      throw new ServiceDirectoryForbiddenException("organization unit is not active");
    }
  }

  private AuditedActor getActorOrThrow(String commonName) {
    Optional<AuditedActor> optionalActor = auditedActorRepository.findByCommonName(commonName);
    if (optionalActor.isEmpty()) {
      throw new ActorNotFoundException(commonName);
    }
    return optionalActor.get();
  }

  private void upsertActor(ActorRequestDto actorRequestDto, UUID orgUnitId, String networkId) {
    if (actorRequestDto.certificate() == null) {
      throw new ServiceDirectoryBadRequestException("Null for actor certificate not allowed");
    }
    X509Certificate cert = X509Utils.parsePem(actorRequestDto.certificate().value());
    String commonName = X509Utils.extractCommonName(cert);
    if (isEmpty(commonName)) {
      throw new ServiceDirectoryBadRequestException("Null for actor common name not allowed");
    }
    Optional<AuditedActor> actorData = getActor(commonName);

    if (actorData.isEmpty() && actorRequestDto.readableName() != null) {
      getActor(orgUnitId, actorRequestDto.readableName())
          .ifPresent(
              otherActor -> {
                throw new ServiceDirectoryBadRequestException(
                    "Cannot update CN of actor %s from %s to %s"
                        .formatted(
                            ActorMapperApi.calculateNaturalId(otherActor),
                            otherActor.getCommonName(),
                            commonName));
              });
    }

    actorData.ifPresentOrElse(
        actor -> {
          boolean certificateUpdate =
              !actorRequestDto
                  .certificate()
                  .value()
                  .equals(
                      Optional.ofNullable(actor.getCurrentCertificate())
                          .map(Certificate::value)
                          .orElse(null));
          Certificate previousCertificate =
              certificateUpdate ? actor.getCurrentCertificate() : actor.getPreviousCertificate();
          updateActor(actor, actorRequestDto, commonName, previousCertificate, orgUnitId);
        },
        () -> createActor(actorRequestDto, commonName, orgUnitId, networkId));
  }

  private void updateActor(
      AuditedActor updatedActor,
      ActorRequestDto actorRequestDto,
      String commonName,
      Certificate previousCertificate,
      UUID orgUnitId) {
    if (updatedActor.isManualCertificate()) {
      throw new ServiceDirectoryBadRequestException(
          "Cannot update certificate for actor %s (%s): manual_certificate"
              .formatted(ActorMapperApi.calculateNaturalId(updatedActor), updatedActor.getId()));
    }
    if (!isEmpty(actorRequestDto.readableName())
        && !actorRequestDto.readableName().equals(updatedActor.getReadableName())) {
      logChangeAttempt("readableName");
    }
    if (actorRequestDto.type() != null
        && !actorRequestDto.type().name().equals(updatedActor.getType().name())) {
      logChangeAttempt("type");
    }
    if (!isEmpty(commonName) && !commonName.equals(updatedActor.getCommonName())) {
      logChangeAttempt("commonName");
    }
    if (actorRequestDto.certificate() != null) {
      updatedActor.setCurrentCertificate(
          ActorMapperApi.toPersistence(actorRequestDto.certificate()));
    }
    if (previousCertificate != null) {
      updatedActor.setPreviousCertificate(previousCertificate);
    }
    ServiceDirectoryAdminService.validateCommonName(
        updatedActor.getCurrentCertificate(), updatedActor.getCommonName());
    ServiceDirectoryAdminService.validateCommonName(
        updatedActor.getPreviousCertificate(), updatedActor.getCommonName());

    if (!updatedActor.getOrgUnit().getId().equals(orgUnitId)) {
      throw new ServiceDirectoryBadRequestException(
          "LSD of %s cannot update actor %s of %s"
              .formatted(orgUnitId, updatedActor.getId(), updatedActor.getOrgUnit().getId()));
    }

    auditedActorRepository.save(updatedActor);
  }

  private void logChangeAttempt(String property) {
    log.warn("There has been an attempt to change the {} of the actor", property);
  }

  private void createActor(
      ActorRequestDto actorRequestDto, String commonName, UUID orgUnitId, String networkId) {
    if (isEmpty(actorRequestDto.readableName())) {
      throw new ServiceDirectoryBadRequestException("Null or empty readableName not allowed");
    }
    if (actorRequestDto.type() == null) {
      throw new ServiceDirectoryBadRequestException("Null type not allowed");
    }
    if (isEmpty(actorRequestDto.hostName())) {
      throw new ServiceDirectoryBadRequestException("Null or empty hostName not allowed");
    }
    if (isEmpty(commonName)) {
      throw new ServiceDirectoryBadRequestException("Null or empty commonName not allowed");
    }
    validateCommonName(actorRequestDto.certificate(), commonName);
    AuditedActor actor = ActorMapperApi.toAudited(actorRequestDto, commonName, networkId);

    updateOrgUnit(orgUnitId, actor);

    auditedActorRepository.save(actor);
  }

  private void updateOrgUnit(UUID orgUnitId, AuditedActor updatedActor) {
    if (orgUnitId != null) {
      Optional<AuditedOrgUnit> optionalOrgUnit = auditedOrgUnitRepository.findById(orgUnitId);
      if (optionalOrgUnit.isPresent()) {
        var orgUnit = optionalOrgUnit.get();
        updatedActor.setOrgUnit(orgUnit);
      } else {
        throw new OrgUnitNotFoundException(orgUnitId);
      }
    }
  }

  private Optional<AuditedActor> getActor(String commonName) {
    return auditedActorRepository.findByCommonName(commonName);
  }

  private Optional<AuditedActor> getActor(UUID orgUnitId, String readableName) {
    return auditedActorRepository.findByOrgUnitIdAndReadableName(orgUnitId, readableName);
  }

  private static void validateCommonName(CertificateDto certificate, String commonName) {
    if (certificate == null) {
      return;
    }
    ServiceDirectoryAdminService.validateCommonName(certificate.value(), commonName);
  }

  public String getNaturalIdByCommonName(String commonName) {
    var optionalActor = auditedActorRepository.findByCommonName(commonName);
    if (optionalActor.isPresent()) {
      AuditedActor actor = optionalActor.get();
      if (!Boolean.TRUE.equals(actor.isActive())) {
        throw new ActorNotActiveException(commonName);
      }
      return ActorMapperApi.calculateNaturalId(actor);
    } else {
      throw new ActorNotFoundException(commonName);
    }
  }

  @Transactional
  public ActorResponseDto updateActorMetadata(
      String commonName, ActorMetadataDto actorMetadataDto) {
    // we're allowing the deletion of metadata by setting it null
    if (actorMetadataDto.content() != null) {
      validateJsonContent(actorMetadataDto.content());
    }

    AuditedActor actor = getActorOrThrow(commonName);
    ActorMetadata actorMetadata;
    if (actor.getActorMetadata() != null) {
      actorMetadata = actor.getActorMetadata();
    } else {
      actorMetadata = new ActorMetadata();
    }

    actorMetadata.setContent(actorMetadataDto.content());
    actorMetadata.setChangedAt(clock.instant());
    actor.setActorMetadata(actorMetadata);

    AuditedActor actorFromDb = auditedActorRepository.save(actor);
    return ActorMapperApi.mapActorToApi(actorFromDb);
  }

  static void validateJsonContent(String content) {
    ObjectMapper mapper = new ObjectMapper().enable(DeserializationFeature.FAIL_ON_TRAILING_TOKENS);
    try {
      mapper.readTree(content);
    } catch (JacksonException e) {
      throw new ServiceDirectoryBadRequestException("Json content is not valid");
    }
  }
}
