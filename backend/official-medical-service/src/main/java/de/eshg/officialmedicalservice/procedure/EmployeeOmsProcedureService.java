/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure;

import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureOverviewDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedurePaginationAndSortParameters;
import de.eshg.officialmedicalservice.procedure.api.EmployeePagedOmsProcedures;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureRequest;
import de.eshg.officialmedicalservice.procedure.persistence.entity.CreatedByUserType;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeOmsProcedureService {
  private final OmsProcedureRepository omsProcedureRepository;
  private final OmsProcedureOverviewMapper omsProcedureOverviewMapper;

  public EmployeeOmsProcedureService(
      OmsProcedureRepository omsProcedureRepository,
      OmsProcedureOverviewMapper omsProcedureOverviewMapper) {
    this.omsProcedureRepository = omsProcedureRepository;
    this.omsProcedureOverviewMapper = omsProcedureOverviewMapper;
  }

  @Transactional
  public UUID createEmployeeProcedure(PostEmployeeOmsProcedureRequest request) {
    OmsProcedure procedure =
        omsProcedureOverviewMapper.toDomainType(
            request, CurrentUserHelper.getCurrentUserId(), CreatedByUserType.EMPLOYEE);

    omsProcedureRepository.save(procedure);

    return procedure.getExternalId();
  }

  @Transactional(readOnly = true)
  public EmployeePagedOmsProcedures getEmployeeProceduresOverview(
      EmployeeOmsProcedurePaginationAndSortParameters paginationAndSortParameters) {

    Page<OmsProcedure> omsProcedures =
        omsProcedureRepository.findAll(
            new EmployeeOmsProcedureSpecification(paginationAndSortParameters),
            EmployeeOmsProcedureSpecification.toPageSpec(paginationAndSortParameters));

    List<EmployeeOmsProcedureOverviewDto> omsProcedureOverviewDtos =
        omsProcedures.getContent().stream()
            .map(omsProcedureOverviewMapper::toInterfaceType)
            .toList();

    return new EmployeePagedOmsProcedures(
        omsProcedureOverviewDtos, omsProcedures.getTotalElements());
  }
}
