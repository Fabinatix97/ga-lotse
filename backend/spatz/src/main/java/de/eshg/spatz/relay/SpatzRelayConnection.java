/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.relay;

import de.eshg.spatz.LifecyclePhases;
import de.eshg.spatz.common.SslBundleFactory;
import de.eshg.spatz.config.SelfSignedCertificateLatch;
import de.eshg.spatz.config.SpatzConfigurationProperties;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.security.KeyStoreException;
import java.time.Duration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.context.LifecycleProperties;
import org.springframework.context.SmartLifecycle;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(value = "eshg.spatz.relay.enabled", havingValue = "true")
public class SpatzRelayConnection implements SmartLifecycle {

  private final SpatzConfigurationProperties properties;
  private final RelayConnector connector;
  private final Duration shutdownTimeout;

  SpatzRelayConnection(
      SelfSignedCertificateLatch latch,
      SpatzConfigurationProperties properties,
      SslBundleFactory sslBundleFactory,
      LifecycleProperties lifecycleProperties)
      throws KeyStoreException {
    this.properties = properties;
    connector = new RelayConnector(latch, properties, sslBundleFactory);
    connector.setConnectionLostTimeout(0);
    shutdownTimeout = LifecyclePhases.getShutdownTimeout(lifecycleProperties);
  }

  @Override
  public void start() {
    try {
      connector.start();
    } catch (IOException e) {
      throw new RuntimeException(e);
    }

    try {
      connector.configureIncomingConnections(new InetSocketAddress("127.0.0.1", 8888));
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
    connector.configureOutgoingConnections(
        new InetSocketAddress(
            properties.inbound().listeningHost().equals("0.0.0.0")
                ? "127.0.0.1"
                : properties.inbound().listeningHost(),
            properties.inbound().handlerPort()));
  }

  @Override
  public void stop() {
    try {
      connector.stop(shutdownTimeout);
    } catch (InterruptedException | IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public boolean isRunning() {
    return connector.isRunning();
  }

  @Override
  public int getPhase() {
    return LifecyclePhases.RELAY_CONNECTOR.phase;
  }
}
