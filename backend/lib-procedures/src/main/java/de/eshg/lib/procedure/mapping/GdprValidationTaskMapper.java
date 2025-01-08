/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.mapping;

import de.eshg.base.SortDirection;
import de.eshg.base.util.PaginationUtil;
import de.eshg.lib.procedure.domain.model.GdprValidationTask;
import de.eshg.lib.procedure.domain.model.GdprValidationTaskStatus;
import de.eshg.lib.procedure.domain.model.GdprValidationTaskType;
import de.eshg.lib.procedure.domain.model.GdprValidationTask_;
import de.eshg.lib.procedure.domain.repository.GdprDownloadPackageInfo;
import de.eshg.lib.procedure.gdpr.OpenTaskSummary;
import de.eshg.lib.procedure.model.gdpr.AddGdprValidationTaskRequest;
import de.eshg.lib.procedure.model.gdpr.GdprDownloadPackageInfoDto;
import de.eshg.lib.procedure.model.gdpr.GdprValidationTaskSortKey;
import de.eshg.lib.procedure.model.gdpr.GdprValidationTaskStatusDto;
import de.eshg.lib.procedure.model.gdpr.GdprValidationTaskTypeDto;
import de.eshg.lib.procedure.model.gdpr.GetGdprDownloadPackagesInfoResponse;
import de.eshg.lib.procedure.model.gdpr.GetGdprNotificationBannerResponse;
import de.eshg.mapper.RestMappingUtil;
import java.util.List;
import org.springframework.data.domain.Sort;

public class GdprValidationTaskMapper {

  private GdprValidationTaskMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static GdprValidationTask mapGdprValidationTaskToDm(AddGdprValidationTaskRequest request) {
    GdprValidationTask task = new GdprValidationTask();
    task.setGdprProcedureId(request.gdprProcedureId());
    task.setType(mapToDm(request.type()));
    task.setStatus(GdprValidationTaskStatus.OPEN);
    task.setStartedAt(request.startedAt());
    return task;
  }

  public static GdprValidationTaskType mapToDm(GdprValidationTaskTypeDto type) {
    return switch (type) {
      case null -> null;
      case RIGHT_OF_ACCESS -> GdprValidationTaskType.RIGHT_OF_ACCESS;
      case RIGHT_TO_ERASURE -> GdprValidationTaskType.RIGHT_TO_ERASURE;
    };
  }

  public static GdprValidationTaskTypeDto mapToApi(GdprValidationTaskType type) {
    return switch (type) {
      case null -> null;
      case RIGHT_OF_ACCESS -> GdprValidationTaskTypeDto.RIGHT_OF_ACCESS;
      case RIGHT_TO_ERASURE -> GdprValidationTaskTypeDto.RIGHT_TO_ERASURE;
    };
  }

  public static GdprValidationTaskStatus mapToDm(GdprValidationTaskStatusDto type) {
    return switch (type) {
      case null -> null;
      case OPEN -> GdprValidationTaskStatus.OPEN;
      case CLOSED -> GdprValidationTaskStatus.CLOSED;
    };
  }

  public static GetGdprNotificationBannerResponse mapToValidationBannerResponse(
      OpenTaskSummary summary) {
    return new GetGdprNotificationBannerResponse(summary.count(), summary.earliestDueDate());
  }

  public static GdprValidationTaskStatusDto mapToApi(GdprValidationTaskStatus status) {
    return switch (status) {
      case OPEN -> GdprValidationTaskStatusDto.OPEN;
      case CLOSED -> GdprValidationTaskStatusDto.CLOSED;
    };
  }

  public static GetGdprDownloadPackagesInfoResponse mapToApiResponse(
      List<GdprDownloadPackageInfo> downloadPackagesInfo) {
    return new GetGdprDownloadPackagesInfoResponse(
        GdprValidationTaskMapper.mapToApi(downloadPackagesInfo));
  }

  private static List<GdprDownloadPackageInfoDto> mapToApi(
      List<GdprDownloadPackageInfo> downloadPackages) {
    return downloadPackages.stream()
        .map(p -> new GdprDownloadPackageInfoDto(p.getDownloadId()))
        .toList();
  }

  public static PaginationUtil.PageSpec mapToPageSpec(
      int page, int pageSize, GdprValidationTaskSortKey sortField, SortDirection direction) {
    return new PaginationUtil.PageSpec(page, pageSize, mapToSortOrder(sortField, direction));
  }

  public static Sort.Order mapToSortOrder(
      GdprValidationTaskSortKey sortField, SortDirection direction) {
    return new Sort.Order(RestMappingUtil.mapDirection(direction), mapSortField(sortField));
  }

  public static String mapSortField(GdprValidationTaskSortKey key) {
    return switch (key) {
      case null -> GdprValidationTask_.CREATED_AT;
      case GdprValidationTaskSortKey.CREATED_AT -> GdprValidationTask_.CREATED_AT;
    };
  }
}
