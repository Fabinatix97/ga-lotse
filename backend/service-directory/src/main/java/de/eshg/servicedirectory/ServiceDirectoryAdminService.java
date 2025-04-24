/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory;

import static de.eshg.servicedirectory.actor.mapper.ActorMapperAdminApi.toPersistence;

import de.eshg.libservicedirectoryadminapi.api.actor.ActorDto;
import de.eshg.libservicedirectoryadminapi.api.actor.ActorMetadataDto;
import de.eshg.libservicedirectoryadminapi.api.actor.CertificateDto;
import de.eshg.libservicedirectoryadminapi.api.actor.PartialActorDto;
import de.eshg.libservicedirectoryadminapi.api.impex.ExportResponse;
import de.eshg.libservicedirectoryadminapi.api.impex.ImportRequest;
import de.eshg.libservicedirectoryadminapi.api.orgunit.OrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.orgunit.PartialOrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.rule.PartialRuleDto;
import de.eshg.libservicedirectoryadminapi.api.rule.RuleDto;
import de.eshg.servicedirectory.actor.exception.ActorNotFoundException;
import de.eshg.servicedirectory.actor.mapper.ActorMapperAdminApi;
import de.eshg.servicedirectory.actor.persistence.entity.Actor.Certificate;
import de.eshg.servicedirectory.actor.persistence.entity.ActorType;
import de.eshg.servicedirectory.actor.persistence.entity.AuditedActor;
import de.eshg.servicedirectory.actor.persistence.entity.StagedActor;
import de.eshg.servicedirectory.actor.persistence.repository.AuditedActorRepository;
import de.eshg.servicedirectory.actor.persistence.repository.StagedActorRepository;
import de.eshg.servicedirectory.common.exception.ServiceDirectoryBadRequestException;
import de.eshg.servicedirectory.orgunit.exception.OrgUnitNotFoundException;
import de.eshg.servicedirectory.orgunit.mapper.OrgUnitMapper;
import de.eshg.servicedirectory.orgunit.persistence.entity.AuditedOrgUnit;
import de.eshg.servicedirectory.orgunit.persistence.entity.OrgUnit;
import de.eshg.servicedirectory.orgunit.persistence.entity.OrgUnitType;
import de.eshg.servicedirectory.orgunit.persistence.entity.StagedOrgUnit;
import de.eshg.servicedirectory.orgunit.persistence.repository.AuditedOrgUnitRepository;
import de.eshg.servicedirectory.orgunit.persistence.repository.StagedOrgUnitRepository;
import de.eshg.servicedirectory.rule.exception.RuleNotFoundException;
import de.eshg.servicedirectory.rule.mapper.RuleMapper;
import de.eshg.servicedirectory.rule.persistence.entity.AuditedRule;
import de.eshg.servicedirectory.rule.persistence.entity.StagedRule;
import de.eshg.servicedirectory.rule.persistence.repository.AuditedRuleRepository;
import de.eshg.servicedirectory.rule.persistence.repository.StagedRuleRepository;
import de.eshg.servicedirectory.staging.persistence.entity.StagedEntityType;
import de.eshg.servicedirectory.staging.persistence.entity.StagingStatus;
import de.eshg.servicedirectory.util.X509Utils;
import java.security.cert.X509Certificate;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceDirectoryAdminService {

  private final AuditedActorRepository auditedActorRepository;

  private final AuditedOrgUnitRepository auditedOrgUnitRepository;

  private final AuditedRuleRepository auditedRuleRepository;

  private final StagedActorRepository stagedActorRepository;

  private final StagedOrgUnitRepository stagedOrgUnitRepository;

  private final StagedRuleRepository stagedRuleRepository;

  private final ServiceDirectoryReadService serviceDirectoryReadService;

  public ServiceDirectoryAdminService(
      AuditedActorRepository auditedActorRepository,
      AuditedOrgUnitRepository auditedOrgUnitRepository,
      AuditedRuleRepository auditedRuleRepository,
      StagedActorRepository stagedActorRepository,
      StagedOrgUnitRepository stagedOrgUnitRepository,
      StagedRuleRepository stagedRuleRepository,
      ServiceDirectoryReadService serviceDirectoryReadService) {
    this.auditedActorRepository = auditedActorRepository;
    this.auditedOrgUnitRepository = auditedOrgUnitRepository;
    this.auditedRuleRepository = auditedRuleRepository;
    this.stagedActorRepository = stagedActorRepository;
    this.stagedOrgUnitRepository = stagedOrgUnitRepository;
    this.stagedRuleRepository = stagedRuleRepository;
    this.serviceDirectoryReadService = serviceDirectoryReadService;
  }

  @Transactional
  public PartialActorDto createActor(PartialActorDto partialActorDto) {
    validateCommonName(partialActorDto.certificate(), partialActorDto.commonName());

    StagedActor actor = ActorMapperAdminApi.toStaged(partialActorDto);

    updateOrgUnit(partialActorDto, actor);
    return ActorMapperAdminApi.toApi(stagedActorRepository.save(actor));
  }

  @Transactional
  public PartialActorDto updateActor(PartialActorDto partialActorDto) {
    return updateActor(
        serviceDirectoryReadService.getStagedActor(partialActorDto.id()), partialActorDto);
  }

  private PartialActorDto updateActor(StagedActor updatedActor, PartialActorDto partialActorDto) {
    if (partialActorDto.readableName() != null) {
      updatedActor.setReadableName(partialActorDto.readableName());
    }
    if (partialActorDto.type() != null) {
      updatedActor.setType(ActorType.from(partialActorDto.type()));
    }
    if (partialActorDto.commonName() != null) {
      updatedActor.setCommonName(partialActorDto.commonName());
    }
    if (partialActorDto.networkId() != null) {
      updatedActor.setNetworkId(partialActorDto.networkId());
    }
    if (partialActorDto.active() != null) {
      updatedActor.setActive(partialActorDto.active());
    }
    if (partialActorDto.manualCertificate() != null) {
      updatedActor.setManualCertificate(partialActorDto.manualCertificate());
    }
    if (partialActorDto.commonName() != null) {
      updatedActor.setCommonName(partialActorDto.commonName());
    }
    if (partialActorDto.certificate() != null) {
      updatedActor.setCertificate(toPersistence(partialActorDto.certificate()));
    }
    validateCommonName(updatedActor.getCertificate(), updatedActor.getCommonName());
    if (partialActorDto.stagingStatus() != null) {
      updatedActor.setStagingStatus(StagingStatus.from(partialActorDto.stagingStatus()));
    }

    updateOrgUnit(partialActorDto, updatedActor);

    return ActorMapperAdminApi.toApi(updatedActor);
  }

  private static void validateCommonName(CertificateDto certificate, String commonName) {
    if (certificate == null) {
      return;
    }
    validateCommonName(certificate.value(), commonName);
  }

  static void validateCommonName(Certificate certificate, String commonName) {
    if (certificate == null) {
      return;
    }
    validateCommonName(certificate.value(), commonName);
  }

  static void validateCommonName(String pem, String commonName) {
    try {
      X509Utils.parseMultiPem(pem).forEach(cert -> validateCommonName(cert, commonName));
    } catch (NoSuchElementException e) {
      throw new ServiceDirectoryBadRequestException("certificate without CN:" + e.getMessage());
    } catch (IllegalArgumentException e) {
      throw new ServiceDirectoryBadRequestException("certificate not parseable: " + e.getMessage());
    }
  }

  private static void validateCommonName(X509Certificate cert, String commonName) {
    String certCommonName = X509Utils.extractSanOrCommonName(cert);
    if (!certCommonName.equals(commonName)) {
      throw new ServiceDirectoryBadRequestException(
          "certificate CN '"
              + certCommonName
              + "' does not match actor commonName '"
              + commonName
              + "'");
    }
  }

  private void updateOrgUnit(PartialActorDto partialActorDto, StagedActor updatedActor) {
    Optional.of(partialActorDto)
        .map(PartialActorDto::orgUnitId)
        .map(serviceDirectoryReadService::getOrgUnit)
        .map(OrgUnit::getId)
        .ifPresent(updatedActor::setOrgUnitId);
  }

  @Transactional
  public void deleteActorById(UUID id) {
    StagedActor actorToBeDeleted = serviceDirectoryReadService.getStagedActor(id);

    // A WORK_IN_PROGRESS stagingStatus makes no sense for a deletion
    actorToBeDeleted.setStagingStatus(StagingStatus.READY_FOR_REVIEW);

    if (actorToBeDeleted.getStagedEntityType() != StagedEntityType.ADD) {
      actorToBeDeleted.setStagedEntityType(StagedEntityType.DEL);
    } else {
      stagedActorRepository.delete(actorToBeDeleted);
    }
  }

  @Transactional
  public ActorDto deactivateActorById(UUID id) {
    return updateEnabledOfActor(id, false);
  }

  @Transactional
  public ActorDto activateActorById(UUID id) {
    return updateEnabledOfActor(id, true);
  }

  private ActorDto updateEnabledOfActor(UUID id, boolean enabled) {
    Optional<AuditedActor> optionalActor = auditedActorRepository.findById(id);
    if (optionalActor.isPresent()) {
      AuditedActor actor = optionalActor.get();
      actor.setActive(enabled);
      return ActorMapperAdminApi.toApi(actor);
    } else {
      throw new ActorNotFoundException(id);
    }
  }

  @Transactional
  public PartialOrgUnitDto createOrgUnit(PartialOrgUnitDto partialOrgUnitDto) {
    StagedOrgUnit orgUnit = OrgUnitMapper.toStaged(partialOrgUnitDto);
    return OrgUnitMapper.toApi(stagedOrgUnitRepository.save(orgUnit));
  }

  @Transactional
  public PartialOrgUnitDto updateOrgUnit(PartialOrgUnitDto partialOrgUnitDto) {
    if (partialOrgUnitDto.id() == null) {
      throw new ServiceDirectoryBadRequestException("Null for orgUnit id not allowed");
    }
    StagedOrgUnit orgUnitData =
        serviceDirectoryReadService.getStagedOrgUnit(partialOrgUnitDto.id());
    if (partialOrgUnitDto.readableName() != null) {
      orgUnitData.setReadableName(partialOrgUnitDto.readableName());
    }
    if (partialOrgUnitDto.type() != null) {
      orgUnitData.setType(OrgUnitType.from(partialOrgUnitDto.type()));
    }
    if (partialOrgUnitDto.active() != null) {
      orgUnitData.setActive(partialOrgUnitDto.active());
    }
    if (partialOrgUnitDto.federalState() != null) {
      orgUnitData.setFederalState(partialOrgUnitDto.federalState());
    }
    if (partialOrgUnitDto.stagingStatus() != null) {
      orgUnitData.setStagingStatus(StagingStatus.from(partialOrgUnitDto.stagingStatus()));
    }
    return OrgUnitMapper.toApi(orgUnitData);
  }

  @Transactional
  public void deleteOrgUnitById(UUID id) {
    StagedOrgUnit orgUnitToBeDeleted = serviceDirectoryReadService.getStagedOrgUnit(id);

    // A WORK_IN_PROGRESS stagingStatus makes no sense for a deletion
    orgUnitToBeDeleted.setStagingStatus(StagingStatus.READY_FOR_REVIEW);

    if (orgUnitToBeDeleted.getStagedEntityType() == StagedEntityType.ADD) {
      stagedOrgUnitRepository.delete(orgUnitToBeDeleted);
    } else {
      orgUnitToBeDeleted.setStagedEntityType(StagedEntityType.DEL);
    }
  }

  @Transactional
  public OrgUnitDto deactivateOrgUnitById(UUID id) {
    return updateEnabledOfOrgUnit(id, false);
  }

  @Transactional
  public OrgUnitDto activateOrgUnitById(UUID id) {
    return updateEnabledOfOrgUnit(id, true);
  }

  private OrgUnitDto updateEnabledOfOrgUnit(UUID id, boolean enabled) {
    Optional<AuditedOrgUnit> optionalOrgUnit = auditedOrgUnitRepository.findById(id);
    if (optionalOrgUnit.isPresent()) {
      AuditedOrgUnit orgUnit = optionalOrgUnit.get();
      orgUnit.setActive(enabled);
      return OrgUnitMapper.toApi(orgUnit);
    } else {
      throw new OrgUnitNotFoundException(id);
    }
  }

  @Transactional
  public ActorMetadataDto getActorMetadataByActorId(UUID actorId) {
    var optionalActor = auditedActorRepository.findById(actorId);
    if (optionalActor.isPresent()) {
      return ActorMapperAdminApi.toApi(optionalActor.get().getActorMetadata());
    } else {
      throw new ActorNotFoundException(actorId);
    }
  }

  @Transactional
  public PartialRuleDto createRule(PartialRuleDto partialRuleDto) {
    StagedRule actor = RuleMapper.toStaged(partialRuleDto);
    return RuleMapper.toApi(stagedRuleRepository.save(actor));
  }

  @Transactional
  public PartialRuleDto updateRule(PartialRuleDto partialRuleDto) {
    if (partialRuleDto.id() == null) {
      throw new ServiceDirectoryBadRequestException("Null for rule id not allowed");
    }
    StagedRule ruleData = serviceDirectoryReadService.getStagedRule(partialRuleDto.id());
    if (partialRuleDto.description() != null) {
      ruleData.setDescription(partialRuleDto.description());
    }
    if (partialRuleDto.client() != null) {
      ruleData.setClient(RuleMapper.toPersistence(partialRuleDto.client()));
    }
    if (partialRuleDto.server() != null) {
      ruleData.setServer(RuleMapper.toPersistence(partialRuleDto.server()));
    }
    if (partialRuleDto.active() != null) {
      ruleData.setActive(partialRuleDto.active());
    }
    if (partialRuleDto.stagingStatus() != null) {
      ruleData.setStagingStatus(StagingStatus.from(partialRuleDto.stagingStatus()));
    }
    return RuleMapper.toApi(ruleData);
  }

  @Transactional
  public void deleteRuleById(UUID id) {
    StagedRule ruleToBeDeleted = serviceDirectoryReadService.getStagedRule(id);

    // A WORK_IN_PROGRESS stagingStatus makes no sense for a deletion
    ruleToBeDeleted.setStagingStatus(StagingStatus.READY_FOR_REVIEW);

    if (ruleToBeDeleted.getStagedEntityType() != StagedEntityType.ADD) {
      ruleToBeDeleted.setStagedEntityType(StagedEntityType.DEL);
    } else {
      stagedRuleRepository.delete(ruleToBeDeleted);
    }
  }

  @Transactional
  public RuleDto deactivateRuleById(UUID id) {
    return updateEnabledOfRule(id, false);
  }

  @Transactional
  public RuleDto activateRuleById(UUID id) {
    return updateEnabledOfRule(id, true);
  }

  private RuleDto updateEnabledOfRule(UUID id, boolean enabled) {
    Optional<AuditedRule> optionalRule = auditedRuleRepository.findById(id);
    if (optionalRule.isPresent()) {
      AuditedRule actor = optionalRule.get();
      actor.setActive(enabled);
      return RuleMapper.toApi(actor);
    } else {
      throw new RuleNotFoundException(id);
    }
  }

  @Transactional
  public void importIntoEmptyDatabase(ImportRequest toBeImported) {
    assertEmptyDatabase();

    // create AuditedOrgUnits
    for (OrgUnitDto importOrgUnit : toBeImported.orgUnits()) {
      AuditedOrgUnit orgUnit = createAuditedOrgUnit(importOrgUnit);
      auditedOrgUnitRepository.save(orgUnit);

      // create AuditedActors and link with OrgUnit
      for (ActorDto importActor : importOrgUnit.actors()) {
        AuditedActor actor = createAuditedActor(importActor);
        actor.setOrgUnit(orgUnit);

        auditedActorRepository.save(actor);
      }
    }

    // create AuditedRules
    for (RuleDto importedRule : toBeImported.rules()) {
      AuditedRule rule = createAuditedRule(importedRule);
      auditedRuleRepository.save(rule);
    }
  }

  private static AuditedActor createAuditedActor(ActorDto importActor) {
    AuditedActor actorData = new AuditedActor();

    actorData.setReadableName(importActor.readableName());
    actorData.setCommonName(importActor.commonName());
    actorData.setType(ActorType.from(importActor.type()));
    actorData.setNetworkId(importActor.networkId());
    actorData.setActive(importActor.active());
    actorData.setManualCertificate(importActor.manualCertificate());
    if (importActor.certificate() != null) {
      validateCommonName(importActor.certificate().value(), importActor.commonName());
      actorData.setCertificate(toPersistence(importActor.certificate()));
    }
    if (importActor.metadata() != null) {
      actorData.setActorMetadata(toPersistence(importActor.metadata()));
    }

    return actorData;
  }

  private static AuditedOrgUnit createAuditedOrgUnit(OrgUnitDto importOrgUnit) {
    AuditedOrgUnit orgUnitData = new AuditedOrgUnit();

    orgUnitData.setReadableName(importOrgUnit.readableName());
    orgUnitData.setType(OrgUnitType.from(importOrgUnit.type()));
    orgUnitData.setActive(importOrgUnit.active());
    orgUnitData.setFederalState(importOrgUnit.federalState());
    return orgUnitData;
  }

  private static AuditedRule createAuditedRule(RuleDto importRule) {
    AuditedRule ruleData = new AuditedRule();

    ruleData.setDescription(importRule.description());
    ruleData.setClient(RuleMapper.toPersistence(importRule.client()));
    ruleData.setServer(RuleMapper.toPersistence(importRule.server()));
    ruleData.setActive(importRule.active());
    return ruleData;
  }

  private void assertEmptyDatabase() {
    ExportResponse currentDatabaseContent = serviceDirectoryReadService.getAllForExport(false);
    if (!currentDatabaseContent.isEmpty()) {
      throw new ServiceDirectoryBadRequestException("Import into non-empty database not allowed");
    }
  }
}
