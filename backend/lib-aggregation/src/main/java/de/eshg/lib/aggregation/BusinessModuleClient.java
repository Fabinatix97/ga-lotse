/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation;

import de.eshg.calendar.lib.EventMetadataApi;
import de.eshg.calendar.lib.api.GetMetadataOfEventsRequest;
import de.eshg.calendar.lib.api.GetMetadataOfEventsResponse;
import de.eshg.lib.aggregation.spring.BusinessModulesConfigurationProperties.BusinessModuleClientProperties;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.contact.api.ContactEventCallbackApi;
import de.eshg.lib.contact.model.ContactsMergedEvent;
import de.eshg.lib.notification.NotificationApi;
import de.eshg.lib.notification.api.GetNotificationsResponse;
import de.eshg.lib.notification.api.MarkNotificationsAsReadRequest;
import de.eshg.lib.procedure.api.*;
import de.eshg.lib.procedure.model.CheckFileStateUsageRequest;
import de.eshg.lib.procedure.model.CheckFileStateUsageResponse;
import de.eshg.lib.procedure.model.GetProcedureMetricsResponse;
import de.eshg.lib.procedure.model.GetRecentProceduresResponse;
import de.eshg.lib.procedure.model.GetTaskMetricsResponse;
import de.eshg.lib.procedure.model.GetTasksFilterOptions;
import de.eshg.lib.procedure.model.GetTasksSortOptions;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import de.eshg.lib.procedure.model.TaskResponse;
import de.eshg.lib.procedure.model.gdpr.*;
import de.eshg.lib.procedure.model.gdpr.AddGdprValidationTaskRequest;
import de.eshg.lib.procedure.model.gdpr.GdprValidationTaskFilterParameters;
import de.eshg.lib.procedure.model.gdpr.GetAllValidationTasksResponse;
import de.eshg.lib.procedure.model.gdpr.GetGdprNotificationBannerResponse;
import de.eshg.lib.procedure.model.gdpr.GetGdprValidationTaskDetailsResponse;
import de.eshg.lib.procedure.model.gdpr.GetGdprValidationTaskResponse;
import de.eshg.lib.statistics.StatisticsApi;
import de.eshg.lib.statistics.api.GetDataSourcesResponse;
import de.eshg.lib.statistics.api.GetDataTableHeaderRequest;
import de.eshg.lib.statistics.api.GetDataTableHeaderResponse;
import de.eshg.lib.statistics.api.GetSpecificDataRequest;
import de.eshg.lib.statistics.api.GetSpecificDataResponse;
import de.eshg.rest.client.AcceptLanguageForwardingInterceptor;
import de.eshg.rest.client.BearerAuthInterceptor;
import de.eshg.rest.client.CorrelationIdForwardingInterceptor;
import de.eshg.rest.client.SimpleModelAttributeArgumentResolver;
import java.net.URI;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

public class BusinessModuleClient
    implements TaskListApi,
        TaskMetricsApi,
        EventMetadataApi,
        NotificationApi,
        StatisticsApi,
        BusinessModuleProcedureApi,
        ProcedureMetricsApi,
        GdprValidationTaskApi {

  private final BusinessModule businessModule;
  private final URI url;
  private final Duration clientTimeout;
  private final TaskListApi taskListApiDelegate;
  private final TaskMetricsApi taskMetricsApiDelegate;
  private final ProcedureApi procedureApiDelegate;
  private final EventMetadataApi eventMetadataApiDelegate;
  private final NotificationApi notificationApiDelegate;
  private final StatisticsApi statisticsApiDelegate;
  private final GdprValidationTaskApi gdprValidationTaskApiDelegate;
  private final ContactEventCallbackApi contactEventCallbackApiDelegate;

  public BusinessModuleClient(
      BusinessModule businessModule,
      URI url,
      Duration clientTimeout,
      RestClient.Builder restClientBuilder,
      ConversionService conversionService) {
    this.businessModule = businessModule;
    this.url = url;
    this.clientTimeout = clientTimeout;

    HttpServiceProxyFactory httpServiceProxyFactory =
        createHttpServiceProxyFactory(restClientBuilder, conversionService, url);

    taskListApiDelegate = httpServiceProxyFactory.createClient(TaskListApi.class);
    taskMetricsApiDelegate = httpServiceProxyFactory.createClient(TaskMetricsApi.class);
    procedureApiDelegate = httpServiceProxyFactory.createClient(ProcedureApi.class);
    eventMetadataApiDelegate = httpServiceProxyFactory.createClient(EventMetadataApi.class);
    notificationApiDelegate = httpServiceProxyFactory.createClient(NotificationApi.class);
    statisticsApiDelegate = httpServiceProxyFactory.createClient(StatisticsApi.class);
    gdprValidationTaskApiDelegate =
        httpServiceProxyFactory.createClient(GdprValidationTaskApi.class);
    contactEventCallbackApiDelegate =
        httpServiceProxyFactory.createClient(ContactEventCallbackApi.class);
  }

  public BusinessModuleClient(
      BusinessModule businessModule,
      BusinessModuleClientProperties clientProperties,
      RestClient.Builder restClientBuilder,
      ConversionService conversionService) {
    this(
        businessModule,
        clientProperties.url(),
        clientProperties.clientTimeout(),
        restClientBuilder,
        conversionService);
  }

  public BusinessModule getBusinessModule() {
    return businessModule;
  }

  public URI getUrl() {
    return url;
  }

  public Duration getClientTimeout() {
    return clientTimeout;
  }

  private static HttpServiceProxyFactory createHttpServiceProxyFactory(
      RestClient.Builder restClientBuilder, ConversionService conversionService, URI url) {
    RestClient restClient =
        restClientBuilder
            .baseUrl(url)
            .requestInterceptor(new BearerAuthInterceptor())
            .requestInterceptor(new CorrelationIdForwardingInterceptor())
            .requestInterceptor(new AcceptLanguageForwardingInterceptor())
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
  public CheckFileStateUsageResponse checkFileStateUsage(CheckFileStateUsageRequest request) {
    return procedureApiDelegate.checkFileStateUsage(request);
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
  public GetDataTableHeaderResponse getDataTableHeader(
      GetDataTableHeaderRequest getDataTableHeaderRequest) {
    return statisticsApiDelegate.getDataTableHeader(getDataTableHeaderRequest);
  }

  @Override
  public GetSpecificDataResponse getSpecificData(GetSpecificDataRequest getSpecificDataRequest) {
    return statisticsApiDelegate.getSpecificData(getSpecificDataRequest);
  }

  @Override
  public void addGdprValidationTask(AddGdprValidationTaskRequest addGdprValidationTaskRequest) {
    gdprValidationTaskApiDelegate.addGdprValidationTask(addGdprValidationTaskRequest);
  }

  @Override
  public void closeGdprValidationTask(UUID gdprProcedureId) {}

  @Override
  public void addDownloadPackage(UUID gdprProcedureId, UUID businessProcedureId) {
    gdprValidationTaskApiDelegate.addDownloadPackage(gdprProcedureId, businessProcedureId);
  }

  @Override
  public GetGdprNotificationBannerResponse getGdprNotificationBanner() {
    return gdprValidationTaskApiDelegate.getGdprNotificationBanner();
  }

  @Override
  public GetGdprValidationTaskResponse getGdprValidationTask(UUID id) {
    return gdprValidationTaskApiDelegate.getGdprValidationTask(id);
  }

  @Override
  public GetGdprDownloadPackagesInfoResponse getGdprDownloadPackagesInfo(UUID procedureId) {
    return new GetGdprDownloadPackagesInfoResponse(List.of());
  }

  @Override
  public ResponseEntity<Resource> getGdprDownloadPackage(UUID downloadId, UUID gdprProcedureId) {
    return ResponseEntity.ok().body(new ByteArrayResource(new byte[] {}));
  }

  @Override
  public GetGdprValidationTaskDetailsResponse getGdprValidationTaskDetails(UUID gdprProcedureId) {
    return gdprValidationTaskApiDelegate.getGdprValidationTaskDetails(gdprProcedureId);
  }

  @Override
  public void deleteBusinessProcedure(UUID gdprProcedureId, UUID businessProcedureId) {}

  @Override
  public GetAllValidationTasksResponse getAllGdprValidationTasks(
      GdprValidationTaskFilterParameters parameters) {
    return gdprValidationTaskApiDelegate.getAllGdprValidationTasks(parameters);
  }

  @Override
  public void deleteGdprValidationTaskAndDownloadPackages(
      UUID gdprProcedureId, DeleteDownloadPackagesRequest request) {
    gdprValidationTaskApiDelegate.deleteGdprValidationTaskAndDownloadPackages(
        gdprProcedureId, request);
  }

  public void broadcastContactsMergedEvent(UUID mergedFromId, UUID mergedIntoId) {
    contactEventCallbackApiDelegate.contactsMerged(
        new ContactsMergedEvent(mergedFromId, mergedIntoId));
  }
}
