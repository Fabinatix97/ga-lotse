/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.testcontainers;

import static de.eshg.base.PostgresContainerConstants.POSTGRES_PORT;
import static de.eshg.testhelper.ConditionalOnLocalEnvironment.LOCAL_PROFILE_NAME;
import static de.eshg.testhelper.ConditionalOnTestHelperEnabled.TEST_HELPER_PROFILE_NAME;

import de.eshg.base.PostgresContainerConstants;
import de.eshg.base.TestContainersUtil;
import java.time.Duration;
import java.util.List;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.web.util.UriComponentsBuilder;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;

public class ServiceDirectoryTestContainerUtil {

  private static final String SERVICE_DIRECTORY_IMAGE_NAME = "ga-lotse/service-directory";
  private static final String SD_DB_NETWORK_ALIAS =
      TestContainersUtil.NAMESPACE + "-service-directory-db";
  private static final String SERVICE_DIRECTORY_DATABASE = "servicedirectory_db";
  private static final int SD_PORT = 8080;

  private ServiceDirectoryTestContainerUtil() {}

  public static NetworkContainer serviceDirectory(DynamicPropertyRegistry registry) {
    GenericContainer<?> container = new GenericContainer<>(SERVICE_DIRECTORY_IMAGE_NAME);

    Network network = TestContainersUtil.createRandomNamedNetwork();
    GenericContainer<?> dbContainer = createDbContainer(network);

    String jdbcUrl =
        PostgresContainerConstants.POSTGRES_URL_TEMPLATE.formatted(
            SD_DB_NETWORK_ALIAS, POSTGRES_PORT, SERVICE_DIRECTORY_DATABASE);

    container
        .withNetwork(network)
        .withExposedPorts(SD_PORT)
        .dependsOn(dbContainer)
        .withEnv(
            "spring.profiles.active",
            String.join(", ", List.of(LOCAL_PROFILE_NAME, TEST_HELPER_PROFILE_NAME)))
        .withEnv("spring.datasource.url", jdbcUrl)
        .withEnv("SERVER_PORT", Integer.toString(SD_PORT))
        .withCreateContainerCmdModifier(
            command -> command.withName(TestContainersUtil.generateName("servicedirectory")));

    container.start();
    registry.add("eshg.servicedirectory.baseUrl", () -> getServiceUrl(container));

    return new NetworkContainer(network, container);
  }

  public static GenericContainer<?> createDbContainer(Network network) {
    GenericContainer<?> container =
        new GenericContainer<>(PostgresContainerConstants.POSTGRES_DOCKER_IMAGE);

    container
        .withNetwork(network)
        .withNetworkAliases(SD_DB_NETWORK_ALIAS)
        .withExposedPorts(POSTGRES_PORT)
        .withTmpFs(PostgresContainerConstants.TMPFS)
        .withEnv("POSTGRES_DB", SERVICE_DIRECTORY_DATABASE)
        .withEnv("POSTGRES_USER", PostgresContainerConstants.POSTGRES_USER)
        .withEnv("POSTGRES_PASSWORD", PostgresContainerConstants.POSTGRES_PASSWORD)
        .withStartupTimeout(Duration.ofMinutes(3))
        .withCreateContainerCmdModifier(
            command -> command.withName(TestContainersUtil.generateName("servicedirectory-db")));

    container.start();
    return container;
  }

  public static String getJdbcUrl(GenericContainer<?> container) {
    return PostgresContainerConstants.POSTGRES_URL_TEMPLATE.formatted(
        container.getHost(),
        container.getMappedPort(PostgresContainerConstants.POSTGRES_PORT),
        SERVICE_DIRECTORY_DATABASE);
  }

  public static String getServiceUrl(GenericContainer<?> baseModuleContainer) {
    return UriComponentsBuilder.newInstance()
        .scheme("http")
        .host(baseModuleContainer.getHost())
        .port(baseModuleContainer.getMappedPort(SD_PORT))
        .toUriString();
  }

  public record NetworkContainer(Network network, GenericContainer<?> container) {}
}
