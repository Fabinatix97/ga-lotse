/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz;

import java.time.Duration;
import org.springframework.boot.autoconfigure.context.LifecycleProperties;

public enum LifecyclePhases {
  MANAGEMENT_SERVER(0),
  UDP_SERVER(1),
  OUTBOUND_SERVER(2),
  RELAY_CONNECTOR(3),
  SELF_SIGNED_CERT_SERVICE(4),
  SERVICE_DIRECTORY_TOPOLOGY_SERVICE(5),
  INBOUND_SERVER(6),
  ;

  LifecyclePhases(int phase) {
    this.phase = phase;
  }

  public final int phase;

  public static Duration getShutdownTimeout(LifecycleProperties lifecycleProperties) {
    if (lifecycleProperties.getTimeoutPerShutdownPhase() != null) {
      return lifecycleProperties.getTimeoutPerShutdownPhase();
    } else {
      return Duration.ofSeconds(10);
    }
  }
}
