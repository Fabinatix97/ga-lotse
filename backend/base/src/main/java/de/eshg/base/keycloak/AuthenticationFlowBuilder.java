/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import org.keycloak.representations.idm.AuthenticationExecutionInfoRepresentation;
import org.keycloak.representations.idm.AuthenticationFlowRepresentation;

public class AuthenticationFlowBuilder {
  private static final String REQUIREMENT_ALTERNATIVE = "ALTERNATIVE";
  private static final String REQUIREMENT_REQUIRED = "REQUIRED";
  private static final String REQUIREMENT_CONDITIONAL = "CONDITIONAL";

  private final String flowName;
  private String description;
  private final int level;
  private final Map<String, List<AuthenticationExecutionInfoRepresentation>> executions;

  public AuthenticationFlowBuilder(String flowName) {
    this(flowName, 0, new LinkedHashMap<>());
  }

  public AuthenticationFlowBuilder(
      String flowName,
      int level,
      Map<String, List<AuthenticationExecutionInfoRepresentation>> executions) {
    this.flowName = flowName;
    this.level = level;
    this.executions = executions;
  }

  private List<AuthenticationExecutionInfoRepresentation> getExecutions() {
    return this.executions.computeIfAbsent(this.flowName, k -> new ArrayList<>());
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public void addSubflow(String name, Consumer<AuthenticationFlowBuilder> builder) {
    AuthenticationExecutionInfoRepresentation subflow =
        createSubflow(REQUIREMENT_ALTERNATIVE, name);
    AuthenticationFlowBuilder subflowBuilder =
        new AuthenticationFlowBuilder(subflow.getAlias(), this.level + 1, this.executions);
    builder.accept(subflowBuilder);
    getExecutions().add(subflow);
  }

  public void addConditionalStep(String alias, String provider) {
    AuthenticationExecutionInfoRepresentation subflow =
        createSubflow(REQUIREMENT_CONDITIONAL, alias);
    AuthenticationFlowBuilder subflowBuilder =
        new AuthenticationFlowBuilder(subflow.getAlias(), this.level + 1, this.executions);
    subflowBuilder.addCondition("conditional-user-configured");
    subflowBuilder.addRequiredStep(provider);
    getExecutions().add(subflow);
  }

  public void addAlternativeStep(String provider) {
    AuthenticationExecutionInfoRepresentation execution =
        new AuthenticationExecutionInfoRepresentation();
    execution.setProviderId(provider);
    execution.setRequirement(REQUIREMENT_ALTERNATIVE);
    execution.setLevel(this.level);
    getExecutions().add(execution);
  }

  public void addRequiredStep(String provider) {
    AuthenticationExecutionInfoRepresentation execution =
        new AuthenticationExecutionInfoRepresentation();
    execution.setProviderId(provider);
    execution.setRequirement(REQUIREMENT_REQUIRED);
    execution.setLevel(this.level);
    getExecutions().add(execution);
  }

  public void addCondition(String provider) {
    AuthenticationExecutionInfoRepresentation execution =
        new AuthenticationExecutionInfoRepresentation();
    execution.setProviderId(provider);
    execution.setRequirement(REQUIREMENT_REQUIRED);
    execution.setLevel(this.level);
    getExecutions().add(execution);
  }

  public void build(RealmBoundKeycloakClient client) {
    AuthenticationFlowRepresentation flow = new AuthenticationFlowRepresentation();
    flow.setAlias(this.flowName);
    flow.setDescription(this.description);
    flow.setProviderId("basic-flow");
    flow.setTopLevel(true);

    client.configureFlow(flow);
    client.addOrUpdateExecutions(this.flowName, this.executions);
  }

  private AuthenticationExecutionInfoRepresentation createSubflow(String requirement, String name) {
    AuthenticationExecutionInfoRepresentation subflow =
        new AuthenticationExecutionInfoRepresentation();
    subflow.setAuthenticationFlow(true);
    subflow.setProviderId("registration-page-form");
    subflow.setRequirement(requirement);
    subflow.setAlias(name);
    subflow.setLevel(this.level);
    return subflow;
  }
}
