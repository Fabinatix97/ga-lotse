/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory;

import static de.eshg.servicedirectory.ServiceDirectoryAdminService.validateCommonName;
import static de.eshg.servicedirectory.common.Utils.assertSqlIdentifier;
import static de.eshg.servicedirectory.common.Utils.snakeToCamelCase;
import static de.eshg.servicedirectory.common.Utils.snakeToKebabCase;
import static java.util.stream.Collectors.toMap;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.libservicedirectoryadminapi.api.staging.CommitResponseDto;
import de.eshg.servicedirectory.actor.mapper.ActorMapperAdminApi;
import de.eshg.servicedirectory.actor.mapper.ActorMapperApi;
import de.eshg.servicedirectory.actor.persistence.entity.AuditedActor;
import de.eshg.servicedirectory.actor.persistence.entity.StagedActor;
import de.eshg.servicedirectory.actor.persistence.repository.AuditedActorRepository;
import de.eshg.servicedirectory.actor.persistence.repository.StagedActorRepository;
import de.eshg.servicedirectory.common.exception.ChangesNotFoundException;
import de.eshg.servicedirectory.common.exception.DryRunSucceededException;
import de.eshg.servicedirectory.common.exception.ServiceDirectoryBadRequestException;
import de.eshg.servicedirectory.orgunit.exception.OrgUnitNotFoundException;
import de.eshg.servicedirectory.orgunit.mapper.OrgUnitMapper;
import de.eshg.servicedirectory.orgunit.persistence.entity.AuditedOrgUnit;
import de.eshg.servicedirectory.orgunit.persistence.entity.StagedOrgUnit;
import de.eshg.servicedirectory.orgunit.persistence.repository.AuditedOrgUnitRepository;
import de.eshg.servicedirectory.orgunit.persistence.repository.StagedOrgUnitRepository;
import de.eshg.servicedirectory.rule.mapper.RuleMapper;
import de.eshg.servicedirectory.rule.persistence.entity.AuditedRule;
import de.eshg.servicedirectory.rule.persistence.entity.StagedRule;
import de.eshg.servicedirectory.rule.persistence.repository.AuditedRuleRepository;
import de.eshg.servicedirectory.rule.persistence.repository.StagedRuleRepository;
import de.eshg.servicedirectory.staging.persistence.entity.StagedEntity;
import de.eshg.servicedirectory.staging.persistence.entity.StagingStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

@Service
public class ServiceDirectoryCommitService {

  private static final Logger logger = LoggerFactory.getLogger(ServiceDirectoryCommitService.class);

  private final AuditedActorRepository auditedActorRepository;

  private final AuditedOrgUnitRepository auditedOrgUnitRepository;

  private final AuditedRuleRepository auditedRuleRepository;

  private final StagedActorRepository stagedActorRepository;

  private final StagedOrgUnitRepository stagedOrgUnitRepository;

  private final StagedRuleRepository stagedRuleRepository;

  @PersistenceContext private EntityManager entityManager;

  public ServiceDirectoryCommitService(
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

  private AuditedOrgUnit getAuditedOrgUnit(UUID id) {
    if (id == null) {
      throw new ServiceDirectoryBadRequestException("(org-unit.id)=(null) not allowed");
    }
    Optional<StagedOrgUnit> optionalOrgUnit =
        stagedOrgUnitRepository.findByIdOrStagingInfo_AuditedEntityId(id, id);
    if (optionalOrgUnit.isPresent()) {
      StagedOrgUnit orgUnit = optionalOrgUnit.get();
      AuditedOrgUnit auditedEntity = orgUnit.getAuditedEntity();
      if (auditedEntity == null) {
        throw new ServiceDirectoryBadRequestException("OrgUnit (" + id + ") not committed");
      }
      return auditedEntity;
    }
    return auditedOrgUnitRepository
        .findById(id)
        .orElseThrow(() -> new OrgUnitNotFoundException(id));
  }

  @Transactional(readOnly = true)
  public List<String> getAuthors(List<UUID> ids) {
    List<String> usernames;
    Query query =
        entityManager.createNativeQuery(
            """
                SELECT DISTINCT created_by FROM staged_actor WHERE id IN (:ids)
                UNION
                SELECT DISTINCT created_by FROM staged_org_unit WHERE id IN (:ids)
                UNION
                SELECT DISTINCT created_by FROM staged_rule WHERE id IN (:ids)""",
            String.class);
    query.setParameter("ids", ids);
    usernames = castToStringList(query.getResultList());

    return usernames;
  }

  @Transactional
  public void commitStagedDryRun(String author, List<UUID> ids) {
    CommitResponseDto result = commitStaged(author, ids, true);
    entityManager.flush();
    throw new DryRunSucceededException(result);
  }

  @Transactional
  public CommitResponseDto commitStaged(String author, List<UUID> ids) {
    return commitStaged(author, ids, false);
  }

  private CommitResponseDto commitStaged(String author, List<UUID> ids, boolean isDryRun) {
    List<StagedActor> actors =
        ids == null
            ? stagedActorRepository.findAllByStagingInfo_CreatedBy(author)
            : stagedActorRepository.findAllByStagingInfo_CreatedByAndIdIn(author, ids);
    List<StagedOrgUnit> orgUnits =
        ids == null
            ? stagedOrgUnitRepository.findAllByStagingInfo_CreatedBy(author)
            : stagedOrgUnitRepository.findAllByStagingInfo_CreatedByAndIdIn(author, ids);
    List<StagedRule> rules =
        ids == null
            ? stagedRuleRepository.findAllByStagingInfo_CreatedBy(author)
            : stagedRuleRepository.findAllByStagingInfo_CreatedByAndIdIn(author, ids);

    assertNoMissingIds(ids, actors, orgUnits, rules);

    assertChangesExist(actors, orgUnits, rules);
    if (!isDryRun) {
      // we don't check this on a dry run, as a WIP is expected there
      assertNoChangesAreWIP(actors, orgUnits, rules);
    }

    orgUnits.forEach(this::commit);
    actors.forEach(this::commit);
    rules.forEach(this::commit);

    CommitResponseDto result =
        new CommitResponseDto(
            actors.stream()
                .filter(StagedEntity::isPreserved)
                .collect(
                    toMap(
                        GloballyUniqueEntityBase::getId,
                        e -> ActorMapperAdminApi.toApi(e.getAuditedEntity()))),
            getDeletedIds(actors),
            orgUnits.stream()
                .filter(StagedEntity::isPreserved)
                .collect(
                    toMap(
                        GloballyUniqueEntityBase::getId,
                        e -> OrgUnitMapper.toApi(e.getAuditedEntity()))),
            getDeletedIds(orgUnits),
            rules.stream()
                .filter(StagedEntity::isPreserved)
                .collect(
                    toMap(
                        GloballyUniqueEntityBase::getId,
                        e -> RuleMapper.toApi(e.getAuditedEntity()))),
            getDeletedIds(rules));

    deleteAll(actors);
    deleteAll(orgUnits);
    deleteAll(rules);

    updateOrgUnitIds(orgUnits);

    return result;
  }

  private static <T extends StagedEntity<? extends GloballyUniqueEntityBase>>
      List<UUID> getDeletedIds(List<T> serviceTypes) {
    return serviceTypes.stream()
        .filter(StagedEntity::isDeleted)
        .map(StagedEntity::getAuditedEntity)
        .map(GloballyUniqueEntityBase::getId)
        .toList();
  }

  // TODO ISSUE-1921: we risk overwriting certificates set by postTopology here
  private void commit(StagedActor actor) {
    switch (actor.getStagedEntityType()) {
      case ADD -> commit(createNewAuditedActor(actor), actor);
      case MOD -> commit(actor.getAuditedEntity(), actor);
      case DEL -> auditedActorRepository.delete(actor.getAuditedEntity());
    }
  }

  private void commit(AuditedActor auditedActor, StagedActor actor) {
    ActorMapperApi.toAudited(auditedActor, actor);

    Optional.ofNullable(actor.getOrgUnitId())
        .map(this::getAuditedOrgUnit)
        .ifPresent(auditedActor::setOrgUnit);

    if (auditedActor.getOrgUnit() != null) {
      auditedActor.getOrgUnit().getActors().add(auditedActor);
    }

    actor.setAuditedEntity(auditedActor);

    if (isEmpty(auditedActor.getReadableName())) {
      throw new ServiceDirectoryBadRequestException(
          "(" + actor.getId() + ") (actor.readableName)=(null or empty) not allowed");
    }
    if (auditedActor.getType() == null) {
      throw new ServiceDirectoryBadRequestException(
          "(" + actor.getId() + ") (actor.type)=(null) not allowed");
    }
    if (isEmpty(auditedActor.getCommonName())) {
      throw new ServiceDirectoryBadRequestException(
          "(" + actor.getId() + ") (actor.commonName)=(null or empty) not allowed");
    }
    validateCommonName(auditedActor.getCurrentCertificate(), auditedActor.getCommonName());
    validateCommonName(auditedActor.getPreviousCertificate(), auditedActor.getCommonName());
    if (auditedActor.isActive() == null) {
      throw new ServiceDirectoryBadRequestException(
          "(" + actor.getId() + ") (actor.active)=(null) not allowed");
    }
    if (auditedActor.isManualCertificate() == null) {
      throw new ServiceDirectoryBadRequestException(
          "(" + actor.getId() + ") (actor.manualCertificate)=(null) not allowed");
    }

    auditedActorRepository.save(auditedActor);
  }

  public AuditedActor createNewAuditedActor(StagedActor actor) {
    Assert.isNull(
        actor.getAuditedEntity(), "(" + actor.getId() + ") Cannot add new entity with existing ID");
    return new AuditedActor();
  }

  private void commit(StagedOrgUnit orgUnit) {
    switch (orgUnit.getStagedEntityType()) {
      case ADD -> commit(createNewAuditedOrgUnit(orgUnit), orgUnit);
      case MOD -> commit(orgUnit.getAuditedEntity(), orgUnit);
      case DEL -> auditedOrgUnitRepository.delete(orgUnit.getAuditedEntity());
    }
  }

  private void commit(AuditedOrgUnit auditedOrgUnit, StagedOrgUnit orgUnit) {
    OrgUnitMapper.toAudited(auditedOrgUnit, orgUnit);
    orgUnit.setAuditedEntity(auditedOrgUnit);

    if (isEmpty(auditedOrgUnit.getReadableName())) {
      throw new ServiceDirectoryBadRequestException(
          "(" + orgUnit.getId() + ") (org-unit.readableName)=(null or empty) not allowed");
    }
    if (auditedOrgUnit.getType() == null) {

      throw new ServiceDirectoryBadRequestException(
          "(" + orgUnit.getId() + ") (org-unit.type)=(null) not allowed");
    }
    if (auditedOrgUnit.isActive() == null) {
      throw new ServiceDirectoryBadRequestException(
          "(" + orgUnit.getId() + ") (org-unit.active)=(null) not allowed");
    }
    if (auditedOrgUnit.getFederalState() == null) {
      throw new ServiceDirectoryBadRequestException("Null federalState not allowed");
    }

    auditedOrgUnitRepository.save(auditedOrgUnit);
  }

  private AuditedOrgUnit createNewAuditedOrgUnit(StagedOrgUnit orgUnit) {
    Assert.isNull(
        orgUnit.getAuditedEntity(),
        "(" + orgUnit.getId() + ") Cannot add new entity with existing ID");
    return new AuditedOrgUnit();
  }

  private void commit(StagedRule rule) {
    switch (rule.getStagedEntityType()) {
      case ADD -> commit(createNewAuditedRule(rule), rule);
      case MOD -> commit(rule.getAuditedEntity(), rule);
      case DEL -> auditedRuleRepository.delete(rule.getAuditedEntity());
    }
  }

  private void commit(AuditedRule auditedRule, StagedRule rule) {
    RuleMapper.toAudited(auditedRule, rule);
    rule.setAuditedEntity(auditedRule);

    if (auditedRule.isActive() == null) {
      throw new ServiceDirectoryBadRequestException(
          "(" + rule.getId() + ") (org-unit.active)=(null) not allowed");
    }

    auditedRuleRepository.save(auditedRule);
  }

  private AuditedRule createNewAuditedRule(StagedRule rule) {
    Assert.isNull(
        rule.getAuditedEntity(), "(" + rule.getId() + ") Cannot add new entity with existing ID");
    return new AuditedRule();
  }

  private void assertChangesExist(List<?>... entities) {
    if (Arrays.stream(entities).mapToInt(List::size).sum() == 0) {
      throw new ChangesNotFoundException("No changes to commit");
    }
  }

  private static void assertNoMissingIds(
      List<UUID> ids,
      List<StagedActor> actors,
      List<StagedOrgUnit> orgUnits,
      List<StagedRule> rules) {
    if (ids != null) {
      List<UUID> missingIds =
          ids.stream()
              .filter(
                  id ->
                      actors.stream().noneMatch(e -> e.getId().equals(id))
                          && orgUnits.stream().noneMatch(e -> e.getId().equals(id))
                          && rules.stream().noneMatch(e -> e.getId().equals(id)))
              .toList();
      if (!missingIds.isEmpty()) {
        handleMissingEntitiesError(missingIds);
      }
    }
  }

  public static void handleMissingEntitiesError(List<UUID> missingIds) {
    String missingIdString =
        missingIds.stream().map(id -> "(" + id + ")").collect(Collectors.joining(", "));
    throw new ServiceDirectoryBadRequestException("Entities " + missingIdString + " not found");
  }

  private void assertNoChangesAreWIP(
      List<StagedActor> actors, List<StagedOrgUnit> orgUnits, List<StagedRule> rules) {
    List<UUID> wipIds =
        Stream.of(actors, orgUnits, rules)
            .flatMap(
                l ->
                    l.stream()
                        .filter(e -> StagingStatus.WORK_IN_PROGRESS.equals(e.getStagingStatus())))
            .map(StagedEntity::getId)
            .toList();

    if (!wipIds.isEmpty()) {
      throw new ServiceDirectoryBadRequestException(
          "The stagingStatus of some changes is still WORK_IN_PROGRESS: " + wipIds);
    }
  }

  @Transactional
  public void resetStaged(String author, List<UUID> ids) {
    if (author == null && ids == null) {
      throw new ServiceDirectoryBadRequestException("Either author or ids must be provided");
    }
    List<StagedActor> actors =
        ids == null
            ? stagedActorRepository.findAllByStagingInfo_CreatedBy(author)
            : author == null
                ? stagedActorRepository.findAllByIdIn(ids)
                : stagedActorRepository.findAllByStagingInfo_CreatedByAndIdIn(author, ids);
    List<StagedOrgUnit> orgUnits =
        ids == null
            ? stagedOrgUnitRepository.findAllByStagingInfo_CreatedBy(author)
            : author == null
                ? stagedOrgUnitRepository.findAllByIdIn(ids)
                : stagedOrgUnitRepository.findAllByStagingInfo_CreatedByAndIdIn(author, ids);
    List<StagedRule> rules =
        ids == null
            ? stagedRuleRepository.findAllByStagingInfo_CreatedBy(author)
            : author == null
                ? stagedRuleRepository.findAllByIdIn(ids)
                : stagedRuleRepository.findAllByStagingInfo_CreatedByAndIdIn(author, ids);

    assertChangesExist(actors, orgUnits, rules);

    deleteAll(actors);
    deleteAll(orgUnits);
    deleteAll(rules);
  }

  @Transactional(readOnly = true)
  public UniqueConstraint getUniqueConstraint(String constraintName) {
    List<Object[]> constraintInfos =
        castToObjectArrayList(
            entityManager
                .createNativeQuery(
                    """
                        SELECT
                            kcu.table_name,
                            kcu.column_name
                        FROM
                            information_schema.table_constraints AS tc
                                JOIN information_schema.key_column_usage AS kcu
                                     ON tc.constraint_name = kcu.constraint_name
                                         AND tc.table_schema = kcu.table_schema
                        WHERE
                            tc.constraint_name = :name AND tc.constraint_type = 'UNIQUE'""")
                .setParameter("name", constraintName)
                .getResultList());

    if (constraintInfos.isEmpty()) {
      logger.error("Unique constraint {} not found", constraintName);
      return null;
    }

    return UniqueConstraint.of(constraintName, constraintInfos);
  }

  @Transactional(readOnly = true)
  public List<UUID> getEntityIds(
      String author, List<UUID> ids, UniqueConstraint constraint, List<String> values) {
    Assert.isTrue(constraint.columns.size() == values.size(), "constraint columns size mismatch");
    StringBuilder whereClause = new StringBuilder("WHERE ");
    IntStream.range(0, constraint.columns.size())
        .forEach(
            i -> {
              if (i != 0) {
                whereClause.append(" AND ");
              }
              whereClause
                  .append("e.")
                  .append(assertSqlIdentifier(constraint.columns.get(i)))
                  .append("::text = :value")
                  .append(i);
            });
    String sql =
        "SELECT id FROM " + assertSqlIdentifier(constraint.stagedTable()) + " AS e " + whereClause;
    if (author != null) {
      sql += " AND e.created_by = :author";
    }
    if (ids != null) {
      sql += " AND e.id IN :ids";
    }
    Query query = entityManager.createNativeQuery(sql);
    IntStream.range(0, values.size()).forEach(i -> query.setParameter("value" + i, values.get(i)));
    if (author != null) {
      query.setParameter("author", author);
    }
    if (ids != null) {
      query.setParameter("ids", ids);
    }
    try {
      return castToUuidList(query.getResultList());
    } catch (NoResultException ignored) {
      return List.of();
    }
  }

  private <T> void deleteAll(List<T> entities) {
    entities.stream().filter(entityManager::contains).forEach(entityManager::remove);
  }

  private void updateOrgUnitIds(List<StagedOrgUnit> orgUnits) {
    Map<UUID, StagedOrgUnit> orgUnitsByStagedId =
        orgUnits.stream().collect(toMap(GloballyUniqueEntityBase::getId, x -> x));
    List<StagedActor> actors =
        stagedActorRepository.findAllByOrgUnitIdIn(orgUnitsByStagedId.keySet());
    actors.forEach(
        actor ->
            actor.setOrgUnitId(
                orgUnitsByStagedId.get(actor.getOrgUnitId()).getAuditedEntityIdOrNull()));
  }

  @SuppressWarnings({"unchecked"})
  private static List<String> castToStringList(List<?> in) {
    assert in.stream().allMatch(String.class::isInstance);
    return (List<String>) in;
  }

  @SuppressWarnings({"unchecked"})
  private static List<UUID> castToUuidList(List<?> in) {
    assert in.stream().allMatch(UUID.class::isInstance);
    return (List<UUID>) in;
  }

  @SuppressWarnings({"unchecked"})
  private static List<Object[]> castToObjectArrayList(List<?> in) {
    assert in.stream().allMatch(Object[].class::isInstance);
    return (List<Object[]>) in;
  }

  public record UniqueConstraint(String name, String table, List<String> columns) {

    public static UniqueConstraint of(String name, List<Object[]> constraintInfos) {
      String table = (String) constraintInfos.getFirst()[0];
      Assert.isTrue(
          constraintInfos.stream().allMatch(c -> table.equals(c[0])),
          "Constraint across multiple tables not supported");
      List<String> columns = constraintInfos.stream().map(x -> (String) x[1]).toList();
      return new UniqueConstraint(name, table, columns);
    }

    private String stagedTable() {
      return table.replaceFirst("^audited_", "staged_");
    }

    private String formatTable() {
      return snakeToKebabCase(StringUtils.removeStart(table, "audited_"));
    }

    public String formatColumn(int i) {
      return formatTable() + "." + formatColumn(columns.get(i));
    }

    public String columnsString() {
      return String.join(", ", columns);
    }

    public static String formatColumn(String column) {
      return snakeToCamelCase(column);
    }
  }
}
