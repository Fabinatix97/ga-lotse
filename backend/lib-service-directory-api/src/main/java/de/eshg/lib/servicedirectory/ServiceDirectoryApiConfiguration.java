/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.servicedirectory;

import static io.micrometer.common.util.StringUtils.isEmpty;

import de.eshg.lib.common.EshgHttpHeaders;
import de.eshg.lib.servicedirectory.api.ActorResponseDto;
import de.eshg.lib.servicedirectory.api.ActorTypeDto;
import de.eshg.lib.servicedirectory.api.GetActiveActorsResponse;
import de.eshg.lib.servicedirectory.api.GetTrustedActorsResponse;
import de.eshg.lib.servicedirectory.api.OrgUnitTypeDto;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@AutoConfiguration
public class ServiceDirectoryApiConfiguration {

  @Bean
  @ConditionalOnMissingBean
  @ConditionalOnProperty("eshg.servicedirectory.baseUrl")
  ServiceDirectoryApi serviceDirectoryClient(
      RestClient.Builder restClientBuilder,
      @Value("${eshg.servicedirectory.baseUrl}") String serviceDirectoryUrl,
      @Value("${de.eshg.servicedirectory.mock-cert-subject-cn:}") String mockCertSubjectCn) {
    RestClient.Builder restClient = restClientBuilder.baseUrl(serviceDirectoryUrl);
    if (!isEmpty(mockCertSubjectCn)) {
      restClient.defaultHeader(
          EshgHttpHeaders.X_ESHG_CERT_SUBJECT.headerName, "CN=" + mockCertSubjectCn);
    }
    RestClientAdapter restClientAdapter = RestClientAdapter.create(restClient.build());

    HttpServiceProxyFactory httpServiceProxyFactory =
        HttpServiceProxyFactory.builderFor(restClientAdapter).build();

    return httpServiceProxyFactory.createClient(ServiceDirectoryApi.class);
  }

  @Bean
  @ConditionalOnBean(value = {ServiceDirectoryApi.class})
  ActiveActorsSupplier cachingGetActiveActors(ServiceDirectoryApi serviceDirectoryApi) {
    AtomicReference<GetActiveActorsCacheEntry> cache = new AtomicReference<>();

    return (type, orgUnitType, orgUnitId) -> {
      GetActiveActorsCacheEntry cacheEntry = cache.get();
      String ifNoneMatch =
          Optional.ofNullable(cacheEntry).map(GetActiveActorsCacheEntry::eTag).orElse(null);

      ResponseEntity<GetActiveActorsResponse> response =
          serviceDirectoryApi.getActiveActors(ifNoneMatch, type, orgUnitType, orgUnitId);
      return cacheResponse(cache, cacheEntry, response);
    };
  }

  @Bean
  @ConditionalOnBean(value = {ServiceDirectoryApi.class})
  ActiveOrgUnitActorsSupplier cachingGetActiveOrgUnitActors(
      ServiceDirectoryApi serviceDirectoryApi) {
    AtomicReference<GetActiveActorsCacheEntry> cache = new AtomicReference<>();

    return (type) -> {
      GetActiveActorsCacheEntry cacheEntry = cache.get();
      String ifNoneMatch =
          Optional.ofNullable(cacheEntry).map(GetActiveActorsCacheEntry::eTag).orElse(null);

      ResponseEntity<GetActiveActorsResponse> response =
          serviceDirectoryApi.getActiveOrgUnitActors(ifNoneMatch, type);
      return cacheResponse(cache, cacheEntry, response);
    };
  }

  private static List<ActorResponseDto> cacheResponse(
      AtomicReference<GetActiveActorsCacheEntry> cache,
      GetActiveActorsCacheEntry existingCacheEntry,
      ResponseEntity<GetActiveActorsResponse> response) {
    if (response.getStatusCode() == HttpStatus.NOT_MODIFIED) {
      return Objects.requireNonNull(existingCacheEntry, "received HTTP 304 on an empty cache")
          .activeActors();
    } else {
      Assert.isTrue(
          response.getStatusCode().is2xxSuccessful(),
          "Unexpected status code " + response.getStatusCode());
      String eTag = Objects.requireNonNull(response.getHeaders().getETag());
      List<ActorResponseDto> actors = Objects.requireNonNull(response.getBody()).actors();

      GetActiveActorsCacheEntry newCacheEntry = new GetActiveActorsCacheEntry(eTag, actors);
      cache.set(newCacheEntry);
      return actors;
    }
  }

  @Bean
  @ConditionalOnBean(value = {ServiceDirectoryApi.class})
  TrustedActorsSupplier cachingGetTrustedActors(ServiceDirectoryApi serviceDirectoryApi) {
    AtomicReference<GetTrustedActorsCacheEntry> cache = new AtomicReference<>();

    return () -> {
      GetTrustedActorsCacheEntry cacheEntry = cache.get();
      String ifNoneMatch =
          Optional.ofNullable(cacheEntry).map(GetTrustedActorsCacheEntry::eTag).orElse(null);

      ResponseEntity<GetTrustedActorsResponse> response =
          serviceDirectoryApi.getTrustedActors(ifNoneMatch);
      if (response.getStatusCode() == HttpStatus.NOT_MODIFIED) {
        return Objects.requireNonNull(cacheEntry, "received HTTP 304 on an empty cache");
      } else {
        Assert.isTrue(
            response.getStatusCode().is2xxSuccessful(),
            "Unexpected status code " + response.getStatusCode());
        String eTag = Objects.requireNonNull(response.getHeaders().getETag());
        GetTrustedActorsResponse trustedActorsResponse = Objects.requireNonNull(response.getBody());
        Set<ActorResponseDto> inboundActors = trustedActorsResponse.trustedInboundActors();
        Set<ActorResponseDto> outboundActors = trustedActorsResponse.trustedOutboundActors();

        GetTrustedActorsCacheEntry newCacheEntry =
            new GetTrustedActorsCacheEntry(eTag, inboundActors, outboundActors);
        cache.set(newCacheEntry);
        return newCacheEntry;
      }
    };
  }

  public record GetActiveActorsCacheEntry(String eTag, List<ActorResponseDto> activeActors) {}

  public record GetTrustedActorsCacheEntry(
      String eTag,
      Set<ActorResponseDto> allowedInboundActors,
      Set<ActorResponseDto> allowedOutboundActors) {}

  public interface ActiveActorsSupplier {
    default List<ActorResponseDto> get() {
      return get(null, null, null);
    }

    default List<ActorResponseDto> get(ActorTypeDto type) {
      return get(type, null, null);
    }

    default List<ActorResponseDto> get(OrgUnitTypeDto orgUnitType) {
      return get(null, orgUnitType, null);
    }

    default List<ActorResponseDto> get(UUID orgUnitId) {
      return get(null, null, orgUnitId);
    }

    List<ActorResponseDto> get(ActorTypeDto type, OrgUnitTypeDto orgUnitType, UUID orgUnitId);
  }

  public interface ActiveOrgUnitActorsSupplier {
    default List<ActorResponseDto> get() {
      return get(null);
    }

    List<ActorResponseDto> get(ActorTypeDto type);
  }

  public interface TrustedActorsSupplier {
    GetTrustedActorsCacheEntry get();
  }
}
