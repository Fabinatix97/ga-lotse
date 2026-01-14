/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.config;

import de.eshg.lsd.register.api.ActorTypeDto;
import de.eshg.spatz.security.DefaultKeyParameters;
import java.net.URI;
import java.time.Duration;
import java.util.List;
import org.springframework.boot.autoconfigure.ssl.PemSslBundleProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @param inbound configures connectivity for incoming encrypted data
 * @param outbound configures connectivity for outgoing unencrypted data
 * @param dns dns port and overrides
 * @param selfSigned config for creation of a self-signed certificate as Spatz's own server cert
 * @param ssl config keystore and truststore
 */
@ConfigurationProperties(prefix = "eshg.spatz")
public record SpatzConfigurationProperties(
    ActorConfiguration actor,
    InboundConfiguration inbound,
    OutboundConfiguration outbound,
    DnsServerProperties dns,
    SelfSignedConfiguration selfSigned,
    SslConfiguration ssl,
    RelayConfiguration relay,
    ProxyClientConfiguration http) {

  public SpatzConfigurationProperties(
      ActorConfiguration actor,
      InboundConfiguration inbound,
      OutboundConfiguration outbound,
      DnsServerProperties dns,
      SelfSignedConfiguration selfSigned,
      SslConfiguration ssl,
      RelayConfiguration relay,
      ProxyClientConfiguration http) {
    this.actor = actor;
    this.inbound = inbound;
    this.outbound = outbound;
    this.dns = dns;
    this.selfSigned = selfSigned;
    this.ssl = ssl != null ? ssl : new SslConfiguration();
    this.relay = relay;
    this.http = http;
  }

  /**
   * @param handlerPort Port for incoming traffic into the pod. SPATZ will terminate the mTLS
   *     connection and all content then will be forwarded to the application container.
   * @param targetPort Port where mTLS-terminated data ist forwarded to unencrypted
   * @param forceClientAuth can be set to {@code false} to disable mTLS in favor of TLS
   * @param clientCnAllowList List of CNs that are allowed to call this service in addition to CNs
   *     configured in the service-directory
   */
  public record InboundConfiguration(
      String listeningHost,
      int handlerPort,
      String targetHost,
      int targetPort,
      boolean forceClientAuth,
      List<String> clientCnAllowList) {}

  /**
   * @param handlerPort Port for outgoing unencrypted traffic.
   * @param targetPort Port where mTLS encrypted data is sent to. Usually corresponds to {@link
   *     InboundConfiguration#handlerPort}
   */
  public record OutboundConfiguration(String listeningHost, int handlerPort, int targetPort) {}

  public record ActorConfiguration(String readableName, ActorTypeDto type, String hostname) {}

  public record DnsServerProperties(
      int port,
      int ttl,
      String upstreamHost,
      List<String> staticHosts,
      List<String> forwardRequestAllowList) {}

  public static class SelfSignedConfiguration {

    private boolean enabled = true;
    private String subjectLocation;
    private Duration maxAge = Duration.ofDays(7);
    private DefaultKeyParameters keyParameters = DefaultKeyParameters.ECDSA;

    public boolean isEnabled() {
      return enabled;
    }

    public void setEnabled(boolean enabled) {
      this.enabled = enabled;
    }

    public DefaultKeyParameters getKeyParameters() {
      return keyParameters;
    }

    public void setKeyParameters(DefaultKeyParameters keyParameters) {
      this.keyParameters = keyParameters;
    }

    public Duration getMaxAge() {
      return maxAge;
    }

    public void setMaxAge(Duration maxAge) {
      this.maxAge = maxAge;
    }

    public String getSubjectLocation() {
      return subjectLocation;
    }

    public void setSubjectLocation(String subjectLocation) {
      this.subjectLocation = subjectLocation;
    }
  }

  public static class SslConfiguration extends PemSslBundleProperties {}

  public record RelayConfiguration(boolean enabled, URI url, String listenHost, int listenPort) {}

  public record ProxyClientConfiguration(
      int maxConnections,
      Duration channelEvictionInterval,
      Duration channelPoolDisposeInterval,
      Duration channelPoolInactivity) {}
}
