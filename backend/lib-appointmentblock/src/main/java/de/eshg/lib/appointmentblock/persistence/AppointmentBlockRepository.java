/*
 * Copyright 2025 cronn GmbH
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
      "select distinct a from AppointmentBlock a "
          + "left join fetch a.appointments "
          + "left join a.appointmentBlockGroup abg "
          + "left join AppointmentTypeHolder h on h.appointmentBlockGroup.id = abg.id "
          + "where h.type = :appointmentType "
          + "and (:locationId is null or a.appointmentBlockGroup.locationId = :locationId) "
          + "and (:physicianId is null or :physicianId member of a.appointmentBlockGroup.physicians) "
          + "and a.appointmentBlockEnd >= :appointmentBlockEnd order by a.id")
  List<AppointmentBlock> findBlockByAppointmentTypeAndLocationAndAppointmentBlockEndGreaterThan(
      @Param("appointmentType") AppointmentType appointmentType,
      @Param("locationId") UUID locationId,
      @Param("physicianId") UUID physicianId,
      @Param("appointmentBlockEnd") Instant appointmentBlockEnd);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query(
      "select distinct a from AppointmentBlock a "
          + "left join a.appointmentBlockGroup abg "
          + "left join AppointmentTypeHolder h on h.appointmentBlockGroup.id = abg.id "
          + "where h.type = :appointmentType "
          + "and (:locationId is null or a.appointmentBlockGroup.locationId = :locationId) "
          + "and a.appointmentBlockStart <= :appointmentStart and a.appointmentBlockEnd >= :appointmentEnd order by a.id")
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

  List<AppointmentBlock> findAllByCalendarEventIdInOrderById(List<UUID> eventIds);
}
