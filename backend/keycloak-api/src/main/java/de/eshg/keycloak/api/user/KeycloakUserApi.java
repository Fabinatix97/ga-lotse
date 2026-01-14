/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.api.user;

import de.eshg.keycloak.api.user.model.BulkGetUsersRequest;
import de.eshg.keycloak.api.user.model.CredentialRequest;
import de.eshg.keycloak.api.user.model.GetActiveSessionResponse;
import de.eshg.keycloak.api.user.model.GetGroupMembersRequest;
import de.eshg.keycloak.api.user.model.GetGroupMembersResponse;
import de.eshg.keycloak.api.user.model.GetRoleMembersRequest;
import de.eshg.keycloak.api.user.model.GetRoleMembersResponse;
import de.eshg.keycloak.api.user.model.GetUsersResponse;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.springframework.web.bind.annotation.RequestBody;

public interface KeycloakUserApi {
  String PROVIDER_ID = "extended-user-resource";

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/admin/realms/{realm}/" + PROVIDER_ID + "/bulk-get")
  GetUsersResponse getUsersBulk(
      @PathParam("realm") String realmName, @Valid @RequestBody BulkGetUsersRequest request);

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/admin/realms/{realm}/" + PROVIDER_ID + "/search-users")
  GetGroupMembersResponse getGroupMembers(
      @PathParam("realm") String realmName, @Valid @RequestBody GetGroupMembersRequest request);

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/admin/realms/{realm}/" + PROVIDER_ID + "/role-members")
  GetRoleMembersResponse getRoleMembers(
      @PathParam("realm") String realmName, @Valid @RequestBody GetRoleMembersRequest request);

  @GET
  @Path("/admin/realms/{realm}/" + PROVIDER_ID + "/users/{id}/active-sessions")
  @Produces(MediaType.APPLICATION_JSON)
  GetActiveSessionResponse getActiveUserSessions(
      @PathParam("realm") String realmName, @PathParam("id") String id);

  @POST
  @Path("/admin/realms/{realm}/" + PROVIDER_ID + "/users/{id}/verify-credential")
  @Consumes(MediaType.APPLICATION_JSON)
  void verifyCredential(
      @PathParam("realm") String realmName,
      @PathParam("id") String id,
      @Valid @RequestBody CredentialRequest request);

  @PUT
  @Path("/admin/realms/{realm}/" + PROVIDER_ID + "/users/{id}/reset-credential")
  @Consumes(MediaType.APPLICATION_JSON)
  void resetCredential(
      @PathParam("realm") String realmName,
      @PathParam("id") String id,
      @Valid @RequestBody CredentialRequest request);
}
