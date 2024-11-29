/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence.repository;

import de.eshg.base.centralfile.persistence.entity.Person;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Stream;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface PersonRepository
    extends JpaRepository<Person, UUID>, JpaSpecificationExecutor<Person> {

  @Query(
      """
      select p from Person p
      where  p.referencePerson is null
      and    p.firstName = :firstName
      and    p.lastName = :lastName
      and    p.birthDetails.dateOfBirth = :dateOfBirth
      and    p.dataOrigin <> de.eshg.base.centralfile.persistence.entity.DataOrigin.EXTERNAL
      order by p.id
      """)
  Stream<Person> findReferencePersonByKeyAttributes(
      @Param("firstName") String firstName,
      @Param("lastName") String lastName,
      @Param("dateOfBirth") LocalDate dateOfBirth);

  @Query(
      """
      select p from Person p
      where  p.referencePerson is null
      and    p.firstName = :firstName
      and    p.lastName = :lastName
      and    p.birthDetails.dateOfBirth = :dateOfBirth
      order by p.id asc
      limit 1""")
  Optional<Person> findFirstByFirstNameAndLastNameAndDateOfBirth(
      @Param("firstName") String firstName,
      @Param("lastName") String lastName,
      @Param("dateOfBirth") LocalDate dateOfBirth);

  /*
   * We perform a similarity search using 2 steps in this query:
   *
   * 1. Filter using the similarity operator (%), which has a configured minimum threshold.
   *    This threshold is configured by pg_trgm.similarity_threshold
   *
   * 2. Next we filter that resulting list again using the parameterized thresholds.
   *    This is necessary because the operator can only use the smaller of 2 thresholds and we have 2 fields to match with different thresholds.
   *    This second condition ensures that the other field only matches for the respective larger threshold.
   */
  @Query(
      nativeQuery = true,
      value =
          """
        select * from person p
        where p.reference_person_id is null
        and   (:includeDeleted = true or p.delete_at is null)
        and   p.data_origin <> 'EXTERNAL'::DataOrigin
        and   p.date_of_birth = :dateOfBirth
        and   normalize_text(p.first_name) % normalize_text(:firstName)
        and   normalize_text(p.last_name) % normalize_text(:lastName)
        and   similarity(normalize_text(p.first_name), normalize_text(:firstName)) >= :firstNameThreshold
        and   similarity(normalize_text(p.last_name), normalize_text(:lastName)) >= :lastNameThreshold
        order by similarity(normalize_text(p.last_name), normalize_text(:lastName))
               + similarity(normalize_text(p.first_name), normalize_text(:firstName)) desc
      """)
  List<Person> fuzzySearchReferencePersons(
      @Param("firstName") String firstName,
      @Param("lastName") String lastName,
      @Param("dateOfBirth") LocalDate dateOfBirth,
      @Param("firstNameThreshold") double firstNameThreshold,
      @Param("lastNameThreshold") double lastNameThreshold,
      @Param("includeDeleted") boolean includeDeleted);

  Optional<Person> findByExternalId(UUID externalId);

  @Query(
      "select p.externalId from Person p join p.referencePerson ref where ref.id = :referenceId ")
  List<UUID> findAllByReferencePersonIdOrderById(Long referenceId);

  default Optional<Person> findFileStateByExternalId(UUID id) {
    return findByExternalIdEqualsAndReferencePersonIsNotNull(id);
  }

  Optional<Person> findByExternalIdEqualsAndReferencePersonIsNotNull(UUID id);

  Optional<Person> findByExternalIdEqualsAndReferencePersonIsNull(UUID id);

  List<Person> findAllByExternalIdInAndReferencePersonIsNotNullOrderById(List<UUID> ids);

  @Query("select p.referencePerson from Person p where p.externalId = :fileStateId")
  Optional<Person> findReferencePersonByFileStateId(UUID fileStateId);

  List<Person> findAllByExternalIdInAndReferencePersonIsNotNullOrderById(Set<UUID> ids);

  @Query(
      """
    select not exists(
      from Person p
      where p.referencePerson.externalId = :externalId
      and   p.deleteAt is null
    )
    """)
  boolean isReferencePersonObsolete(UUID externalId);

  @Query(
      """
    select fileState.externalId from Person fileState
    join Person ref on fileState.referencePerson.id = ref.id
    where ref.externalId = :refExternalId
    and fileState.createdAt <= :createdAt
    order by fileState.id
    """)
  List<UUID> findAllFileStateIdsByReferencePersonCreatedBefore(
      @Param("refExternalId") UUID refExternalId, @Param("createdAt") Instant createdAt);

  @Query(
      """
    select p from Person p
    left join fetch p.contactAddress
    left join fetch p.differentBillingAddress
    where p.externalId in :ids
    and p.referencePerson is not null
    """)
  List<Person> findAllFetchingReferenceByExternalIdInAndReferencePersonIsNotNull(
      List<UUID> ids, Pageable pageable);

  @Query(
      """
  select p from Person p
  left join fetch p.contactAddress
  left join fetch p.differentBillingAddress
  left join fetch p.referencePerson
  left join fetch p.referencePerson.contactAddress
  left join fetch p.referencePerson.differentBillingAddress
  where p.externalId in :ids
  and p.referencePerson is not null
  order by p.id
  """)
  List<Person> findAllByExternalIdInAndReferencePersonIsNotNull(Set<UUID> ids, Pageable pageable);

  @Query(
      """
    select p from Person p
    left join fetch p.contactAddress
    left join fetch p.differentBillingAddress
    left join fetch p.referencePerson
    left join fetch p.referencePerson.contactAddress
    left join fetch p.referencePerson.differentBillingAddress
    where p.externalId in :ids
    and p.referencePerson is not null
    order by p.id
    """)
  Stream<Person> findAllByExternalIdInAndReferencePersonIsNotNull(Set<UUID> ids);

  @Transactional
  @Modifying
  int deleteByDeleteAtBefore(Instant expirationTime);
}
