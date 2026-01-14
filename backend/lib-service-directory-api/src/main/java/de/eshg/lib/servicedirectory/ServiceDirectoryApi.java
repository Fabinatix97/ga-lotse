/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.servicedirectory;

import de.eshg.lib.servicedirectory.api.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

@HttpExchange(ServiceDirectoryApi.API_PREFIX)
public interface ServiceDirectoryApi {
  String API_PREFIX = "/api"; // in contrast to /adminapi

  String ACTORS_PREFIX = "/actors";

  String GET_TRUSTED_ACTORS_PATH = ACTORS_PREFIX + "/trustedActors/self";
  String GET_TRUSTED_ACTORS_FULL_PATH =
      ServiceDirectoryApi.API_PREFIX + ServiceDirectoryApi.GET_TRUSTED_ACTORS_PATH;

  /**
   * Retrieves the active actors from the service directory.
   *
   * @param ifNoneMatch The value of the "If-None-Match" request header, which represents the
   *     previously received ETag value. (optional) This value is used to check if the data has been
   *     modified since the last request.
   * @param type Filter for the given actor type. (optional)
   * @return ResponseEntity object containing the list of active actors in the body and the ETag
   *     value in the response headers. If the data has not been modified, returns {@link
   *     org.springframework.http.HttpStatus#NOT_MODIFIED}.
   *     <p>Note: It is HIGHLY recommended to use the {@link
   *     ServiceDirectoryApiConfiguration#cachingGetActiveActors} bean for accessing active actors,
   *     rather than invoking this method directly.
   */
  @Operation(
      summary =
          "Get the active actors from the service directory. result can be filtered by type, orgUnitType and orgUnitId, if needed")
  @GetExchange(ACTORS_PREFIX + "/activeActors")
  @ApiResponse(
      responseCode = "200",
      description =
          "Returns an ResponseEntity object containing the list of active actors in the body and the ETag value in the response headers")
  ResponseEntity<GetActiveActorsResponse> getActiveActors(
      @RequestHeader(name = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch,
      @RequestParam(name = "type", required = false) ActorTypeDto type,
      @RequestParam(name = "orgUnitType", required = false) OrgUnitTypeDto orgUnitType,
      @RequestParam(name = "orgUnitId", required = false) UUID orgUnitId);

  /**
   * Retrieves the active actors of the calling actor's org-unit from the service directory.
   *
   * @param ifNoneMatch The value of the "If-None-Match" request header, which represents the
   *     previously received ETag value. (optional) This value is used to check if the data has been
   *     modified since the last request.
   * @param type Filter for the given actor type. (optional)
   * @return ResponseEntity object containing the list of active actors in the body and the ETag
   *     value in the response headers. If the data has not been modified, returns {@link
   *     org.springframework.http.HttpStatus#NOT_MODIFIED}.
   *     <p>Note: It is HIGHLY recommended to use the {@link
   *     ServiceDirectoryApiConfiguration#cachingGetActiveOrgUnitActors} bean for accessing active
   *     actors, rather than invoking this method directly.
   */
  @Operation(
      summary =
          "Get the active actors of the calling actor's org-unit from the service directory. result can be filtered by type, if needed")
  @GetExchange(ACTORS_PREFIX + "/activeOrgUnitActors")
  @ApiResponse(
      responseCode = "200",
      description =
          "Returns an ResponseEntity object containing the list of active actors in the body and the ETag value in the response headers")
  ResponseEntity<GetActiveActorsResponse> getActiveOrgUnitActors(
      @RequestHeader(name = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch,
      @RequestParam(name = "type", required = false) ActorTypeDto type);

  @Operation(summary = "Get the actor making this request itself")
  @GetExchange(ACTORS_PREFIX + "/self")
  @ApiResponse(
      responseCode = "200",
      description = "Returns the actor making this request as an ActorResponseDto object")
  ActorResponseDto getSelf();

  /**
   * Retrieves the active actors from the service directory, which the caller can trust. As opposed
   * to {@link #getActiveActors(String, ActorTypeDto, OrgUnitTypeDto, UUID)} we do not want _all_
   * active actors, but those we trust as clients and servers.
   *
   * @param ifNoneMatch The value of the "If-None-Match" request header, which represents the
   *     previously received ETag value. (optional) This value is used to check if the data has been
   *     modified since the last request.
   * @return ResponseEntity object containing the lists of active actors for both client- and
   *     server-role in the body and the ETag value in the response headers. If the data has not
   *     been modified, returns {@link org.springframework.http.HttpStatus#NOT_MODIFIED}.
   *     <p>Note: It is HIGHLY recommended to use the {@link
   *     ServiceDirectoryApiConfiguration#cachingGetTrustedActors} bean for accessing trusted,
   *     active actors, rather than invoking this method directly.
   */
  @Operation(summary = "Get the active actors from the service directory, the caller can trust")
  @GetExchange(GET_TRUSTED_ACTORS_PATH)
  @ApiResponse(
      responseCode = "200",
      description =
          "Returns an ResponseEntity object containing the sets of active actors allowed as "
              + "clients and servers of the caller in the body and the ETag value in the response headers")
  ResponseEntity<GetTrustedActorsResponse> getTrustedActors(
      @RequestHeader(name = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch);

  @Operation(summary = "Create a topology by providing its actors")
  @PostExchange(ACTORS_PREFIX + "/topology")
  @ApiResponse(responseCode = "200", description = "Creates a topology by providing its actors")
  void postTopology(@Valid @RequestBody PostTopologyRequestDto postTopologyRequestDto);

  @Operation(summary = "Get the natural id of an actor by its common name")
  @GetExchange(ACTORS_PREFIX + "/{commonName}")
  @ApiResponse(
      responseCode = "200",
      description = "Gets the natural id of an actor by its common name")
  String getNaturalIdByCommonName(@PathVariable("commonName") String commonName);

  @Operation(
      summary =
          "Update the meta data of the actor making this request. If it doesn't exist, create it.")
  @PutExchange(ACTORS_PREFIX + "/metadata/self")
  @ApiResponse(
      responseCode = "200",
      description =
          "Updates the meta data of the actor making the request. If it doesn't exists, create it.")
  ActorResponseDto updateActorMetadata(@Valid @RequestBody ActorMetadataDto actorMetadataDto);
}
