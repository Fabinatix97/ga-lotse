/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import java.util.Objects;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testcontainers.containers.Network;

public class TestContainersUtil {

  private static final Logger log = LoggerFactory.getLogger(TestContainersUtil.class);

  public static final String NAMESPACE = "eshg";

  private TestContainersUtil() {}

  public static boolean shouldSkipTestContainers() {
    boolean testContainersDisabled =
        Objects.equals(System.getProperty("eshg.testcontainers.enabled"), "false");
    if (testContainersDisabled) {
      log.info("TestContainers are disabled");
      return true;
    }
    return false;
  }

  public static String generateName(String alias) {
    return NAMESPACE + "-" + alias + "-" + UUID.randomUUID();
  }

  public static Network createRandomNamedNetwork() {
    return Network.builder()
        .createNetworkCmdModifier(command -> command.withName(generateName("network")))
        .build();
  }
}
