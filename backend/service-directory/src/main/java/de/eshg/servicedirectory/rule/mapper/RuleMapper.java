/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.rule.mapper;

import de.eshg.libservicedirectoryadminapi.api.rule.ActorSelectorDto;
import de.eshg.libservicedirectoryadminapi.api.rule.PartialRuleDto;
import de.eshg.libservicedirectoryadminapi.api.rule.RuleDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagedEntityDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagedEntityTypeDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagingStatusDto;
import de.eshg.servicedirectory.common.AdminNameHolder;
import de.eshg.servicedirectory.rule.persistence.entity.ActorSelector;
import de.eshg.servicedirectory.rule.persistence.entity.AuditedRule;
import de.eshg.servicedirectory.rule.persistence.entity.StagedRule;
import de.eshg.servicedirectory.staging.persistence.entity.StagedEntityType;
import de.eshg.servicedirectory.staging.persistence.entity.StagingStatus;

public class RuleMapper {

  private RuleMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static RuleDto toApi(AuditedRule auditedRule) {
    return new RuleDto(
        auditedRule.getId(),
        auditedRule.getDescription(),
        toApi(auditedRule.getClient()),
        toApi(auditedRule.getServer()),
        auditedRule.isActive());
  }

  public static PartialRuleDto toApi(StagedRule rule) {
    return new PartialRuleDto(
        rule.getId(),
        rule.getDescription(),
        toApi(rule.getClient()),
        toApi(rule.getServer()),
        rule.isActive(),
        StagingStatus.convert(rule.getStagingStatus(), StagingStatusDto.class));
  }

  public static StagedRule toStaged(PartialRuleDto rule) {
    StagedRule stagedRule = new StagedRule();
    stagedRule.setStagedEntityType(StagedEntityType.ADD);
    stagedRule.setCreatedBy(AdminNameHolder.getAdminName());
    stagedRule.setDescription(rule.description());
    stagedRule.setClient(toPersistence(rule.client()));
    stagedRule.setServer(toPersistence(rule.server()));
    stagedRule.setActive(rule.active());
    stagedRule.setStagingStatus(StagingStatus.from(rule.stagingStatus()));
    return stagedRule;
  }

  public static StagedRule toStaged(AuditedRule auditedRule) {
    StagedRule rule = new StagedRule();
    rule.setAuditedEntity(auditedRule);
    rule.setStagedEntityType(StagedEntityType.MOD);
    rule.setCreatedBy(AdminNameHolder.getAdminName());
    rule.setDescription(auditedRule.getDescription());
    rule.setClient(auditedRule.getClient());
    rule.setServer(auditedRule.getServer());
    rule.setActive(auditedRule.isActive());

    // will most likely be overwritten but set to WIP just in case
    rule.setStagingStatus(StagingStatus.WORK_IN_PROGRESS);

    return rule;
  }

  public static StagedEntityDto<PartialRuleDto> toApiStaged(StagedRule rule) {
    if (rule == null) return null;
    PartialRuleDto actorResponseDto = rule.isPreserved() ? toApi(rule) : null;
    return new StagedEntityDto<>(
        rule.getId(),
        actorResponseDto,
        StagedEntityTypeDto.from(rule.getStagedEntityType()),
        rule.getAuditedEntityIdOrNull(),
        rule.getCreatedBy(),
        StagingStatusDto.from(rule.getStagingStatus()));
  }

  public static ActorSelectorDto toApi(ActorSelector actorSelector) {
    return new ActorSelectorDto(
        actorSelector.federalState(),
        actorSelector.orgUnitType(),
        actorSelector.orgUnitName(),
        actorSelector.actorType(),
        actorSelector.actorName());
  }

  public static ActorSelector toPersistence(ActorSelectorDto selector) {
    if (selector == null) {
      return new ActorSelector(null, null, null, null, null);
    }
    return new ActorSelector(
        selector.federalState(),
        selector.orgUnitType(),
        selector.orgUnitName(),
        selector.actorType(),
        selector.actorName());
  }

  public static void toAudited(AuditedRule auditedRule, StagedRule rule) {
    auditedRule.setDescription(rule.getDescription());
    auditedRule.setClient(rule.getClient());
    auditedRule.setServer(rule.getServer());
    auditedRule.setActive(rule.isActive());
  }
}
