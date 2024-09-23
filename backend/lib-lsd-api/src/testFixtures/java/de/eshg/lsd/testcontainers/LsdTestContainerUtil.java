/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.testcontainers;

import de.eshg.base.TestContainersUtil;
import de.eshg.servicedirectory.testcontainers.ServiceDirectoryTestContainerUtil;
import java.time.Duration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.web.util.UriComponentsBuilder;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.wait.strategy.LogMessageWaitStrategy;
import org.testcontainers.utility.DockerImageName;

public class LsdTestContainerUtil {

  private static final String LSD_IMAGE_NAME = "ga-lotse/local-service-directory";
  private static final int IA_PORT = 8080;

  private static final String AUTHORIZATION_SERVER_IMAGE = "ga-lotse/keycloak:latest";
  private static final String KEYCLOAK_ADMIN_NAME = "admin";
  private static final String KEYCLOAK_ADMIN_PASSWORD = "admin";

  private LsdTestContainerUtil() {}

  public static void relayServerAndServiceDirectory(
      DynamicPropertyRegistry registry,
      ServiceDirectoryTestContainerUtil.NetworkContainer serviceDirectory) {

    String authorizationServerAddress = authorizationTestContainer(serviceDirectory.network());

    @SuppressWarnings("resource")
    GenericContainer<?> container = new GenericContainer<>(LSD_IMAGE_NAME);

    container
        .withNetwork(serviceDirectory.network())
        .withExposedPorts(IA_PORT)
        .dependsOn(serviceDirectory.container())
        .withEnv("SERVER_PORT", Integer.toString(IA_PORT))
        .withEnv(
            "eshg.servicedirectory.baseUrl",
            ServiceDirectoryTestContainerUtil.getServiceUrl(serviceDirectory.container()))
        .withEnv("de.eshg.servicedirectory.mock-cert-subject-cn", "dummy")
        .withEnv("eshg.keycloak.url", authorizationServerAddress)
        .withEnv("eshg.keycloak.internal.url", authorizationServerAddress)
        .withCreateContainerCmdModifier(
            command -> command.withName(TestContainersUtil.generateName("lsd")));

    container.start();
    registry.add("eshg.lsd.baseUrl", () -> getServiceUrl(container));
  }

  public static String authorizationTestContainer(Network network) {

    int port = 8080;

    @SuppressWarnings("resource")
    GenericContainer<?> container =
        new GenericContainer<>(DockerImageName.parse(AUTHORIZATION_SERVER_IMAGE))
            .withNetwork(network)
            .withEnv("KEYCLOAK_ADMIN", KEYCLOAK_ADMIN_NAME)
            .withEnv("KEYCLOAK_ADMIN_PASSWORD", KEYCLOAK_ADMIN_PASSWORD)
            .withEnv("KC_DB", "dev-file")
            .withExposedPorts(port)
            .waitingFor(
                new LogMessageWaitStrategy()
                    .withRegEx(".*Added user 'admin' to realm 'master'.*")
                    .withStartupTimeout(Duration.ofMinutes(3)))
            .withCreateContainerCmdModifier(
                command -> command.withName(TestContainersUtil.generateName("authorization")))
            .withCommand("start", "--hostname-strict=false", "--http-enabled=true");

    container.start();

    return UriComponentsBuilder.newInstance()
        .scheme("http")
        .host(container.getHost())
        .port(container.getMappedPort(port))
        .toUriString();
  }

  private static String getServiceUrl(GenericContainer<?> baseModuleContainer) {
    return UriComponentsBuilder.newInstance()
        .scheme("http")
        .host(baseModuleContainer.getHost())
        .port(baseModuleContainer.getMappedPort(IA_PORT))
        .toUriString();
  }
}
