/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence.repository;

import de.eshg.base.centralfile.persistence.entity.DataOrigin;
import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.centralfile.persistence.entity.Facility_;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface FacilityRepository
    extends JpaRepository<Facility, UUID>, JpaSpecificationExecutor<Facility> {

  default List<Facility> findReferenceFacilityByName(String name) {
    return findByNameEqualsAndDataOriginNotAndReferenceFacilityIsNull(name, DataOrigin.EXTERNAL);
  }

  Optional<Facility> findByExternalId(UUID externalId);

  List<Facility> findByNameEqualsAndDataOriginNotAndReferenceFacilityIsNull(
      String name, DataOrigin excludedDataOrigin);

  @Query(
      "select f.externalId from Facility f join f.referenceFacility ref where ref.id = :referenceId ")
  List<UUID> findAllByReferenceFacilityIdOrderById(Long referenceId);

  default Optional<Facility> findFileStateByExternalId(UUID id) {
    return findByExternalIdEqualsAndReferenceFacilityIsNotNull(id);
  }

  Optional<Facility> findByExternalIdEqualsAndReferenceFacilityIsNotNull(UUID id);

  Optional<Facility> findByExternalIdEqualsAndReferenceFacilityIsNull(UUID id);

  @EntityGraph(attributePaths = {Facility_.MUK_FACILITY_LINK})
  List<Facility> findAllByExternalIdInAndReferenceFacilityIsNotNullOrderById(Collection<UUID> ids);

  List<Facility> findAllByExternalIdInAndReferenceFacilityIsNullOrderById(Collection<UUID> ids);

  @Query("select f.referenceFacility from Facility f where f.externalId = :fileStateIdExternalId")
  Optional<Facility> findReferenceFacilityByFileStateExternalId(UUID fileStateIdExternalId);

  @Query(
      """
    select not exists(
      from Facility f
      where f.referenceFacility.externalId = :externalId
      and   f.deleteAt is null
    )
    """)
  boolean isReferenceFacilityObsolete(UUID externalId);

  @EntityGraph(
      attributePaths = {
        Facility_.EMAIL_ADDRESSES,
        Facility_.CONTACT_ADDRESS,
        Facility_.DIFFERENT_BILLING_ADDRESS,
        Facility_.MUK_FACILITY_LINK
      })
  List<Facility> findAllByExternalIdInAndReferenceFacilityIsNotNullOrderById(List<UUID> ids);

  @Query(
      "select f from Facility f left join fetch f.phoneNumbers where f in :facilities order by f.id")
  List<Facility> findAllInOrderByIdJoinFetchingPhoneNumbers(List<Facility> facilities);

  @Query(
      "select f from Facility f left join fetch f.contactPersons where f in :facilities order by f.id")
  List<Facility> findAllInOrderByIdJoinFetchingContactPersons(List<Facility> facilities);

  default List<Facility>
      findAllFetchingReferenceByExternalIdInAndReferenceFacilityIsNotNullOrderByIdWithJoinFetches(
          List<UUID> ids) {
    List<Facility> facilities = findAllByExternalIdInAndReferenceFacilityIsNotNullOrderById(ids);
    facilities = findAllInOrderByIdJoinFetchingPhoneNumbers(facilities);
    facilities = findAllInOrderByIdJoinFetchingContactPersons(facilities);
    return facilities;
  }

  @Query(
      """
        select f from Facility f
        left join fetch f.contactPersons
        left join fetch f.referenceFacility
        left join fetch f.referenceFacility.contactAddress
        left join fetch f.referenceFacility.differentBillingAddress
        left join fetch f.referenceFacility.mukFacilityLink
        where f in :facilities
        order by f.id
        """)
  List<Facility> findAllByOrderByIdJoinFetchContactPersonsAndReferenceFacilityAttributes(
      List<Facility> facilities);

  default List<Facility> findAllByExternalIdInAndReferenceFacilityIsNotNullOrderByIdWithJoinFetches(
      List<UUID> ids) {
    List<Facility> facilities = findAllByExternalIdInAndReferenceFacilityIsNotNullOrderById(ids);
    facilities = findAllInOrderByIdJoinFetchingPhoneNumbers(facilities);
    facilities =
        findAllByOrderByIdJoinFetchContactPersonsAndReferenceFacilityAttributes(facilities);
    return facilities;
  }

  @Query(
      """
    select fileState.externalId from Facility fileState
    join Facility ref on fileState.referenceFacility.id = ref.id
    where ref.externalId in :refExternalIds
    order by fileState.id
    """)
  List<UUID> findAllFileStateIdsByReferenceFacility(
      @Param("refExternalIds") List<UUID> refExternalIds);

  @Transactional
  @Modifying
  int deleteByDeleteAtBefore(Instant expirationTime);

  @Query(
      """
      select f from Facility f
      join DomesticFacilityAddress a on f.contactAddress = a
      where a.embeddedDomesticAddress.street = :street and upper(a.embeddedDomesticAddress.houseNumber) = upper(:houseNumber) and a.embeddedDomesticAddress.postalCode = :postalCode
      and f.referenceFacility is not null
      order by f.id
      """)
  List<Facility> findFileStatesByAddress(String street, String houseNumber, String postalCode);
}
