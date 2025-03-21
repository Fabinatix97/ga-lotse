/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.audit;

import de.eshg.lib.common.FederalState;
import de.eshg.libservicedirectoryadminapi.api.actor.ActorMetadataDto;
import de.eshg.libservicedirectoryadminapi.api.actor.ActorTypeDto;
import de.eshg.libservicedirectoryadminapi.api.actor.CertificateDto;
import de.eshg.libservicedirectoryadminapi.api.actor.PartialActorDto;
import de.eshg.libservicedirectoryadminapi.api.audit.RevisionDto;
import de.eshg.libservicedirectoryadminapi.api.orgunit.OrgUnitTypeDto;
import de.eshg.libservicedirectoryadminapi.api.orgunit.PartialOrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.rule.ActorSelectorDto;
import de.eshg.libservicedirectoryadminapi.api.rule.PartialRuleDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.text.MessageFormat;
import java.time.Instant;
import java.util.*;
import java.util.function.BiFunction;
import java.util.stream.Collectors;
import org.apache.commons.lang3.function.TriConsumer;
import org.hibernate.envers.RevisionType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class RevisionAccumulator {

  private static final Logger logger = LoggerFactory.getLogger(RevisionAccumulator.class);

  private final EntityManager entityManager;
  private final Map<Long, RevisionDto> revisions = new HashMap<>();
  private final Instant startInclusive;
  private final Instant endExclusive;
  private final String author;
  private final String additionalWhereClause;

  RevisionAccumulator(
      EntityManager entityManager, Instant startInclusive, Instant endExclusive, String author) {
    this.entityManager = entityManager;
    this.startInclusive = startInclusive;
    this.endExclusive = endExclusive;
    this.author = author;
    additionalWhereClause = author != null ? " AND r.author = :author" : "";
  }

  List<RevisionDto> getRevisions() {
    return revisions.values().stream().sorted(Comparator.comparing(RevisionDto::id)).toList();
  }

  void fetchRevisions() {
    addRevisions(actor);
    addRevisions(orgUnit);
    addRevisions(actorMetadata);
    addRevisions(rule);
  }

  private void addRevisions(SimpleTable table) {
    String revisionColumns = getSelectColumnsForTable(revinfoColumns, "r");
    String selectNewColumns = getSelectColumnsForTable(table.columns, "ne");
    String selectOldColumns = getSelectColumnsForTable(table.columns, "oe");
    String sql =
        """
                        select {1}, ne.revtype, {2}, {3}
                        from revinfo r
                        join {0}_aud ne on ne.rev = r.id
                        left join {0}_aud oe on ne.revtype != 0 and oe.id = ne.id and oe.rev <= r.id - 1 and oe.revend > r.id - 1
                        WHERE r.created_at >= :startInclusive AND r.created_at < :endExclusive{4}
                        order by r.id""";
    sql =
        MessageFormat.format(
            sql,
            table.name,
            revisionColumns,
            selectNewColumns,
            selectOldColumns,
            additionalWhereClause);
    addRevisions(table, sql);
  }

  private void addRevisions(Table table, String sql) {
    logger.debug("query {}, {}, {}, {}", sql, startInclusive, endExclusive, author);
    Query query =
        entityManager
            .createNativeQuery(sql)
            .setParameter("startInclusive", startInclusive)
            .setParameter("endExclusive", endExclusive);
    if (author != null) {
      query.setParameter("author", author);
    }
    List<Object[]> records = castToObjectArrayList(query.getResultList());
    logger.debug("retrieved {} records", records.size());

    mapRevisions(table, records);
  }

  private void mapRevisions(Table table, List<Object[]> records) {
    for (Object[] revisionRecord : records) {
      long revisionId = (Long) revisionRecord[0];
      RevisionDto revision =
          revisions.computeIfAbsent(revisionId, r -> mapRevinfo(r, revisionRecord));

      table.addEntities(revision, revisionRecord);
    }
  }

  private static String getSelectColumnsForTable(List<String> columns, String tableName) {
    return columns.stream().map(c -> tableName + "." + c).collect(Collectors.joining(", "));
  }

  private static final List<String> revinfoColumns =
      List.of("id", "ip", "resource", "created_at", "author", "committer");

  private static RevisionDto mapRevinfo(Long id, Object[] revisionRecord) {
    return new RevisionDto(
        id,
        (String) revisionRecord[1],
        (String) revisionRecord[2],
        (Instant) revisionRecord[3],
        (String) revisionRecord[4],
        (String) revisionRecord[5],
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>());
  }

  public static final String READABLE_NAME = "readable_name";
  public static final String ACTIVE = "active";

  private static final SimpleTable actor =
      new SimpleTable(
          "audited_actor",
          List.of(
              "id",
              READABLE_NAME,
              "type",
              ACTIVE,
              "manual_certificate",
              "common_name",
              "certificate_value",
              "certificate_signature",
              "certificate_signatory",
              "network_id",
              "org_unit_id"),
          (table, revision, revisionRecord) ->
              table.addEntities(
                  revision.actorPairs(), RevisionAccumulator::mapActor, revisionRecord));

  private static PartialActorDto mapActor(Object[] revisionRecord, int offset) {
    return new PartialActorDto(
        (UUID) revisionRecord[offset],
        (String) revisionRecord[offset + 1],
        actorType((String) revisionRecord[offset + 2]),
        Boolean.TRUE.equals(revisionRecord[offset + 3]),
        Boolean.TRUE.equals(revisionRecord[offset + 4]),
        (String) revisionRecord[offset + 5],
        mapCertificate(revisionRecord, offset + 6),
        (String) revisionRecord[offset + 9],
        (UUID) revisionRecord[offset + 10],
        null);
  }

  private static CertificateDto mapCertificate(Object[] revisionRecord, int offset) {
    if (revisionRecord[offset] == null) {
      return null;
    }
    return new CertificateDto(
        (String) revisionRecord[offset],
        (String) revisionRecord[offset + 1],
        (String) revisionRecord[offset + 2]);
  }

  private static final SimpleTable actorMetadata =
      new SimpleTable(
          "actor_metadata",
          List.of("id", "content", "changed_at"),
          (table, revision, revisionRecord) ->
              table.addEntities(
                  revision.metadataPairs(), RevisionAccumulator::mapActorMetadata, revisionRecord));

  private static ActorMetadataDto mapActorMetadata(Object[] revisionRecord, int offset) {
    return new ActorMetadataDto(
        (UUID) revisionRecord[offset],
        (String) revisionRecord[offset + 1],
        (Instant) revisionRecord[offset + 2]);
  }

  private static final SimpleTable orgUnit =
      new SimpleTable(
          "audited_org_unit",
          List.of("id", READABLE_NAME, ACTIVE, "type", "federal_state"),
          (table, revision, revisionRecord) ->
              table.addEntities(
                  revision.orgUnitPairs(), RevisionAccumulator::mapOrgUnit, revisionRecord));

  private static PartialOrgUnitDto mapOrgUnit(Object[] revisionRecord, int offset) {
    return new PartialOrgUnitDto(
        (UUID) revisionRecord[offset],
        (String) revisionRecord[offset + 1],
        Boolean.TRUE.equals(revisionRecord[offset + 2]),
        orgUnitType((String) revisionRecord[offset + 3]),
        FederalState.valueOf((String) revisionRecord[offset + 4]),
        null);
  }

  private static final SimpleTable rule =
      new SimpleTable(
          "audited_rule",
          List.of(
              "id",
              "description",
              "client_federal_state",
              "client_org_unit_type",
              "client_org_unit_name",
              "client_actor_type",
              "client_actor_name",
              "server_federal_state",
              "server_org_unit_type",
              "server_org_unit_name",
              "server_actor_type",
              "server_actor_name",
              ACTIVE),
          (table, revision, revisionRecord) ->
              table.addEntities(
                  revision.rulePairs(), RevisionAccumulator::mapRule, revisionRecord));

  private static PartialRuleDto mapRule(Object[] revisionRecord, int offset) {
    return new PartialRuleDto(
        (UUID) revisionRecord[offset],
        (String) revisionRecord[offset + 1],
        mapActorSelector(revisionRecord, offset + 2),
        mapActorSelector(revisionRecord, offset + 7),
        Boolean.TRUE.equals(revisionRecord[offset + 12]),
        null);
  }

  private static ActorSelectorDto mapActorSelector(Object[] revisionRecord, int offset) {
    return new ActorSelectorDto(
        (String) revisionRecord[offset],
        (String) revisionRecord[offset + 1],
        (String) revisionRecord[offset + 2],
        (String) revisionRecord[offset + 3],
        (String) revisionRecord[offset + 4]);
  }

  private static ActorTypeDto actorType(String s) {
    if (s == null) {
      return null;
    }
    try {
      return ActorTypeDto.valueOf(s);
    } catch (IllegalArgumentException e) {
      logger.warn("Unknown actor type: {}", s, e);
      return null;
    }
  }

  private static OrgUnitTypeDto orgUnitType(String s) {
    if (s == null) {
      return null;
    }
    try {
      return OrgUnitTypeDto.valueOf(s);
    } catch (IllegalArgumentException e) {
      logger.warn("Unknown org unit type: {}", s, e);
      return null;
    }
  }

  @SuppressWarnings({"unchecked"})
  private static List<Object[]> castToObjectArrayList(List<?> in) {
    assert in.stream().allMatch(Object[].class::isInstance);
    return (List<Object[]>) in;
  }

  private interface Table {

    int getColumnSize();

    void addEntities(RevisionDto revision, Object[] revisionRecord);

    default <T> void addEntities(
        List<RevisionDto.Pair<T>> entities,
        BiFunction<Object[], Integer, T> f,
        Object[] revisionRecord) {
      int revCols = revinfoColumns.size();
      if (revisionRecord.length != revCols + 1 + 2 * this.getColumnSize())
        throw new IllegalArgumentException("Invalid record length");
      RevisionType revType = mapRevType(revisionRecord[revCols]);
      int newOffset = revCols + 1;
      int oldOffset = revCols + 1 + this.getColumnSize();
      boolean newEntity = revType != RevisionType.DEL;
      boolean oldEntity = revType != RevisionType.ADD;
      entities.add(
          new RevisionDto.Pair<>(
              oldEntity ? f.apply(revisionRecord, oldOffset) : null,
              newEntity ? f.apply(revisionRecord, newOffset) : null));
    }

    private static RevisionType mapRevType(Object obj) {
      return RevisionType.fromRepresentation(((Short) obj).byteValue());
    }
  }

  private record SimpleTable(
      String name, List<String> columns, TriConsumer<Table, RevisionDto, Object[]> addEntities)
      implements Table {

    @Override
    public int getColumnSize() {
      return columns.size();
    }

    @Override
    public void addEntities(RevisionDto revision, Object[] revisionRecord) {
      addEntities.accept(this, revision, revisionRecord);
    }
  }
}
