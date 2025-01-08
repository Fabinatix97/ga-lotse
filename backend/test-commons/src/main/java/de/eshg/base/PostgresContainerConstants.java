/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import java.util.Map;
import org.testcontainers.utility.DockerImageName;

public final class PostgresContainerConstants {

  private PostgresContainerConstants() {}

  public static final DockerImageName POSTGRES_DOCKER_IMAGE =
      DockerImageName.parse(
          "postgres@sha256:d0f363f8366fbc3f52d172c6e76bc27151c3d643b870e1062b4e8bfe65baf609");
  public static final int POSTGRES_PORT = 5432;
  public static final String POSTGRES_URL_TEMPLATE = "jdbc:postgresql://%s:%s/%s";
  public static final String POSTGRES_PASSWORD = "testpassword";
  public static final String POSTGRES_USER = "testuser";
  public static final Map<String, String> TMPFS = Map.of("/var/lib/postgresql/data", "rw");
}
