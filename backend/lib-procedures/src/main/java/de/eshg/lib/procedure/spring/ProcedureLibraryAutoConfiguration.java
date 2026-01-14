/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.spring;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.module.SimpleModule;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.domain.model.serialization.SerializationService;
import de.eshg.lib.procedure.audit.AuditService;
import de.eshg.lib.procedure.cemetery.CemeteryConfiguration;
import de.eshg.lib.procedure.file.FileController;
import de.eshg.lib.procedure.file.FileDeletionApprovalRequestNotificationService;
import de.eshg.lib.procedure.file.FileDeletionRequestApprovalRequestDecisionHandler;
import de.eshg.lib.procedure.file.FileStorageService;
import de.eshg.lib.procedure.gdpr.DefaultGdprZipEditorProvider;
import de.eshg.lib.procedure.gdpr.GdprValidationTaskController;
import de.eshg.lib.procedure.gdpr.GdprValidationTaskService;
import de.eshg.lib.procedure.helper.UserHelper;
import de.eshg.lib.procedure.housekeeping.archiving.ArchivingConfiguration;
import de.eshg.lib.procedure.housekeeping.inbox.InboxProcedureCleanupJob;
import de.eshg.lib.procedure.inbox.InboxConfiguration;
import de.eshg.lib.procedure.inbox.InboxProcedureController;
import de.eshg.lib.procedure.inbox.InboxProcedureService;
import de.eshg.lib.procedure.mapping.ProcedureApprovalRequestMapper;
import de.eshg.lib.procedure.mapping.ProcedureLibraryEnrichingMapper;
import de.eshg.lib.procedure.model.AbstractFileDto;
import de.eshg.lib.procedure.model.GenericFileReferenceDto;
import de.eshg.lib.procedure.model.ImageDto;
import de.eshg.lib.procedure.model.ImageMetaDataDto;
import de.eshg.lib.procedure.model.ImageMetaDataHistoryDto;
import de.eshg.lib.procedure.model.MailDto;
import de.eshg.lib.procedure.model.MailMetaDataDto;
import de.eshg.lib.procedure.model.MailMetaDataHistoryDto;
import de.eshg.lib.procedure.model.ManualProgressEntryDto;
import de.eshg.lib.procedure.model.MetaDataHistoryDto;
import de.eshg.lib.procedure.model.PdfDto;
import de.eshg.lib.procedure.model.PdfMetaDataDto;
import de.eshg.lib.procedure.model.PdfMetaDataHistoryDto;
import de.eshg.lib.procedure.model.ProcessedInboxProgressEntryDto;
import de.eshg.lib.procedure.model.SystemProgressEntryDto;
import de.eshg.lib.procedure.notifications.ApprovalRequestMailJob;
import de.eshg.lib.procedure.notifications.ApprovalRequestMailService;
import de.eshg.lib.procedure.procedures.DefaultProcedureAsSearchableStringFormatter;
import de.eshg.lib.procedure.procedures.ProcedureController;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.lib.procedure.procedures.ProcedureQuery;
import de.eshg.lib.procedure.procedures.ProcedureSearchService;
import de.eshg.lib.procedure.progressentry.ProgressEntryConfiguration;
import de.eshg.lib.procedure.rate.limit.ProcedureSearchGuard;
import de.eshg.lib.procedure.rate.limit.ProcedureSearchGuardConfig;
import de.eshg.lib.procedure.rate.limit.ProcedureSearchGuardResetAction;
import de.eshg.lib.procedure.tasks.TaskController;
import de.eshg.lib.procedure.tasks.TaskDueAtReminderNotificationService;
import de.eshg.lib.procedure.tasks.TaskService;
import de.eshg.lib.procedure.tasks.TaskTeamOverviewService;
import de.eshg.lib.procedure.util.BusinessDayService;
import org.openapitools.jackson.nullable.JsonNullableModule;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@ConditionalOnProperty(
    name = "de.eshg.lib.procedure.autoconfiguration-enabled",
    havingValue = "true",
    matchIfMissing = true)
@AutoConfigureAfter(JpaRepositoriesAutoConfiguration.class)
@Import({
  ProgressEntryConfiguration.class,
  ProcedureApprovalRequestMapper.class,
  FileController.class,
  FileDeletionRequestApprovalRequestDecisionHandler.class,
  FileDeletionApprovalRequestNotificationService.class,
  InboxConfiguration.class,
  FileStorageService.class,
  ProcedureController.class,
  ProcedureLibraryEnrichingMapper.class,
  TaskController.class,
  TaskService.class,
  TaskTeamOverviewService.class,
  TaskDueAtReminderNotificationService.class,
  BusinessDayService.class,
  AuditService.class,
  UserHelper.class,
  ArchivingConfiguration.class,
  InboxProcedureCleanupJob.class,
  ProcedureSearchService.class,
  ProcedureQuery.class,
  ProcedureDeletionService.class,
  ProcedureSearchGuard.class,
  ProcedureSearchGuardConfig.class,
  ProcedureSearchGuardResetAction.class,
  CemeteryConfiguration.class,
  SerializationService.class,
  DefaultProcedureAsSearchableStringFormatter.class,
  ApprovalRequestMailJob.class,
  ApprovalRequestMailService.class,
  ProcedureLibrarySchedulingConfig.class,
  GdprValidationTaskController.class,
  GdprValidationTaskService.class,
  DefaultGdprZipEditorProvider.class
})
public class ProcedureLibraryAutoConfiguration {
  @Bean
  public Module jsonNullableModule() {
    return new JsonNullableModule();
  }

  @Bean
  public Module procedureLibrarySubtypes() {
    return new SimpleModule()
        .registerSubtypes(
            ManualProgressEntryDto.class,
            SystemProgressEntryDto.class,
            ProcessedInboxProgressEntryDto.class)
        .registerSubtypes(MailMetaDataDto.class, PdfMetaDataDto.class, ImageMetaDataDto.class)
        .registerSubtypes(
            MetaDataHistoryDto.class,
            MailMetaDataHistoryDto.class,
            ImageMetaDataHistoryDto.class,
            PdfMetaDataHistoryDto.class)
        .registerSubtypes(
            GenericFileReferenceDto.class,
            AbstractFileDto.class,
            AbstractFileDto.class,
            ImageDto.class,
            MailDto.class,
            PdfDto.class);
  }

  @Bean
  @ConditionalOnMissingBean
  public InboxProcedureController inboxProcedureController(
      InboxProcedureService inboxProcedureService,
      BaseFeatureTogglesApi baseFeatureTogglesApi,
      UserHelper userHelper) {
    return new InboxProcedureController(inboxProcedureService, baseFeatureTogglesApi, userHelper);
  }
}
