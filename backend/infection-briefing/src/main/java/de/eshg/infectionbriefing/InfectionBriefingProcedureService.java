/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.util.PageUtil.toPageSpec;

import de.eshg.infectionbriefing.api.GetProceduresResponse;
import de.eshg.infectionbriefing.api.ProcedureFilterParameters;
import de.eshg.infectionbriefing.api.ProcedurePaginationParameters;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.domain.repository.InfectionBriefingProcedureRepository;
import de.eshg.infectionbriefing.domain.specification.InfectionBriefingProcedureSpecification;
import de.eshg.infectionbriefing.mapper.InfectionBriefingProcedureMapper;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class InfectionBriefingProcedureService {

  private final InfectionBriefingProcedureRepository repository;
  private final InfectionBriefingProcedureMapper procedureMapper;
  private final Clock clock;

  public InfectionBriefingProcedureService(
      InfectionBriefingProcedureRepository repository,
      InfectionBriefingProcedureMapper procedureMapper,
      Clock clock) {
    this.repository = repository;
    this.procedureMapper = procedureMapper;
    this.clock = clock;
  }

  public GetProceduresResponse getProcedures(
      ProcedureFilterParameters filterParameters,
      ProcedurePaginationParameters paginationParameters) {

    Page<InfectionBriefingProcedure> proceduresPage =
        repository.findAll(getSpecification(filterParameters), toPageSpec(paginationParameters));
    return new GetProceduresResponse(
        proceduresPage.stream().map(procedureMapper::enrichAndMapToInterfaceType).toList(),
        proceduresPage.getTotalElements());
  }

  private InfectionBriefingProcedureSpecification getSpecification(
      ProcedureFilterParameters parameters) {
    return new InfectionBriefingProcedureSpecification(
        new ArrayList<>(
            List.of(ProcedureStatus.DRAFT, ProcedureStatus.OPEN, ProcedureStatus.IN_PROGRESS)),
        getStartOfDay(parameters.appointmentDay()));
  }

  private Instant getStartOfDay(LocalDate localDate) {
    if (localDate == null) {
      return null;
    } else {
      return localDate.atStartOfDay(clock.getZone()).toInstant();
    }
  }
}
