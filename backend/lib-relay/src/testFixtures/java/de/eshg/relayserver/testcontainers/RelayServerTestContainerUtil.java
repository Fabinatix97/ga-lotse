/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.relayserver.testcontainers;

import static de.eshg.testhelper.ConditionalOnLocalEnvironment.LOCAL_PROFILE_NAME;
import static de.eshg.testhelper.ConditionalOnTestHelperEnabled.TEST_HELPER_PROFILE_NAME;

import de.eshg.base.TestContainersUtil;
import de.eshg.servicedirectory.testcontainers.ServiceDirectoryTestContainerUtil;
import java.util.List;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.web.util.UriComponentsBuilder;
import org.testcontainers.containers.GenericContainer;

public class RelayServerTestContainerUtil {

  private static final String RELAY_SERVER_IMAGE_NAME = "ga-lotse/relay-server";
  private static final int RS_PORT = 8080;

  private RelayServerTestContainerUtil() {}

  public static void relayServer(
      DynamicPropertyRegistry registry,
      ServiceDirectoryTestContainerUtil.NetworkContainer serviceDirectory) {
    @SuppressWarnings("resource")
    GenericContainer<?> container = new GenericContainer<>(RELAY_SERVER_IMAGE_NAME);

    container
        .withNetwork(serviceDirectory.network())
        .withExposedPorts(RS_PORT)
        .dependsOn(serviceDirectory.container())
        .withEnv("SERVER_PORT", Integer.toString(RS_PORT))
        .withEnv(
            "spring.profiles.active",
            String.join(", ", List.of(LOCAL_PROFILE_NAME, TEST_HELPER_PROFILE_NAME)))
        .withEnv(
            "eshg.servicedirectory.baseUrl",
            ServiceDirectoryTestContainerUtil.getServiceUrl(serviceDirectory.container()))
        .withEnv("de.eshg.servicedirectory.mock-cert-subject-cn", "dummy")
        .withCreateContainerCmdModifier(
            command -> command.withName(TestContainersUtil.generateName("relayserver")));

    container.start();
    registry.add("eshg.spatz.relay.url", () -> getServiceUrl(container));
  }

  private static String getServiceUrl(GenericContainer<?> baseModuleContainer) {
    return UriComponentsBuilder.newInstance()
        .scheme("http")
        .host(baseModuleContainer.getHost())
        .port(baseModuleContainer.getMappedPort(RS_PORT))
        .toUriString();
  }
}
