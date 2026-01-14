/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence;

import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppointmentBlockRepository extends JpaRepository<AppointmentBlock, Long> {

  List<AppointmentBlock> findAllByOrderById();

  @Query(
      """
      select a from AppointmentBlock a
      left join fetch a.appointments
      left join fetch a.appointmentBlockGroup abg
      left join fetch abg.appointmentTypeHolders h
      where exists (select 1 from abg.appointmentTypeHolders ath where ath.type = :appointmentType)
      and (:locationId is null or abg.locationId = :locationId)
      and (:physicianId is null or :physicianId member of a.physicians)
      and a.appointmentBlockEnd >= :appointmentBlockEnd order by a.id""")
  List<AppointmentBlock> findBlockByAppointmentTypeAndLocationAndAppointmentBlockEndGreaterThan(
      @Param("appointmentType") AppointmentType appointmentType,
      @Param("locationId") UUID locationId,
      @Param("physicianId") UUID physicianId,
      @Param("appointmentBlockEnd") Instant appointmentBlockEnd);

  @Query(
      """
      select a from AppointmentBlock a
      left join fetch a.appointments
      left join fetch a.appointmentBlockGroup abg
      left join fetch abg.appointmentTypeHolders h
      where exists (select 1 from abg.appointmentTypeHolders ath where ath.type = :appointmentType)
      and (:availableForCitizen is null or abg.availableForCitizen = :availableForCitizen)
      and (:availableForBulkBooking is null or abg.availableForBulkBooking = :availableForBulkBooking)
      and (:locationId is null or abg.locationId = :locationId)
      and (:physicianId is null or :physicianId member of a.physicians)
      and (:mfaId is null or :mfaId member of a.mfas)
      and (:sopassId is null or :sopassId member of a.sopasss)
      and (:room is null or a.room = :room)
      and a.appointmentBlockEnd >= :appointmentBlockEnd order by a.id""")
  List<AppointmentBlock>
      findBlockByAvailabilityAndAppointmentTypeAndLocationAndStaffAndRoomAndAppointmentBlockEndGreaterThan(
          @Param("appointmentType") AppointmentType appointmentType,
          @Param("locationId") UUID locationId,
          @Param("appointmentBlockEnd") Instant appointmentBlockEnd,
          @Param("availableForCitizen") Boolean availableForCitizen,
          @Param("availableForBulkBooking") Boolean availableForBulkBooking,
          @Param("physicianId") UUID physicianId,
          @Param("mfaId") UUID mfaId,
          @Param("sopassId") UUID sopassId,
          @Param("room") String room);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query(
      """
      select a from AppointmentBlock a
      left join a.appointmentBlockGroup abg
      left join AppointmentTypeHolder h on h.appointmentBlockGroup.id = abg.id
      where exists (select 1 from abg.appointmentTypeHolders ath where ath.type = :appointmentType)
      and (:locationId is null or a.appointmentBlockGroup.locationId = :locationId)
      and a.appointmentBlockStart <= :appointmentStart and a.appointmentBlockEnd >= :appointmentEnd order by a.id""")
  List<AppointmentBlock> findBlockByAppointmentTypeAndLocationAndAppointmentInBlockWithLock(
      @Param("appointmentType") AppointmentType appointmentType,
      @Param("locationId") UUID locationId,
      @Param("appointmentStart") Instant appointmentStart,
      @Param("appointmentEnd") Instant appointmentEnd);

  @Query(
      "select a from AppointmentBlock a "
          + "where a.appointmentBlockStart <= :start and a.appointmentBlockEnd >= :end "
          + "or a.appointmentBlockStart >= :start and a.appointmentBlockStart <= :end "
          + "or a.appointmentBlockEnd >= :start and a.appointmentBlockEnd <= :end order by a.id")
  List<AppointmentBlock> findBlocksOverlappingWithTimeRange(
      @Param("start") Instant start, @Param("end") Instant end);

  Optional<AppointmentBlock> findByExternalId(UUID uuid);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("from AppointmentBlock a where a.externalId = :externalId")
  Optional<AppointmentBlock> findByExternalIdForUpdate(UUID externalId);

  List<AppointmentBlock> findAllByCalendarEventIdInOrderById(List<UUID> eventIds);

  @Query(
      """
    select distinct a.room from AppointmentBlock a
       where a.room is not null
        order by a.room
    """)
  List<String> findDistinctRooms();
}
