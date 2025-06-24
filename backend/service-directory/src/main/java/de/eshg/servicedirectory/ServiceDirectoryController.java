/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory;

import de.eshg.lib.servicedirectory.ServiceDirectoryApi;
import de.eshg.lib.servicedirectory.api.ActorMetadataDto;
import de.eshg.lib.servicedirectory.api.ActorResponseDto;
import de.eshg.lib.servicedirectory.api.ActorTypeDto;
import de.eshg.lib.servicedirectory.api.GetActiveActorsResponse;
import de.eshg.lib.servicedirectory.api.GetTrustedActorsResponse;
import de.eshg.lib.servicedirectory.api.OrgUnitTypeDto;
import de.eshg.lib.servicedirectory.api.PostTopologyRequestDto;
import de.eshg.rest.service.commons.filter.RequestLoggingAutoConfiguration.RequestLoggingPathFilter;
import de.eshg.servicedirectory.ServiceDirectoryService.ActiveActorsWithRevision;
import de.eshg.servicedirectory.actor.persistence.entity.AuditedActor;
import de.eshg.servicedirectory.common.CallingClientHelper;
import de.eshg.servicedirectory.logging.GetTrustedActorsStatistics;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.apache.logging.log4j.util.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.server.ResponseStatusException;

@RestController
@Tag(name = "ServiceDirectory")
public class ServiceDirectoryController implements ServiceDirectoryApi {

  private static final Logger log = LoggerFactory.getLogger(ServiceDirectoryController.class);

  private final ServiceDirectoryService serviceDirectoryService;
  private final GetTrustedActorsStatistics getTrustedActorsStatistics;
  private final String selfCommonName;
  private final String relayServerCommonName;

  public ServiceDirectoryController(
      ServiceDirectoryService serviceDirectoryService,
      GetTrustedActorsStatistics getTrustedActorsStatistics,
      RequestLoggingPathFilter requestLoggingPathFilter,
      @Value("${eshg.sd.self.common-name:}") String selfCommonName,
      @Value("${eshg.sd.relay-server.common-name:}") String relayServerCommonName) {
    this.serviceDirectoryService = serviceDirectoryService;
    this.getTrustedActorsStatistics = getTrustedActorsStatistics;
    this.selfCommonName = selfCommonName;
    this.relayServerCommonName = relayServerCommonName;

    requestLoggingPathFilter.add(GET_TRUSTED_ACTORS_FULL_PATH);
  }

  @Override
  public ResponseEntity<GetActiveActorsResponse> getActiveActors(
      String ifNoneMatch, ActorTypeDto type, OrgUnitTypeDto orgUnitType, UUID orgUnitId) {

    String eTag =
        formatETag(type, orgUnitType, orgUnitId, serviceDirectoryService.getCurrentRevisionId());

    if (checkNotModified(ifNoneMatch, eTag))
      return ResponseEntity.status(HttpStatus.NOT_MODIFIED).header(HttpHeaders.ETAG, eTag).build();

    ActiveActorsWithRevision response =
        serviceDirectoryService.getActiveActors(type, orgUnitType, orgUnitId);
    return ResponseEntity.ok()
        .header(HttpHeaders.ETAG, formatETag(type, orgUnitType, orgUnitId, response.revision()))
        .body(
            new GetActiveActorsResponse(
                response.actors().stream()
                    .sorted(Comparator.comparing(ActorResponseDto::naturalId))
                    .toList()));
  }

  @Override
  public ResponseEntity<GetActiveActorsResponse> getActiveOrgUnitActors(
      String ifNoneMatch, ActorTypeDto type) {
    String userName = CallingClientHelper.getClientCommonName();
    Objects.requireNonNull(userName, "principal must not be null");

    ActorResponseDto actorResponseDto = serviceDirectoryService.getActorByCommonName(userName);
    UUID orgUnitId =
        Objects.requireNonNull(actorResponseDto, "no valid actor with commonName %s found")
            .orgUnitId();

    String eTag = formatETag(type, null, orgUnitId, serviceDirectoryService.getCurrentRevisionId());

    if (checkNotModified(ifNoneMatch, eTag))
      return ResponseEntity.status(HttpStatus.NOT_MODIFIED).header(HttpHeaders.ETAG, eTag).build();

    ActiveActorsWithRevision response =
        serviceDirectoryService.getActiveActors(type, null, orgUnitId);
    return ResponseEntity.ok()
        .header(HttpHeaders.ETAG, formatETag(type, null, orgUnitId, response.revision()))
        .body(
            new GetActiveActorsResponse(
                response.actors().stream()
                    .sorted(Comparator.comparing(ActorResponseDto::naturalId))
                    .toList()));
  }

  @Override
  public ActorResponseDto getSelf() {
    String userName = CallingClientHelper.getClientCommonName();
    Objects.requireNonNull(userName, "principal must not be null");

    ActorResponseDto actorResponseDto = serviceDirectoryService.getActorByCommonName(userName);
    if (actorResponseDto != null) {
      return actorResponseDto;
    } else {
      throw new ResponseStatusException(
          HttpStatus.NOT_FOUND, "no valid actor with commonName %s found".formatted(userName));
    }
  }

  @Transactional(readOnly = true)
  @Override
  public ResponseEntity<GetTrustedActorsResponse> getTrustedActors(String ifNoneMatch) {
    getTrustedActorsStatistics.increment();
    String clientCommonName =
        Optional.ofNullable(CallingClientHelper.getClientCommonName()).orElse("");

    if (Strings.isEmpty(clientCommonName)) {
      log.info("attempt to getTrustedActors without client common-name");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    long currentRevisionId = serviceDirectoryService.getCurrentRevisionId();
    String eTag = formatETagForTrustedActors(clientCommonName, currentRevisionId);

    if (checkNotModified(ifNoneMatch, eTag)) {
      return ResponseEntity.status(HttpStatus.NOT_MODIFIED).header(HttpHeaders.ETAG, eTag).build();
    }
    log.info("Processing getTrustedActors request for client {}", clientCommonName);

    final GetTrustedActorsResponse result;

    if (clientCommonName.equals(selfCommonName) || clientCommonName.equals(relayServerCommonName)) {
      // In case the SD's Spatz is calling the SD we need to return _all_ active actors for inbound
      // traffic. Same for the relay-server as it has to accept connections from every active actor.
      ActiveActorsWithRevision allActiveActors =
          serviceDirectoryService.getActiveActors(null, null, null);
      result =
          new GetTrustedActorsResponse(
              new HashSet<>(allActiveActors.actors()),
              Collections.emptySet() // SD and RS never call other servers
              );
    } else {
      // all others should get just the permitted clients and servers
      AuditedActor clientActor =
          serviceDirectoryService.getAuditedActorByCommonName(clientCommonName);
      result = serviceDirectoryService.getTrustedActorsForActor(clientActor);
    }

    log.info("Processed getTrustedActors: {}", result);
    return ResponseEntity.ok().header(HttpHeaders.ETAG, eTag).body(result);
  }

  @Override
  public void postTopology(PostTopologyRequestDto postTopologyRequestDto) {
    String userName = CallingClientHelper.getClientCommonName();
    Objects.requireNonNull(userName, "principal must not be null");

    serviceDirectoryService.updateTopology(userName, postTopologyRequestDto.actorsRequest());
  }

  @Override
  public String getNaturalIdByCommonName(String commonName) {
    return serviceDirectoryService.getNaturalIdByCommonName(commonName);
  }

  @Override
  public ActorResponseDto updateActorMetadata(ActorMetadataDto actorMetadataDto) {
    String commonName = CallingClientHelper.getClientCommonName();
    return serviceDirectoryService.updateActorMetadata(commonName, actorMetadataDto);
  }

  private boolean checkNotModified(String ifNoneMatch, String eTag) {
    ServletRequestAttributes attributes =
        Objects.requireNonNull(
            (ServletRequestAttributes) RequestContextHolder.getRequestAttributes());
    ServletWebRequest webRequest = new ServletWebRequest(attributes.getRequest());
    Assert.isTrue(
        Objects.equals(webRequest.getHeader(HttpHeaders.IF_NONE_MATCH), ifNoneMatch),
        "Injected and context header differ");
    return webRequest.checkNotModified(eTag);
  }

  private static String formatETag(
      ActorTypeDto type, OrgUnitTypeDto orgUnitType, UUID orgUnitId, long revisionId) {
    return Optional.ofNullable(type).map(Enum::name).orElse("")
        + "."
        + Optional.ofNullable(orgUnitType).map(Enum::name).orElse("")
        + "."
        + Optional.ofNullable(orgUnitId).map(UUID::toString).orElse("")
        + "."
        + revisionId;
  }

  private String formatETagForTrustedActors(String clientCommonName, long revisionId) {
    return Optional.ofNullable(clientCommonName).orElse("") + "." + revisionId;
  }
}
