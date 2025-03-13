/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.anonymization;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.statistics.config.StatisticsFeature;
import de.eshg.statistics.config.StatisticsFeatureToggle;
import java.io.IOException;
import java.util.UUID;
import java.util.function.BiPredicate;
import org.deidentifier.arx.ARXAnonymizer;
import org.deidentifier.arx.ARXResult;
import org.deidentifier.arx.DataHandle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class AnonymizationExecution {
  private static final Logger log = LoggerFactory.getLogger(AnonymizationExecution.class);

  private final StatisticsFeatureToggle featureToggle;
  private final AnonymizationService anonymizationService;

  public AnonymizationExecution(
      StatisticsFeatureToggle featureToggle, AnonymizationService anonymizationService) {
    this.featureToggle = featureToggle;
    this.anonymizationService = anonymizationService;
  }

  public void anonymizeEvaluation(UUID evaluationId) {
    executeAnonymization(evaluationId, false);
  }

  public void anonymizeReport(UUID reportId) {
    executeAnonymization(reportId, true);
  }

  private void executeAnonymization(UUID id, boolean isReport) {
    if (!featureToggle.isNewFeatureEnabled(StatisticsFeature.ANONYMIZATION)) {
      throw new BadRequestException("Data anonymization is required but feature is not enabled");
    } else {
      DataHolderBeforeAnonymization dataHolderBeforeAnonymization =
          anonymizationService.prepareAnonymization(id, isReport, 2);

      if (dataHolderBeforeAnonymization == null) {
        anonymizationService.finishAnonymization(id, isReport, false);
      } else {
        doForAllTableRowPages(dataHolderBeforeAnonymization, anonymizationService::addTableRows);
        try {
          ARXResult result =
              new ARXAnonymizer()
                  .anonymize(
                      dataHolderBeforeAnonymization.data(), dataHolderBeforeAnonymization.config());
          if (result.isResultAvailable()) {
            storeAnonymizedData(result.getOutput(false), id, isReport);
          } else {
            String message = "Error during anonymization: no result available";
            log.error(message);
            throw new BadRequestException(message);
          }
        } catch (IOException e) {
          throw new IllegalStateException(e);
        }
      }
    }
  }

  private void storeAnonymizedData(DataHandle dataHandle, UUID id, boolean isReport) {
    DataHolderAfterAnonymization dataHolderAfterAnonymization =
        new DataHolderAfterAnonymization(
            id, isReport, dataHandle, AnonymizationService.getRowIdToRowIndex(dataHandle));
    anonymizationService.changeTableColumnValueTypes(dataHolderAfterAnonymization);

    doForAllTableRowPages(dataHolderAfterAnonymization, anonymizationService::storeAnonymizedData);

    anonymizationService.finishAnonymization(id, isReport, true);
  }

  private <T> void doForAllTableRowPages(T dataHolder, BiPredicate<T, Integer> biPredicate) {
    int page = 0;
    while (true) {
      boolean pageEmpty = biPredicate.test(dataHolder, page);
      if (pageEmpty) {
        break;
      }
      page++;
    }
  }
}
