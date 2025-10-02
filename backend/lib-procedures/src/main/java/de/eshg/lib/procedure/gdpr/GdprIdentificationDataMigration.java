/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.gdpr;

import de.eshg.base.gdpr.GdprProcedureApi;
import de.eshg.lib.procedure.domain.model.GdprDownloadPackage;
import de.eshg.lib.procedure.domain.model.GdprDownloadPackage_;
import de.eshg.lib.procedure.domain.repository.GdprDownloadPackageRepository;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import java.util.List;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class GdprIdentificationDataMigration {

  private static final Logger log = LoggerFactory.getLogger(GdprIdentificationDataMigration.class);

  private final GdprDownloadPackageRepository downloadPackageRepository;
  private final GdprProcedureApi gdprProcedureClient;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final TransactionHelper transactionHelper;

  public GdprIdentificationDataMigration(
      GdprDownloadPackageRepository downloadPackageRepository,
      GdprProcedureApi gdprProcedureClient,
      ModuleClientAuthenticator moduleClientAuthenticator,
      TransactionHelper transactionHelper) {
    this.downloadPackageRepository = downloadPackageRepository;
    this.gdprProcedureClient = gdprProcedureClient;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.transactionHelper = transactionHelper;
  }

  @Scheduled(initialDelay = 15 * 60 * 1000)
  @SchedulerLock(name = "LibProceduresGdprIdentificationDataMigrationJob", lockAtMostFor = "23h")
  public void execute() {
    LockAssert.assertLocked();
    int totalPackages =
        Math.toIntExact(
            transactionHelper.executeInReadOnlyTransaction(this::countPackagesWithoutHashedData));
    if (totalPackages == 0) {
      log.info("No packages without identification_data_hash found");
      return;
    }
    log.info("Starting identification_data_hash migration for {} packages", totalPackages);

    MigrationResult result;
    try {
      result = transactionHelper.executeInTransaction(() -> migrate(totalPackages));
    } catch (Exception e) {
      log.error("Failed identification_data_hash migration", e);
      return;
    }

    log.info(
        "Finished identification_data_hash migration. Successfully updated: {}, failed to update: {}, already updated: {}",
        result.successfulUpdates,
        result.failedUpdates,
        result.alreadyUpdated);
  }

  private MigrationResult migrate(int totalPackages) {
    List<GdprDownloadPackage> packages =
        downloadPackageRepository.findAllByIdentificationDataHashIsNull();

    int failedUpdates = 0;
    int successfulUpdates = 0;
    for (GdprDownloadPackage pkg : packages) {
      String identificationDataHash =
          moduleClientAuthenticator
              .doWithModuleClientAuthentication(
                  () -> gdprProcedureClient.getIdentificationDataHash(pkg.getExternalId()))
              .identificationDataHash();
      if (identificationDataHash == null) {
        log.error("Failed to get identification_data_hash for download id {}", pkg);
        failedUpdates += 1;
      } else {
        pkg.setIdentificationDataHash(identificationDataHash);
        successfulUpdates += 1;
      }
    }
    return new MigrationResult(
        successfulUpdates, failedUpdates, totalPackages - failedUpdates - successfulUpdates);
  }

  private long countPackagesWithoutHashedData() {
    Specification<GdprDownloadPackage> identificationDataHash =
        (Root<GdprDownloadPackage> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) ->
            root.get(GdprDownloadPackage_.IDENTIFICATION_DATA_HASH).isNull();
    return downloadPackageRepository.count(identificationDataHash);
  }

  record MigrationResult(int successfulUpdates, int failedUpdates, int alreadyUpdated) {}
}
