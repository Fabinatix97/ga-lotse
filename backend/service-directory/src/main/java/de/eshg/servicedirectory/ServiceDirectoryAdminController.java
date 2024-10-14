/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory;

import static de.eshg.servicedirectory.ServiceDirectoryCommitService.handleMissingEntitiesError;

import de.eshg.libservicedirectoryadminapi.ServiceDirectoryAdminApi;
import de.eshg.libservicedirectoryadminapi.api.actor.ActorDto;
import de.eshg.libservicedirectoryadminapi.api.actor.ActorMetadataDto;
import de.eshg.libservicedirectoryadminapi.api.actor.GetApplicableActorsResponse;
import de.eshg.libservicedirectoryadminapi.api.actor.PartialActorDto;
import de.eshg.libservicedirectoryadminapi.api.audit.GetRevisionsResponse;
import de.eshg.libservicedirectoryadminapi.api.audit.GetUsernamesResponse;
import de.eshg.libservicedirectoryadminapi.api.audit.RevisionDto;
import de.eshg.libservicedirectoryadminapi.api.impex.ExportResponse;
import de.eshg.libservicedirectoryadminapi.api.impex.ImportRequest;
import de.eshg.libservicedirectoryadminapi.api.orgunit.GetOrgUnitsResponse;
import de.eshg.libservicedirectoryadminapi.api.orgunit.OrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.orgunit.PartialOrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.rule.GetActiveApplicableRulesResponse;
import de.eshg.libservicedirectoryadminapi.api.rule.GetRulesResponse;
import de.eshg.libservicedirectoryadminapi.api.rule.PartialRuleDto;
import de.eshg.libservicedirectoryadminapi.api.rule.RuleDto;
import de.eshg.libservicedirectoryadminapi.api.staging.CommitResponseDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.servicedirectory.ServiceDirectoryCommitService.UniqueConstraint;
import de.eshg.servicedirectory.audit.AuditService;
import de.eshg.servicedirectory.common.AdminNameHolder;
import de.eshg.servicedirectory.common.exception.CommitForbiddenException;
import de.eshg.servicedirectory.common.exception.DryRunSucceededException;
import de.eshg.servicedirectory.common.exception.ServiceDirectoryBadRequestException;
import de.eshg.servicedirectory.config.envers.CommitAuthorHolder;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.IntStream;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "ServiceDirectoryAdmin")
public class ServiceDirectoryAdminController implements ServiceDirectoryAdminApi {

  private final ServiceDirectoryAdminService serviceDirectoryAdminService;

  private final ServiceDirectoryCommitService serviceDirectoryCommitService;

  private final ServiceDirectoryReadService serviceDirectoryReadService;

  private final AuditService auditService;

  public ServiceDirectoryAdminController(
      ServiceDirectoryAdminService serviceDirectoryAdminService,
      ServiceDirectoryCommitService serviceDirectoryCommitService,
      ServiceDirectoryReadService serviceDirectoryReadService,
      AuditService auditService) {
    this.serviceDirectoryAdminService = serviceDirectoryAdminService;
    this.serviceDirectoryCommitService = serviceDirectoryCommitService;
    this.serviceDirectoryReadService = serviceDirectoryReadService;
    this.auditService = auditService;
  }

  @Override
  public PartialActorDto createActor(PartialActorDto partialActorDto) {
    return serviceDirectoryAdminService.createActor(partialActorDto);
  }

  @Override
  public PartialActorDto updateActor(PartialActorDto partialActorDto) {
    return serviceDirectoryAdminService.updateActor(partialActorDto);
  }

  @Override
  public void deleteActorById(UUID id) {
    serviceDirectoryAdminService.deleteActorById(id);
  }

  @Override
  public ActorDto deactivateActorById(UUID id) {
    return serviceDirectoryAdminService.deactivateActorById(id);
  }

  @Override
  public ActorDto activateActorById(UUID id) {
    return serviceDirectoryAdminService.activateActorById(id);
  }

  @Override
  public ActorMetadataDto getActorMetadataByActorId(UUID actorId) {
    return serviceDirectoryAdminService.getActorMetadataByActorId(actorId);
  }

  @Override
  public GetOrgUnitsResponse getAllOrgUnits() {
    return serviceDirectoryReadService.getAllOrgUnits();
  }

  @Override
  public PartialOrgUnitDto createOrgUnit(PartialOrgUnitDto partialOrgUnitDto) {
    return serviceDirectoryAdminService.createOrgUnit(partialOrgUnitDto);
  }

  @Override
  public PartialOrgUnitDto updateOrgUnit(PartialOrgUnitDto partialOrgUnitDto) {
    return serviceDirectoryAdminService.updateOrgUnit(partialOrgUnitDto);
  }

  @Override
  public void deleteOrgUnitById(UUID id) {
    serviceDirectoryAdminService.deleteOrgUnitById(id);
  }

  @Override
  public OrgUnitDto deactivateOrgUnitById(UUID id) {
    return serviceDirectoryAdminService.deactivateOrgUnitById(id);
  }

  @Override
  public OrgUnitDto activateOrgUnitById(UUID id) {
    return serviceDirectoryAdminService.activateOrgUnitById(id);
  }

  @Override
  public GetRulesResponse getAllRules() {
    return serviceDirectoryReadService.getAllRules();
  }

  @Override
  public GetRulesResponse getAllActiveRules() {
    return serviceDirectoryReadService.getAllActiveRules();
  }

  @Override
  public GetActiveApplicableRulesResponse getAllActiveAuditedRulesApplicableToActor(UUID actorId) {
    return serviceDirectoryReadService.getAllActiveAuditedRulesApplicableToActor(actorId);
  }

  @Override
  public GetApplicableActorsResponse getActorsThatAreClientInRule(UUID ruleId) {
    return serviceDirectoryReadService.getActorsThatAreClientInRule(ruleId);
  }

  @Override
  public GetApplicableActorsResponse getActorsThatAreServerInRule(UUID ruleId) {
    return serviceDirectoryReadService.getActorsThatAreServerInRule(ruleId);
  }

  @Override
  public GetApplicableActorsResponse getClientActorsForActor(UUID actorId) {
    return serviceDirectoryReadService.getClientActorsForActor(actorId);
  }

  @Override
  public GetApplicableActorsResponse getServerActorsForActor(UUID actorId) {
    return serviceDirectoryReadService.getServerActorsForActor(actorId);
  }

  @Override
  public PartialRuleDto createRule(PartialRuleDto partialRuleDto) {
    try {
      return serviceDirectoryAdminService.createRule(partialRuleDto);
    } catch (DataIntegrityViolationException e) {
      if (e.getMessage()
          .contains(
              "ERROR: null value in column \"staging_status\" of relation \"staged_rule\" violates not-null constraint")) {
        throw new ServiceDirectoryBadRequestException("null for stagingStatus is not allowed");
      }
      throw new ServiceDirectoryBadRequestException("Rule exists already");
    }
  }

  @Override
  public PartialRuleDto updateRule(PartialRuleDto partialRuleDto) {
    return serviceDirectoryAdminService.updateRule(partialRuleDto);
  }

  @Override
  public void deleteRuleById(UUID id) {
    serviceDirectoryAdminService.deleteRuleById(id);
  }

  @Override
  public RuleDto deactivateRuleById(UUID id) {
    return serviceDirectoryAdminService.deactivateRuleById(id);
  }

  @Override
  public RuleDto activateRuleById(UUID id) {
    return serviceDirectoryAdminService.activateRuleById(id);
  }

  @Override
  public CommitResponseDto commitStaged(String user, List<UUID> ids, boolean dryRun) {
    if (user == null) {
      List<String> authors = serviceDirectoryCommitService.getAuthors(ids);
      if (authors.size() > 1) {
        throw new ServiceDirectoryBadRequestException("changes are not from single author");
      } else if (authors.isEmpty()) {
        handleMissingEntitiesError(ids);
      }
      user = authors.getFirst();
    }
    CommitAuthorHolder.setAuthor(Objects.requireNonNull(user));
    try {
      return dryRun ? commitDryRun(user, ids) : commitLiveRun(user, ids);
    } catch (DataIntegrityViolationException dive) {
      Throwable cause = dive.getCause();
      if (cause instanceof ConstraintViolationException cve) {
        throw getBadRequestException(cve, user, ids);
      }
      throw dive;
    } catch (ConstraintViolationException cve) {
      throw getBadRequestException(cve, user, ids);
    } finally {
      CommitAuthorHolder.clearAuthor();
    }
  }

  private CommitResponseDto commitLiveRun(String author, List<UUID> ids) {
    if (author.equals(AdminNameHolder.getAdminName())) {
      throw new CommitForbiddenException("Author and committer cannot both be " + author);
    }
    return serviceDirectoryCommitService.commitStaged(author, ids);
  }

  private CommitResponseDto commitDryRun(String author, List<UUID> ids) {
    try {
      serviceDirectoryCommitService.commitStagedDryRun(author, ids);
      throw new AssertionError("Dry run went live");
    } catch (DryRunSucceededException ex) {
      return ex.getResult();
    }
  }

  private RuntimeException getBadRequestException(
      ConstraintViolationException cve, String author, List<UUID> ids) {
    String dbErrorMessage = cve.getCause().getMessage();
    UniqueConstraint constraint =
        Optional.ofNullable(cve.getConstraintName())
            .map(serviceDirectoryCommitService::getUniqueConstraint)
            .orElseThrow(() -> cve);

    String detail = StringUtils.substringAfter(dbErrorMessage, " Detail: ");
    String value =
        StringUtils.substringBetween(
            detail, "(" + constraint.columnsString() + ")=(", ") already exists");
    if (value == null) {
      throw cve;
    }
    List<String> values;
    if (constraint.columns().size() > 1) {
      values = Arrays.stream(value.split(", ")).toList();
      if (values.size() != constraint.columns().size()) {
        throw cve;
      }
    } else {
      values = List.of(value);
    }
    List<UUID> errorIds =
        serviceDirectoryCommitService.getEntityIds(author, ids, constraint, values);
    List<String> constraints =
        IntStream.range(0, values.size())
            .mapToObj(i -> "(" + constraint.formatColumn(i) + ")=(" + values.get(i) + ")")
            .toList();
    throw new ServiceDirectoryBadRequestException(
        errorIds + " " + constraints + " already exists", cve);
  }

  @Override
  public void deleteStaged(String user, List<UUID> ids) {
    serviceDirectoryCommitService.resetStaged(user, ids);
  }

  @Override
  public ExportResponse getExport(boolean withCertificates) {
    return serviceDirectoryReadService.getAllForExport(withCertificates);
  }

  @Override
  public void postImport(ImportRequest toBeImported) {
    serviceDirectoryAdminService.importIntoEmptyDatabase(toBeImported);
  }

  @Override
  public GetRevisionsResponse getRevisions(
      Instant fromInclusive, Instant toExclusive, String username) {
    if (!toExclusive.isAfter(fromInclusive)) {
      throw new BadRequestException("toExclusive must be after fromInclusive");
    }
    List<RevisionDto> revisions = auditService.getRevisions(fromInclusive, toExclusive, username);
    return new GetRevisionsResponse(revisions);
  }

  @Override
  public GetUsernamesResponse getUsernames() {
    List<String> usernames = auditService.getUsernames();
    return new GetUsernamesResponse(usernames);
  }
}
