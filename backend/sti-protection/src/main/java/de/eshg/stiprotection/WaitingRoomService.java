/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import static de.eshg.stiprotection.StiProtectionProcedureService.unexpectedProcedureStatus;

import de.eshg.base.SortDirection;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.stiprotection.api.waitingroom.GetWaitingRoomProceduresResponse;
import de.eshg.stiprotection.api.waitingroom.WaitingRoomDto;
import de.eshg.stiprotection.api.waitingroom.WaitingRoomProcedurePaginationAndSortParameters;
import de.eshg.stiprotection.api.waitingroom.WaitingRoomSortKey;
import de.eshg.stiprotection.mapper.waitingroom.WaitingRoomMapper;
import de.eshg.stiprotection.mapper.waitingroom.WaitingRoomProcedureMapper;
import de.eshg.stiprotection.mapper.waitingroom.WaitingStatusMapper;
import de.eshg.stiprotection.persistence.anonymoususer.AnonymousUserClient;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import de.eshg.stiprotection.persistence.db.waitingroom.WaitingRoom;
import de.eshg.stiprotection.persistence.db.waitingroom.WaitingRoomSpecification;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class WaitingRoomService {

  private final StiProtectionProcedureService stiProtectionProcedureService;
  private final StiProtectionProcedureRepository stiProtectionProcedureRepository;
  private final AnonymousUserClient anonymousUserClient;

  public WaitingRoomService(
      StiProtectionProcedureService stiProtectionProcedureService,
      StiProtectionProcedureRepository stiProtectionProcedureRepository,
      AnonymousUserClient anonymousUserClient) {
    this.stiProtectionProcedureService = stiProtectionProcedureService;
    this.stiProtectionProcedureRepository = stiProtectionProcedureRepository;
    this.anonymousUserClient = anonymousUserClient;
  }

  public WaitingRoomDto updateWaitingRoomDetails(UUID procedureId, @Valid WaitingRoomDto request) {
    StiProtectionProcedure procedure =
        stiProtectionProcedureService.findProcedureByExternalId(procedureId);

    ProcedureStatus procedureStatus = procedure.getProcedureStatus();
    if (!procedureStatus.isOpen()) {
      throw unexpectedProcedureStatus(procedureId, procedureStatus);
    }

    WaitingRoom waitingRoom = procedure.getWaitingRoom();
    waitingRoom.setInfo(request.info());
    waitingRoom.setStatus(WaitingStatusMapper.toDatabaseType(request.status()));

    StiProtectionProcedure persistedProcedure = stiProtectionProcedureRepository.save(procedure);
    return WaitingRoomMapper.toInterfaceType(persistedProcedure.getWaitingRoom());
  }

  public GetWaitingRoomProceduresResponse getWaitingRoomProcedures(
      @Valid WaitingRoomProcedurePaginationAndSortParameters parameters) {

    WaitingRoomSpecification specification =
        new WaitingRoomSpecification(
            parameters.sortKeyOrFallback(WaitingRoomSortKey.ID),
            WaitingRoomMapper.toDatabaseType(
                parameters.sortDirectionOrFallback(SortDirection.DESC)));

    PageRequest pageable =
        PageRequest.of(parameters.pageNumberOrFallback(0), parameters.pageSizeOrFallback(25));

    Page<StiProtectionProcedure> results =
        stiProtectionProcedureRepository.findAll(specification, pageable);

    return new GetWaitingRoomProceduresResponse(
        results.stream()
            .map(
                procedure ->
                    WaitingRoomProcedureMapper.toInterface(procedure, getAccessCode(procedure)))
            .toList(),
        results.getNumberOfElements());
  }

  private String getAccessCode(StiProtectionProcedure procedure) {
    return anonymousUserClient.getAccessCode(procedure.getPerson().getAnonymousUserId());
  }
}
