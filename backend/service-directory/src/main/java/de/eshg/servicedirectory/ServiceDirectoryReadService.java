/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.libservicedirectoryadminapi.api.actor.ActorDto;
import de.eshg.libservicedirectoryadminapi.api.actor.GetApplicableActorsResponse;
import de.eshg.libservicedirectoryadminapi.api.actor.PartialActorDto;
import de.eshg.libservicedirectoryadminapi.api.impex.ExportResponse;
import de.eshg.libservicedirectoryadminapi.api.orgunit.GetOrgUnitsResponse;
import de.eshg.libservicedirectoryadminapi.api.orgunit.PartialOrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.rule.GetActiveApplicableRulesResponse;
import de.eshg.libservicedirectoryadminapi.api.rule.GetRulesResponse;
import de.eshg.libservicedirectoryadminapi.api.rule.PartialRuleDto;
import de.eshg.libservicedirectoryadminapi.api.rule.RuleDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagedEntityDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagedEntityTypeDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagingStatusDto;
import de.eshg.servicedirectory.actor.exception.ActorNotFoundException;
import de.eshg.servicedirectory.actor.mapper.ActorMapperAdminApi;
import de.eshg.servicedirectory.actor.mapper.ActorMapperApi;
import de.eshg.servicedirectory.actor.persistence.entity.Actor;
import de.eshg.servicedirectory.actor.persistence.entity.AuditedActor;
import de.eshg.servicedirectory.actor.persistence.entity.StagedActor;
import de.eshg.servicedirectory.actor.persistence.repository.AuditedActorRepository;
import de.eshg.servicedirectory.actor.persistence.repository.StagedActorRepository;
import de.eshg.servicedirectory.common.AdminNameHolder;
import de.eshg.servicedirectory.common.exception.ConflictingChangesException;
import de.eshg.servicedirectory.common.exception.ServiceDirectoryBadRequestException;
import de.eshg.servicedirectory.orgunit.exception.OrgUnitNotFoundException;
import de.eshg.servicedirectory.orgunit.mapper.OrgUnitMapper;
import de.eshg.servicedirectory.orgunit.persistence.entity.AuditedOrgUnit;
import de.eshg.servicedirectory.orgunit.persistence.entity.OrgUnit;
import de.eshg.servicedirectory.orgunit.persistence.entity.StagedOrgUnit;
import de.eshg.servicedirectory.orgunit.persistence.repository.AuditedOrgUnitRepository;
import de.eshg.servicedirectory.orgunit.persistence.repository.StagedOrgUnitRepository;
import de.eshg.servicedirectory.rule.exception.RuleNotFoundException;
import de.eshg.servicedirectory.rule.mapper.RuleMapper;
import de.eshg.servicedirectory.rule.persistence.entity.ActorSelector;
import de.eshg.servicedirectory.rule.persistence.entity.AuditedRule;
import de.eshg.servicedirectory.rule.persistence.entity.Rule;
import de.eshg.servicedirectory.rule.persistence.entity.StagedRule;
import de.eshg.servicedirectory.rule.persistence.repository.AuditedRuleRepository;
import de.eshg.servicedirectory.rule.persistence.repository.StagedRuleRepository;
import de.eshg.servicedirectory.staging.persistence.entity.StagedEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceDirectoryReadService {

  private final AuditedActorRepository auditedActorRepository;
  private final AuditedOrgUnitRepository auditedOrgUnitRepository;
  private final AuditedRuleRepository auditedRuleRepository;

  private final StagedActorRepository stagedActorRepository;

  private final StagedOrgUnitRepository stagedOrgUnitRepository;

  private final StagedRuleRepository stagedRuleRepository;

  public ServiceDirectoryReadService(
      AuditedActorRepository auditedActorRepository,
      AuditedOrgUnitRepository auditedOrgUnitRepository,
      AuditedRuleRepository auditedRuleRepository,
      StagedActorRepository stagedActorRepository,
      StagedOrgUnitRepository stagedOrgUnitRepository,
      StagedRuleRepository stagedRuleRepository) {
    this.auditedActorRepository = auditedActorRepository;
    this.auditedOrgUnitRepository = auditedOrgUnitRepository;
    this.auditedRuleRepository = auditedRuleRepository;
    this.stagedActorRepository = stagedActorRepository;
    this.stagedOrgUnitRepository = stagedOrgUnitRepository;
    this.stagedRuleRepository = stagedRuleRepository;
  }

  Actor getActor(UUID id) {
    if (id == null) {
      throw new ServiceDirectoryBadRequestException("Null for actor ID not allowed");
    }
    Optional<StagedActor> optionalActor =
        stagedActorRepository.findByIdOrStagingInfo_AuditedEntityId(id, id);
    if (optionalActor.isPresent()) {
      StagedActor actor = optionalActor.get();
      assertCreatedByCurrentUser(actor);
      if (!actor.isPreserved()) {
        throw new ActorNotFoundException(id);
      }
      return actor;
    }
    return getAuditedActorOrThrow(id);
  }

  private AuditedActor getAuditedActorOrThrow(UUID id) {
    return auditedActorRepository.findById(id).orElseThrow(() -> new ActorNotFoundException(id));
  }

  StagedActor getStagedActor(UUID id) {
    return switch (getActor(id)) {
      case StagedActor stagedActor -> stagedActor;
      case AuditedActor auditedActor -> {
        StagedActor stagedActor = ActorMapperApi.toStaged(auditedActor);
        Optional.of(auditedActor)
            .map(AuditedActor::getOrgUnit)
            .map(GloballyUniqueEntityBase::getId)
            .ifPresent(stagedActor::setOrgUnitId);
        yield stagedActorRepository.save(stagedActor);
      }
    };
  }

  @Transactional(readOnly = true)
  public GetOrgUnitsResponse getAllOrgUnits() {
    var orgUnits = auditedOrgUnitRepository.findAll().stream().map(OrgUnitMapper::toApi).toList();
    var stagedOrgUnits =
        stagedOrgUnitRepository.findAll().stream().map(this::mapToStagedApi).toList();
    List<StagedEntityDto<PartialActorDto>> stagedActors =
        stagedActorRepository.findAll().stream().map(ActorMapperAdminApi::toApiStaged).toList();
    return new GetOrgUnitsResponse(orgUnits, stagedOrgUnits, stagedActors);
  }

  @Transactional(readOnly = true)
  public ExportResponse getAllForExport(boolean withCertificates) {
    var orgUnits =
        auditedOrgUnitRepository.findAll().stream()
            .map(auditedOrgUnit -> OrgUnitMapper.toApi(auditedOrgUnit, withCertificates))
            .toList();
    var rules = auditedRuleRepository.findAll().stream().map(RuleMapper::toApi).toList();
    return new ExportResponse(orgUnits, rules);
  }

  OrgUnit getOrgUnit(UUID id) {
    if (id == null) {
      throw new ServiceDirectoryBadRequestException("Null for OrgUnit ID not allowed");
    }
    Optional<StagedOrgUnit> optionalOrgUnit =
        stagedOrgUnitRepository.findByIdOrStagingInfo_AuditedEntityId(id, id);
    if (optionalOrgUnit.isPresent()) {
      StagedOrgUnit orgUnit = optionalOrgUnit.get();
      assertCreatedByCurrentUser(orgUnit);
      if (!orgUnit.isPreserved()) {
        throw new OrgUnitNotFoundException(id);
      }
      return orgUnit;
    }
    return auditedOrgUnitRepository
        .findById(id)
        .orElseThrow(() -> new OrgUnitNotFoundException(id));
  }

  StagedOrgUnit getStagedOrgUnit(UUID id) {
    return switch (getOrgUnit(id)) {
      case StagedOrgUnit stagedOrgUnit -> stagedOrgUnit;
      case AuditedOrgUnit auditedOrgUnit -> {
        StagedOrgUnit orgUnit = OrgUnitMapper.toStaged(auditedOrgUnit);
        yield stagedOrgUnitRepository.save(orgUnit);
      }
    };
  }

  @Transactional(readOnly = true)
  public GetRulesResponse getAllRules() {
    List<RuleDto> rules = auditedRuleRepository.findAll().stream().map(RuleMapper::toApi).toList();
    List<StagedEntityDto<PartialRuleDto>> stagedRules =
        stagedRuleRepository.findAll().stream().map(RuleMapper::toApiStaged).toList();
    return new GetRulesResponse(rules, stagedRules);
  }

  @Transactional(readOnly = true)
  public GetRulesResponse getAllActiveRules() {
    List<RuleDto> rules =
        auditedRuleRepository.findAllByActiveIsTrue().stream().map(RuleMapper::toApi).toList();
    List<StagedEntityDto<PartialRuleDto>> stagedRules =
        stagedRuleRepository.findAllByActiveIsTrue().stream().map(RuleMapper::toApiStaged).toList();
    return new GetRulesResponse(rules, stagedRules);
  }

  @Transactional(readOnly = true)
  public GetActiveApplicableRulesResponse getAllActiveAuditedRulesApplicableToActor(UUID actorId) {
    ActorSelector actorSelector = selectorFromActorId(actorId);

    List<RuleDto> clientRules =
        auditedRuleRepository.findActiveWhereWeAreClient(actorSelector).stream()
            .map(RuleMapper::toApi)
            .toList();
    List<RuleDto> serverRules =
        auditedRuleRepository.findActiveWhereWeAreServer(actorSelector).stream()
            .map(RuleMapper::toApi)
            .toList();
    return new GetActiveApplicableRulesResponse(clientRules, serverRules);
  }

  private ActorSelector selectorFromActorId(UUID actorId) {
    AuditedActor actor = getAuditedActorOrThrow(actorId);
    AuditedOrgUnit orgUnit = actor.getOrgUnit();
    return new ActorSelector(
        orgUnit.getFederalState().name(),
        orgUnit.getType().name(),
        orgUnit.getReadableName(),
        actor.getType().name(),
        actor.getReadableName());
  }

  public GetApplicableActorsResponse getActorsThatAreClientInRule(UUID ruleId) {
    Rule rule = getRule(ruleId);
    List<ActorDto> actors =
        auditedActorRepository.findAllBySelector(rule.getClient()).stream()
            .map(ActorMapperAdminApi::toApi)
            .toList();
    return new GetApplicableActorsResponse(actors);
  }

  public GetApplicableActorsResponse getActorsThatAreServerInRule(UUID ruleId) {
    Rule rule = getRule(ruleId);
    List<ActorDto> actors =
        auditedActorRepository.findAllBySelector(rule.getServer()).stream()
            .map(ActorMapperAdminApi::toApi)
            .toList();
    return new GetApplicableActorsResponse(actors);
  }

  Rule getRule(UUID id) {
    if (id == null) {
      throw new ServiceDirectoryBadRequestException("Null for Rule ID not allowed");
    }
    Optional<StagedRule> optionalRule =
        stagedRuleRepository.findByIdOrStagingInfo_AuditedEntityId(id, id);
    if (optionalRule.isPresent()) {
      StagedRule orgUnit = optionalRule.get();
      assertCreatedByCurrentUser(orgUnit);
      if (!orgUnit.isPreserved()) {
        throw new RuleNotFoundException(id);
      }
      return orgUnit;
    }
    return auditedRuleRepository.findById(id).orElseThrow(() -> new RuleNotFoundException(id));
  }

  StagedRule getStagedRule(UUID id) {
    return switch (getRule(id)) {
      case StagedRule stagedRule -> stagedRule;
      case AuditedRule auditedRule -> {
        StagedRule orgUnit = RuleMapper.toStaged(auditedRule);
        yield stagedRuleRepository.save(orgUnit);
      }
    };
  }

  private StagedEntityDto<PartialOrgUnitDto> mapToStagedApi(StagedOrgUnit orgUnit) {
    if (orgUnit.isDeleted()) {
      return new StagedEntityDto<>(
          orgUnit.getId(),
          null,
          StagedEntityTypeDto.from(orgUnit.getStagedEntityType()),
          orgUnit.getAuditedEntityIdOrNull(),
          orgUnit.getCreatedBy(),
          StagingStatusDto.from(orgUnit.getStagingStatus()));
    }
    return OrgUnitMapper.toStagedApi(orgUnit);
  }

  private void assertCreatedByCurrentUser(StagedEntity<?> entity) {
    if (!AdminNameHolder.getAdminName().equals(entity.getCreatedBy())) {
      throw new ConflictingChangesException(
          "Conflicting staged changes from user "
              + entity.getCreatedBy()
              + " in entity "
              + entity.getId());
    }
  }

  public GetApplicableActorsResponse getClientActorsForActor(UUID actorId) {
    ActorSelector actorSelector = selectorFromActorId(actorId);
    List<AuditedActor> clients = new ArrayList<>();

    for (AuditedRule rule : auditedRuleRepository.findActiveWhereWeAreServer(actorSelector)) {
      clients.addAll(auditedActorRepository.findAllBySelector(rule.getClient()));
    }

    return new GetApplicableActorsResponse(
        clients.stream().map(ActorMapperAdminApi::toApi).toList());
  }

  public GetApplicableActorsResponse getServerActorsForActor(UUID actorId) {
    ActorSelector actorSelector = selectorFromActorId(actorId);
    List<AuditedActor> servers = new ArrayList<>();

    for (AuditedRule rule : auditedRuleRepository.findActiveWhereWeAreClient(actorSelector)) {
      servers.addAll(auditedActorRepository.findAllBySelector(rule.getServer()));
    }

    return new GetApplicableActorsResponse(
        servers.stream().map(ActorMapperAdminApi::toApi).toList());
  }
}
