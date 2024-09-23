/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.relay;

import de.eshg.spatz.config.SpatzConfigurationProperties;
import java.io.IOException;
import java.net.InetSocketAddress;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(value = "eshg.spatz.relay.enabled", havingValue = "true")
public class SpatzRelayConnection {

  SpatzRelayConnection(RelayConnector connector, SpatzConfigurationProperties properties)
      throws IOException {

    connector.configureIncomingConnections(new InetSocketAddress("127.0.0.1", 8888));
    connector.configureOutgoingConnections(
        new InetSocketAddress(
            properties.inbound().listeningHost().equals("0.0.0.0")
                ? "127.0.0.1"
                : properties.inbound().listeningHost(),
            properties.inbound().handlerPort()));
  }
}
