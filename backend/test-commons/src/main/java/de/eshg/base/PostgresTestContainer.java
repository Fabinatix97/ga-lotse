/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import java.time.Duration;
import java.util.Map;
import java.util.function.Consumer;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.output.OutputFrame;
import org.testcontainers.utility.DockerImageName;

public class PostgresTestContainer {

  // ⚠ Note ⚠
  // We explicitly use the version AND digest here to match the image name
  // used in docker-compose.yaml
  // Unfortunately, because of https://github.com/testcontainers/testcontainers-java/issues/4762
  // this means that we need to use GenericContainer instead of PostgreSQLContainer.
  private static final DockerImageName POSTGRES_DOCKER_IMAGE =
      DockerImageName.parse(
          "postgres:15.12@sha256:8f6fbd24a12304d2adc332a2162ee9ff9d6044045a0b07f94d6e53e73125e11c");
  public static final int POSTGRES_PORT = 5432;
  public static final String POSTGRES_URL_TEMPLATE = "jdbc:postgresql://%s:%s/%s";
  private static final String POSTGRES_PASSWORD = "testpassword";
  private static final String POSTGRES_USER = "testuser";
  private static final Map<String, String> TMPFS = Map.of("/var/lib/postgresql/data", "rw");

  private final Network network;
  private String networkAlias;
  private String databaseName = "database";
  private Map<String, String> env;
  private Consumer<OutputFrame> logConsumer;

  private PostgresTestContainer(Network network) {
    this.network = network;
  }

  public static PostgresTestContainer withDefaultNetwork() {
    return new PostgresTestContainer(null);
  }

  public static PostgresTestContainer withNetwork(Network network) {
    return new PostgresTestContainer(network);
  }

  public PostgresTestContainer withDatabaseName(String databaseName) {
    this.databaseName = databaseName;
    return this;
  }

  public PostgresTestContainer withNetworkAlias(String networkAlias) {
    this.networkAlias = networkAlias;
    return this;
  }

  public PostgresTestContainer withEnv(Map<String, String> env) {
    this.env = env;
    return this;
  }

  public PostgresTestContainer withLogConsumer(Consumer<OutputFrame> logConsumer) {
    this.logConsumer = logConsumer;
    return this;
  }

  public GenericContainer<?> start() {
    // ⚠ Note ⚠ - We cannot use PostgreSQLContainer here because of
    // https://github.com/testcontainers/testcontainers-java/issues/4762
    @SuppressWarnings("resource") // TestContainers’ Ryuk takes care of destroying it
    GenericContainer<?> container =
        new GenericContainer<>(POSTGRES_DOCKER_IMAGE)
            .withExposedPorts(POSTGRES_PORT)
            .withTmpFs(TMPFS)
            .withEnv("POSTGRES_DB", databaseName)
            .withEnv("POSTGRES_USER", POSTGRES_USER)
            .withEnv("POSTGRES_PASSWORD", POSTGRES_PASSWORD)
            .withStartupTimeout(Duration.ofMinutes(3))
            .withCreateContainerCmdModifier(
                command ->
                    command.withName(TestContainersUtil.generateName(databaseName + "-database")));

    if (network != null) {
      container = container.withNetwork(network);
    }

    if (networkAlias != null) {
      container = container.withNetworkAliases(networkAlias);
    }

    if (env != null) {
      container = container.withEnv(env);
    }

    if (logConsumer != null) {
      container = container.withLogConsumer(logConsumer);
    }

    container.start();
    return container;
  }

  public String startAndGetJdbcUrl() {
    GenericContainer<?> container = start();
    return getJdbcUrl(container);
  }

  public void startAndRegister(MockEnvironment environment) {
    startAndRegister(
        (name, valueSupplier) ->
            environment.setProperty(name, String.valueOf(valueSupplier.get())));
  }

  public void startAndRegister(DynamicPropertyRegistry registry) {
    String jdbcUrl = startAndGetJdbcUrl();
    registry.add("spring.datasource.url", () -> jdbcUrl);
    registry.add("spring.datasource.username", () -> POSTGRES_USER);
    registry.add("spring.datasource.password", () -> POSTGRES_PASSWORD);
  }

  private String getJdbcUrl(GenericContainer<?> container) {
    return POSTGRES_URL_TEMPLATE.formatted(
        container.getHost(), container.getMappedPort(POSTGRES_PORT), databaseName);
  }

  public static String getJdbcUrl(String networkAlias, String databaseName) {
    return POSTGRES_URL_TEMPLATE.formatted(networkAlias, POSTGRES_PORT, databaseName);
  }
}
