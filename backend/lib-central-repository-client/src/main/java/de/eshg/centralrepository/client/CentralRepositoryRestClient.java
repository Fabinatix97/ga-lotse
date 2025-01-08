/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.centralrepository.client;

import de.eshg.lib.centralrepository.VersionedEntryApi;
import de.eshg.lib.centralrepository.api.MetadataListResponseDto;
import de.eshg.lib.centralrepository.api.MetadataResponseDto;
import de.eshg.lib.centralrepository.api.VersionFilterType;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

public class CentralRepositoryRestClient {

  private final RestClient restClient;

  CentralRepositoryRestClient(RestClient restClient) {
    this.restClient = restClient;
  }

  public ResponseEntity<MetadataResponseDto> createEntry(
      String moduleName, String objectName, MultiValueMap<String, Object> parts) {
    return restClient
        .method(HttpMethod.POST)
        .uri(VersionedEntryApi.BASE_URL + "/{moduleName}/{objectName}", moduleName, objectName)
        .body(parts)
        .retrieve()
        .toEntity(MetadataResponseDto.class);
  }

  public ResponseEntity<MetadataResponseDto> createNewVersionForEntry(
      String moduleName,
      String objectName,
      long id,
      int basedOnVersion,
      MultiValueMap<String, Object> parts) {
    return restClient
        .method(HttpMethod.POST)
        .uri(
            VersionedEntryApi.BASE_URL + "/{moduleName}/{objectName}/{id}/{basedOnVersion}",
            moduleName,
            objectName,
            id,
            basedOnVersion)
        .body(parts)
        .retrieve()
        .toEntity(MetadataResponseDto.class);
  }

  public ResponseEntity<MetadataResponseDto> getMetadataOfOneVersion(
      String moduleName, String objectName, long id, int version) {
    return restClient
        .method(HttpMethod.GET)
        .uri(
            VersionedEntryApi.BASE_URL + "/{moduleName}/{objectName}/{id}/{version}/metadata",
            moduleName,
            objectName,
            id,
            version)
        .retrieve()
        .toEntity(MetadataResponseDto.class);
  }

  public <T> ResponseEntity<T> getContentOfOneVersion(
      String moduleName, String objectName, long id, int version, Class<T> responseEntity) {

    return restClient
        .method(HttpMethod.GET)
        .uri(
            VersionedEntryApi.BASE_URL + "/{moduleName}/{objectName}/{id}/{version}/content",
            moduleName,
            objectName,
            id,
            version)
        .retrieve()
        .toEntity(responseEntity);
  }

  public ResponseEntity<MetadataListResponseDto> getMetadataOfVersionsWithModuleAndObjectName(
      String moduleName, String objectName, VersionFilterType versions) {
    return restClient
        .method(HttpMethod.GET)
        .uri(
            uriBuilder ->
                uriBuilder
                    .path(VersionedEntryApi.BASE_URL + "/{moduleName}/{objectName}/metadata")
                    .queryParam("versions", versions)
                    .build(moduleName, objectName))
        .retrieve()
        .toEntity(MetadataListResponseDto.class);
  }

  public HttpEntity<Void> setEntryAsDeleted(String moduleName, String objectName, Long id) {
    return restClient
        .method(HttpMethod.DELETE)
        .uri(
            VersionedEntryApi.BASE_URL + "/{moduleName}/{objectName}/{id}",
            moduleName,
            objectName,
            id)
        .retrieve()
        .toBodilessEntity();
  }

  public HttpEntity<Void> setOneVersionOfAnEntryAsDeleted(
      String moduleName, String objectName, Long id, Integer version) {
    return restClient
        .method(HttpMethod.DELETE)
        .uri(
            VersionedEntryApi.BASE_URL + "/{moduleName}/{objectName}/{id}/{version}",
            moduleName,
            objectName,
            id,
            version)
        .retrieve()
        .toBodilessEntity();
  }
}
