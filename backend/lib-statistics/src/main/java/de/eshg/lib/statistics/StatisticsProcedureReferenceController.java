/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.statistics.api.GetProcedureIdsRequest;
import de.eshg.lib.statistics.api.GetProcedureIdsResponse;
import de.eshg.lib.statistics.persistence.ProcedureReferenceForStatistics;
import de.eshg.lib.statistics.persistence.ProcedureReferenceForStatisticsRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "StatisticsProcedureReference")
public class StatisticsProcedureReferenceController implements StatisticsProcedureReferenceApi {
  private final ProcedureReferenceForStatisticsRepository procedureReferenceForStatisticsRepository;

  public StatisticsProcedureReferenceController(
      ProcedureReferenceForStatisticsRepository procedureReferenceForStatisticsRepository) {
    this.procedureReferenceForStatisticsRepository = procedureReferenceForStatisticsRepository;
  }

  @Override
  @Transactional(readOnly = true)
  public GetProcedureIdsResponse getProcedureIds(GetProcedureIdsRequest getProcedureIdsRequest) {
    List<ProcedureReferenceForStatistics> procedureReferences =
        procedureReferenceForStatisticsRepository.findAllByExternalIdIn(
            getProcedureIdsRequest.procedureReferences());
    return new GetProcedureIdsResponse(
        procedureReferences.stream()
            .collect(
                StreamUtil.toLinkedHashMap(
                    ProcedureReferenceForStatistics::getExternalId,
                    ProcedureReferenceForStatistics::getProcedureId)));
  }
}
