/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.base.SortDirection;
import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.stiprotection.api.waitingroom.WaitingRoomProcedurePaginationAndSortParameters;
import de.eshg.stiprotection.api.waitingroom.WaitingRoomSortKey;
import de.eshg.stiprotection.mapper.waitingroom.WaitingRoomMapper;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import de.eshg.stiprotection.persistence.db.waitingroom.WaitingRoom;
import de.eshg.stiprotection.persistence.db.waitingroom.WaitingRoomSpecification;
import jakarta.validation.Valid;
import java.util.Objects;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class WaitingRoomService {

  private final StiProtectionProcedureService stiProtectionProcedureService;
  private final StiProtectionProcedureRepository stiProtectionProcedureRepository;
  private final CitizenAccessCodeUserApi citizenAccessCodeUserApi;

  public WaitingRoomService(
      StiProtectionProcedureService stiProtectionProcedureService,
      StiProtectionProcedureRepository stiProtectionProcedureRepository,
      CitizenAccessCodeUserApi citizenAccessCodeUserApi) {
    this.stiProtectionProcedureService = stiProtectionProcedureService;
    this.stiProtectionProcedureRepository = stiProtectionProcedureRepository;
    this.citizenAccessCodeUserApi = citizenAccessCodeUserApi;
  }

  public Page<StiProtectionProcedure> getWaitingRoomProcedures(
      @Valid WaitingRoomProcedurePaginationAndSortParameters parameters) {
    WaitingRoomSpecification specification =
        new WaitingRoomSpecification(
            parameters.sortKeyOrFallback(WaitingRoomSortKey.ID),
            WaitingRoomMapper.toDatabaseType(
                parameters.sortDirectionOrFallback(SortDirection.DESC)));

    PageRequest pageable =
        PageRequest.of(parameters.pageNumberOrFallback(0), parameters.pageSizeOrFallback(25));
    return stiProtectionProcedureRepository.findAll(specification, pageable);
  }

  public String getAccessCode(StiProtectionProcedure procedure) {
    return citizenAccessCodeUserApi
        .getCitizenAccessCodeUser(procedure.getPerson().getAnonymousUserId())
        .accessCode();
  }

  public WaitingRoom getOrCreateWaitingRoom(UUID procedureId) {
    StiProtectionProcedure procedure =
        stiProtectionProcedureService.findProcedureByExternalId(procedureId);
    return Objects.requireNonNullElseGet(
        procedure.getWaitingRoom(),
        () -> {
          WaitingRoom waitingRoom = new WaitingRoom();
          procedure.setWaitingRoom(waitingRoom);
          return waitingRoom;
        });
  }
}
