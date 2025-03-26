/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.common;

import static de.eshg.servicedirectory.util.X509Utils.ESHGACTOR_BUNDLE_NAME;
import static de.eshg.servicedirectory.util.X509Utils.getCertificateInfo;

import de.eshg.lib.servicedirectory.ServiceDirectoryApiConfiguration.GetTrustedActorsCacheEntry;
import de.eshg.lib.servicedirectory.ServiceDirectoryApiConfiguration.TrustedActorsSupplier;
import de.eshg.lib.servicedirectory.api.ActorResponseDto;
import de.eshg.lib.servicedirectory.api.CertificateDto;
import de.eshg.servicedirectory.util.X509Utils;
import de.eshg.spatz.LifecyclePhases;
import de.eshg.spatz.config.SelfSignedCertificateLatch;
import de.eshg.spatz.dns.DnsResolver;
import de.eshg.spatz.security.CertificateValidationService;
import de.eshg.spatz.server.outbound.OutboundServer;
import io.netty.handler.codec.http.HttpResponseStatus;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.event.Level;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.ssl.SslBundle;
import org.springframework.boot.ssl.SslBundleRegistry;
import org.springframework.context.SmartLifecycle;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;

@Service
@ConditionalOnProperty(name = "eshg.servicedirectory.baseUrl")
@EnableScheduling
public class ServiceDirectoryTopologyService implements SmartLifecycle {

  private static final Logger logger =
      LoggerFactory.getLogger(ServiceDirectoryTopologyService.class);

  private final TrustedActorsSupplier trustedActorsSupplier;
  private final List<TopologyChangedListener> topologyChangedListeners;
  private final CertificateValidationService certificateValidationService;
  private final SelfSignedCertificateLatch latch;
  private final Duration serviceDirectoryPollInterval;
  private final Duration pollRetryGracePeriod;
  private final AtomicBoolean isRunning = new AtomicBoolean(false);

  private String lastEtag = null;
  private Instant lastSuccessfulPollTime = Instant.now();
  private volatile Instant firstSuccessfulPollTime = null;
  private TrustedActors trustedActors = new TrustedActors(List.of(), List.of());

  public ServiceDirectoryTopologyService(
      TrustedActorsSupplier trustedActorsSupplier,
      ObjectProvider<TopologyChangedListener> topologyChangedListeners,
      CertificateValidationService certificateValidationService,
      SelfSignedCertificateLatch latch,
      @Value("${eshg.servicedirectory.topology.pollInterval:15000}")
          Duration serviceDirectoryPollInterval,
      @Value("${eshg.servicedirectory.topology.pollRetryGracePeriod:75000}")
          long pollRetryGracePeriod) {
    this.trustedActorsSupplier = trustedActorsSupplier;
    this.topologyChangedListeners = topologyChangedListeners.stream().toList();
    this.certificateValidationService = certificateValidationService;
    this.latch = latch;
    this.serviceDirectoryPollInterval = serviceDirectoryPollInterval;
    this.pollRetryGracePeriod =
        pollRetryGracePeriod < 0
            ? ChronoUnit.FOREVER.getDuration() // about 292,271,023,045 years
            : Duration.ofMillis(pollRetryGracePeriod);

    logger.debug(
        "registered {} topologyChangedListeners: {}",
        this.topologyChangedListeners.size(),
        this.topologyChangedListeners);
  }

  @Override
  public void start() {
    isRunning.set(true);
  }

  @Override
  public void stop() {
    isRunning.set(false);
  }

  @Override
  public boolean isRunning() {
    return isRunning.get();
  }

  @Override
  public int getPhase() {
    return LifecyclePhases.SERVICE_DIRECTORY_TOPOLOGY_SERVICE.phase;
  }

  public Instant getCertificateDistributedTime() {
    // If we were able to poll from the SD, the SD's Spatz already fetched our certificate.
    // Wait one more serviceDirectoryPollInterval so all other Spatzs had time to fetch our
    // certificate, too.
    if (firstSuccessfulPollTime == null) {
      return null;
    }
    return firstSuccessfulPollTime.plus(serviceDirectoryPollInterval);
  }

  @Scheduled(fixedDelayString = "${eshg.servicedirectory.topology.pollInterval:15000}")
  public void poll() throws InterruptedException {
    if (!isRunning.get()) {
      return;
    }
    latch.await();
    try {
      GetTrustedActorsCacheEntry trustedActorsCacheEntry = trustedActorsSupplier.get();
      String eTag = trustedActorsCacheEntry.eTag();

      if (eTag.equals(lastEtag)) {
        logger.debug("serviceDirectory topology has not changed");
        logTrustedActors(Level.TRACE);
      } else {
        trustedActors = getValidTrustedActors(trustedActorsCacheEntry);

        logTopologyChanged(trustedActorsCacheEntry, trustedActors);
        logTrustedActors(Level.INFO);
        notifyListeners(trustedActors);
        lastEtag = eTag;
      }

      lastSuccessfulPollTime = Instant.now();
      if (firstSuccessfulPollTime == null) {
        firstSuccessfulPollTime = lastSuccessfulPollTime;
      }
    } catch (RuntimeException e) {
      handlePollingFailure(e);
    }
  }

  private TrustedActors getValidTrustedActors(GetTrustedActorsCacheEntry trustedActorsCacheEntry) {
    return new TrustedActors(
        certificateValidationService.keepOnlyValidActors(
            trustedActorsCacheEntry.allowedInboundActors()),
        certificateValidationService.keepOnlyValidActors(
            trustedActorsCacheEntry.allowedOutboundActors()));
  }

  private void handlePollingFailure(RuntimeException e) {
    // always positive since the end must be after the start instant
    Duration durationSinceLastSuccessfulPoll =
        Duration.between(lastSuccessfulPollTime, Instant.now());

    boolean sslHandshakeException =
        e instanceof HttpServerErrorException see
            && see.getStatusCode().value()
                == HttpResponseStatus.NETWORK_AUTHENTICATION_REQUIRED.code()
            && e.getMessage().contains(OutboundServer.OUTBOUND_RESPONSE_SSL_HANDSHAKE_EXCEPTION);

    if (sslHandshakeException && firstSuccessfulPollTime != null) {
      logger.error("SSL handshake failed after having passed before: {}", e.getMessage());
    }

    if (durationSinceLastSuccessfulPoll.compareTo(pollRetryGracePeriod) > 0) {
      if (sslHandshakeException) {
        logger.warn(
            "could not poll trusted actors since {} - pollRetryGracePeriod expired -> "
                + "trusting nobody until next successful polling {}",
            lastSuccessfulPollTime,
            e.toString());
      } else {
        logger.warn(
            "could not poll trusted actors since {} - pollRetryGracePeriod expired -> "
                + "trusting nobody until next successful polling",
            lastSuccessfulPollTime,
            e);
      }
      lastEtag = null;
      if (!trustedActors.isEmpty()) {
        trustedActors = new TrustedActors(List.of(), List.of());
        notifyListeners(trustedActors);
      }
      firstSuccessfulPollTime = null;
    } else {
      if (sslHandshakeException) {
        logger.info("could not poll trusted actors -> will try again later {}", e.toString());
      } else {
        logger.info("could not poll trusted actors -> will try again later", e);
      }
    }
  }

  private void notifyListeners(TrustedActors trustedActors) {
    topologyChangedListeners.forEach(
        listener -> {
          try {
            listener.trustedActorsChanged(trustedActors);
          } catch (Exception e) {
            logger.error("could not apply changed topology to {}: {}", listener, e, e);
          }
        });
  }

  private void logTopologyChanged(
      GetTrustedActorsCacheEntry trustedActorsCacheEntry, TrustedActors validTrustedActors) {
    int inboundSize = trustedActorsCacheEntry.allowedInboundActors().size();
    int outboundSize = trustedActorsCacheEntry.allowedOutboundActors().size();
    int validInboundSize = validTrustedActors.inbound.size();
    int validOutboundSize = validTrustedActors.outbound.size();
    logger.info(
        "serviceDirectory topology changed - inbound:outbound {}:{} actors, of which {}:{} were valid. New version is {}",
        inboundSize,
        outboundSize,
        validInboundSize,
        validOutboundSize,
        trustedActorsCacheEntry.eTag());
  }

  private void logTrustedActors(Level level) {
    if (!logger.isEnabledForLevel(level)) {
      return;
    }
    logger
        .atLevel(level)
        .log(
            "valid active inbound actors: {}",
            trustedActors.inbound.stream()
                .map(ServiceDirectoryTopologyService::getActorInfo)
                .sorted()
                .toList());
    logger
        .atLevel(level)
        .log(
            "valid active outbound actors: {}",
            trustedActors.outbound.stream()
                .map(ServiceDirectoryTopologyService::getActorInfo)
                .sorted()
                .toList());
  }

  private static String getActorInfo(ActorResponseDto actor) {
    return getCertificateInfo(
        actor.commonName(),
        Optional.ofNullable(actor.certificate()).map(CertificateDto::value).orElse(null));
  }

  public interface TopologyChangedListener {
    void trustedActorsChanged(TrustedActors trustedActors);
  }

  public record TrustedActors(List<ActorResponseDto> inbound, List<ActorResponseDto> outbound) {
    public Map<String, ActorResponseDto> inboundByHostname() {
      return inbound().stream()
          .collect(Collectors.toUnmodifiableMap(ActorResponseDto::commonName, Function.identity()));
    }

    public Map<String, ActorResponseDto> outboundByHostname() {
      return outbound().stream()
          .collect(Collectors.toUnmodifiableMap(ActorResponseDto::commonName, Function.identity()));
    }

    public boolean isEmpty() {
      return inbound().isEmpty() && outbound().isEmpty();
    }
  }

  @Component
  public static class DnsUpdater implements TopologyChangedListener {

    private final DnsResolver dnsResolver;

    public DnsUpdater(DnsResolver dnsResolver) {
      this.dnsResolver = dnsResolver;
    }

    @Override
    public void trustedActorsChanged(TrustedActors trustedActors) {
      List<String> hostNames =
          trustedActors.outbound.stream().map(ActorResponseDto::commonName).toList();

      dnsResolver.setLoopBackRecords(hostNames);
      logger.info("updated DNS resolver to reflect changed serviceDirectory topology");
    }
  }

  @Component
  public static class SSLBundleUpdater implements TopologyChangedListener {

    private final SslBundleFactory sslBundleFactory;
    private final SslBundleRegistry sslBundleRegistry;

    public SSLBundleUpdater(
        SslBundleFactory sslBundleFactory, SslBundleRegistry sslBundleRegistry) {
      this.sslBundleFactory = sslBundleFactory;
      this.sslBundleRegistry = sslBundleRegistry;
    }

    @Override
    public void trustedActorsChanged(TrustedActors trustedActors) {

      Map<String, ActorResponseDto> allTrustedActors =
          new HashMap<>(trustedActors.inboundByHostname());
      allTrustedActors.putAll(trustedActors.outboundByHostname());

      List<X509Certificate> dynamicCertificates =
          allTrustedActors.values().stream()
              .map(ActorResponseDto::certificate)
              .filter(Objects::nonNull)
              .map(CertificateDto::value)
              .flatMap(X509Utils::parseMultiPem)
              .toList();

      SslBundle newSslBundle =
          sslBundleFactory.buildWithNewDynamicRemoteCertificates(dynamicCertificates);

      sslBundleRegistry.updateBundle(ESHGACTOR_BUNDLE_NAME, newSslBundle);
      logger.info("updated SSL Truststore to reflect changed serviceDirectory topology");
    }
  }
}
