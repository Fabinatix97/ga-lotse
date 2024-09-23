/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation;

import de.eshg.calendar.lib.EventMetadataApi;
import de.eshg.calendar.lib.api.GetMetadataOfEventsRequest;
import de.eshg.calendar.lib.api.GetMetadataOfEventsResponse;
import de.eshg.lib.aggregation.spring.BusinessModulesConfigurationProperties;
import de.eshg.lib.notification.NotificationApi;
import de.eshg.lib.notification.api.GetNotificationsResponse;
import de.eshg.lib.notification.api.MarkNotificationsAsReadRequest;
import de.eshg.lib.procedure.api.ProcedureApi;
import de.eshg.lib.procedure.api.ProcedureMetricsApi;
import de.eshg.lib.procedure.api.RecentProcedureApi;
import de.eshg.lib.procedure.api.TaskListApi;
import de.eshg.lib.procedure.api.TaskMetricsApi;
import de.eshg.lib.procedure.model.GetProcedureMetricsResponse;
import de.eshg.lib.procedure.model.GetRecentProceduresResponse;
import de.eshg.lib.procedure.model.GetTaskMetricsResponse;
import de.eshg.lib.procedure.model.GetTasksFilterOptions;
import de.eshg.lib.procedure.model.GetTasksSortOptions;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import de.eshg.lib.procedure.model.TaskResponse;
import de.eshg.lib.statistics.StatisticsApi;
import de.eshg.lib.statistics.api.GetDataSourcesResponse;
import de.eshg.lib.statistics.api.GetSpecificDataRequest;
import de.eshg.lib.statistics.api.GetSpecificDataResponse;
import de.eshg.rest.client.AccessTokenForwardingInterceptor;
import de.eshg.rest.client.SimpleModelAttributeArgumentResolver;
import java.time.Duration;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import org.springframework.core.convert.ConversionService;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

public class BusinessModuleClient extends ClientWithLocationAndTimeout
    implements TaskListApi,
        TaskMetricsApi,
        EventMetadataApi,
        NotificationApi,
        StatisticsApi,
        RecentProcedureApi,
        ProcedureMetricsApi {

  private final TaskListApi taskListApiDelegate;
  private final TaskMetricsApi taskMetricsApiDelegate;
  private final ProcedureApi procedureApiDelegate;
  private final EventMetadataApi eventMetadataApiDelegate;
  private final NotificationApi notificationApiDelegate;
  private final StatisticsApi statisticsApiDelegate;

  public BusinessModuleClient(
      String businessModule,
      RestClient.Builder restClientBuilder,
      ConversionService conversionService,
      String url,
      Duration clientTimeout) {
    super(businessModule, url, clientTimeout);

    HttpServiceProxyFactory httpServiceProxyFactory =
        createHttpServiceProxyFactory(restClientBuilder, conversionService, url);

    taskListApiDelegate = httpServiceProxyFactory.createClient(TaskListApi.class);
    taskMetricsApiDelegate = httpServiceProxyFactory.createClient(TaskMetricsApi.class);
    procedureApiDelegate = httpServiceProxyFactory.createClient(ProcedureApi.class);
    eventMetadataApiDelegate = httpServiceProxyFactory.createClient(EventMetadataApi.class);
    notificationApiDelegate = httpServiceProxyFactory.createClient(NotificationApi.class);
    statisticsApiDelegate = httpServiceProxyFactory.createClient(StatisticsApi.class);
  }

  public BusinessModuleClient(
      BusinessModulesConfigurationProperties.BusinessModuleClientProperties clientProperties,
      RestClient.Builder restClientBuilder,
      ConversionService conversionService) {
    this(
        clientProperties.getType(),
        restClientBuilder,
        conversionService,
        clientProperties.getUrl(),
        clientProperties.getClientTimeout());
  }

  private static HttpServiceProxyFactory createHttpServiceProxyFactory(
      RestClient.Builder restClientBuilder, ConversionService conversionService, String url) {
    RestClient restClient =
        restClientBuilder
            .baseUrl(url)
            .requestInterceptor(new AccessTokenForwardingInterceptor())
            .build();

    RestClientAdapter restClientAdapter = RestClientAdapter.create(restClient);

    return HttpServiceProxyFactory.builderFor(restClientAdapter)
        .conversionService(conversionService)
        .customArgumentResolver(new SimpleModelAttributeArgumentResolver(conversionService))
        .build();
  }

  @Override
  public GetRecentProceduresResponse getSelfRecentProcedures(
      Set<ProcedureTypeDto> procedureTypes,
      Set<ProcedureStatusDto> procedureStatus,
      Integer limit) {
    return procedureApiDelegate.getSelfRecentProcedures(procedureTypes, procedureStatus, limit);
  }

  @Override
  public GetRecentProceduresResponse getRecentProcedures(
      UUID userId,
      Set<ProcedureTypeDto> procedureTypes,
      Set<ProcedureStatusDto> procedureStatus,
      Integer limit) {
    return procedureApiDelegate.getRecentProcedures(userId, procedureTypes, procedureStatus, limit);
  }

  @Override
  public TaskResponse getTasksForDashboard() {
    return taskListApiDelegate.getTasksForDashboard();
  }

  @Override
  public TaskResponse getTasks(
      GetTasksFilterOptions filterOptions, GetTasksSortOptions sortOptions, Integer limit) {
    return taskListApiDelegate.getTasks(filterOptions, sortOptions, limit);
  }

  @Override
  public GetProcedureMetricsResponse getProcedureMetrics(
      Instant timeRangeStart, Instant timeRangeEnd) {
    return procedureApiDelegate.getProcedureMetrics(timeRangeStart, timeRangeEnd);
  }

  @Override
  public GetTaskMetricsResponse getTaskMetrics(
      ProcedureTypeDto procedureType, Instant timeRangeStart, Instant timeRangeEnd) {
    return taskMetricsApiDelegate.getTaskMetrics(procedureType, timeRangeStart, timeRangeEnd);
  }

  @Override
  public GetMetadataOfEventsResponse getMetadataForEvents(
      GetMetadataOfEventsRequest getMetadataOfEventsRequest) {
    return eventMetadataApiDelegate.getMetadataForEvents(getMetadataOfEventsRequest);
  }

  @Override
  public GetNotificationsResponse getNotifications() {
    return notificationApiDelegate.getNotifications();
  }

  @Override
  public GetNotificationsResponse getUnreadNotifications() {
    return notificationApiDelegate.getUnreadNotifications();
  }

  @Override
  public void markNotificationsAsRead(
      MarkNotificationsAsReadRequest markNotificationsAsReadRequest) {
    notificationApiDelegate.markNotificationsAsRead(markNotificationsAsReadRequest);
  }

  @Override
  public GetDataSourcesResponse getAvailableDataSources() {
    return statisticsApiDelegate.getAvailableDataSources();
  }

  @Override
  public GetSpecificDataResponse getSpecificData(GetSpecificDataRequest getSpecificDataRequest) {
    return statisticsApiDelegate.getSpecificData(getSpecificDataRequest);
  }
}
