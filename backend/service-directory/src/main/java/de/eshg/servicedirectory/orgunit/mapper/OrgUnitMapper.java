/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.orgunit.mapper;

import de.eshg.libservicedirectoryadminapi.api.orgunit.OrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.orgunit.OrgUnitTypeDto;
import de.eshg.libservicedirectoryadminapi.api.orgunit.PartialOrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagedEntityDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagedEntityTypeDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagingStatusDto;
import de.eshg.servicedirectory.actor.mapper.ActorMapperAdminApi;
import de.eshg.servicedirectory.common.AdminNameHolder;
import de.eshg.servicedirectory.orgunit.persistence.entity.AuditedOrgUnit;
import de.eshg.servicedirectory.orgunit.persistence.entity.OrgUnitType;
import de.eshg.servicedirectory.orgunit.persistence.entity.StagedOrgUnit;
import de.eshg.servicedirectory.staging.persistence.entity.StagedEntityType;
import de.eshg.servicedirectory.staging.persistence.entity.StagingStatus;

public class OrgUnitMapper {

  private OrgUnitMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static StagedOrgUnit toStaged(AuditedOrgUnit auditedOrgUnit) {
    StagedOrgUnit orgUnit = new StagedOrgUnit();
    orgUnit.setAuditedEntity(auditedOrgUnit);
    orgUnit.setStagedEntityType(StagedEntityType.MOD);
    orgUnit.setCreatedBy(AdminNameHolder.getAdminName());
    orgUnit.setType(auditedOrgUnit.getType());
    orgUnit.setReadableName(auditedOrgUnit.getReadableName());
    orgUnit.setActive(auditedOrgUnit.isActive());
    orgUnit.setFederalState(auditedOrgUnit.getFederalState());

    // will most likely be overwritten but set to WIP just in case
    orgUnit.setStagingStatus(StagingStatus.WORK_IN_PROGRESS);

    return orgUnit;
  }

  public static StagedOrgUnit toStaged(PartialOrgUnitDto partialOrgUnitDto) {
    StagedOrgUnit orgUnit = new StagedOrgUnit();
    orgUnit.setStagedEntityType(StagedEntityType.ADD);
    orgUnit.setCreatedBy(AdminNameHolder.getAdminName());
    orgUnit.setReadableName(partialOrgUnitDto.readableName());
    orgUnit.setType(OrgUnitType.from(partialOrgUnitDto.type()));
    orgUnit.setActive(partialOrgUnitDto.active());
    orgUnit.setFederalState(partialOrgUnitDto.federalState());
    orgUnit.setStagingStatus(StagingStatus.from(partialOrgUnitDto.stagingStatus()));
    return orgUnit;
  }

  public static PartialOrgUnitDto toApi(StagedOrgUnit orgUnit) {
    if (orgUnit == null) return null;
    return new PartialOrgUnitDto(
        orgUnit.getId(),
        orgUnit.getReadableName(),
        orgUnit.isActive(),
        OrgUnitType.convert(orgUnit.getType(), OrgUnitTypeDto.class),
        orgUnit.getFederalState(),
        StagingStatus.convert(orgUnit.getStagingStatus(), StagingStatusDto.class));
  }

  public static StagedEntityDto<PartialOrgUnitDto> toStagedApi(StagedOrgUnit save) {
    return new StagedEntityDto<>(
        save.getId(),
        toApi(save),
        StagedEntityTypeDto.from(save.getStagedEntityType()),
        save.getAuditedEntityIdOrNull(),
        save.getCreatedBy(),
        StagingStatusDto.from(save.getStagingStatus()));
  }

  public static void toAudited(AuditedOrgUnit auditedOrgUnit, StagedOrgUnit orgUnit) {
    auditedOrgUnit.setReadableName(orgUnit.getReadableName());
    auditedOrgUnit.setType(orgUnit.getType());
    auditedOrgUnit.setActive(orgUnit.isActive());
    auditedOrgUnit.setFederalState(orgUnit.getFederalState());
  }

  public static OrgUnitDto toApi(AuditedOrgUnit orgUnit) {
    return toApi(orgUnit, true);
  }

  public static OrgUnitDto toApi(AuditedOrgUnit orgUnit, boolean withCertificates) {
    if (orgUnit == null) return null;
    return new OrgUnitDto(
        orgUnit.getId(),
        orgUnit.getReadableName(),
        orgUnit.isActive(),
        OrgUnitType.convert(orgUnit.getType(), OrgUnitTypeDto.class),
        orgUnit.getFederalState(),
        orgUnit.getActors().stream()
            .map(auditedActor -> ActorMapperAdminApi.toApi(auditedActor, withCertificates))
            .toList());
  }
}
