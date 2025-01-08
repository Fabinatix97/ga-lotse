/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.common;

import static de.eshg.servicedirectory.util.X509Utils.ESHGACTOR_BUNDLE_NAME;

import de.eshg.lib.servicedirectory.ServiceDirectoryApiConfiguration.GetTrustedActorsCacheEntry;
import de.eshg.lib.servicedirectory.ServiceDirectoryApiConfiguration.TrustedActorsSupplier;
import de.eshg.lib.servicedirectory.api.ActorResponseDto;
import de.eshg.lib.servicedirectory.api.CertificateDto;
import de.eshg.servicedirectory.util.X509Utils;
import de.eshg.spatz.config.SelfSignedCertificateLatch;
import de.eshg.spatz.dns.DnsResolver;
import de.eshg.spatz.security.CertificateValidationService;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.event.Level;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.ssl.SslBundle;
import org.springframework.boot.ssl.SslBundleRegistry;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "eshg.servicedirectory.baseUrl")
@EnableScheduling
public class ServiceDirectoryTopologyService {

  private static final Logger logger =
      LoggerFactory.getLogger(ServiceDirectoryTopologyService.class);

  private final TrustedActorsSupplier trustedActorsSupplier;
  private final List<TopologyChangedListener> topologyChangedListeners;
  private final CertificateValidationService certificateValidationService;
  private final SelfSignedCertificateLatch latch;
  private final Duration pollRetryGracePeriod;

  private String lastEtag = null;
  private Instant lastSuccessfulPollTime = Instant.now();
  private TrustedActors trustedActors = new TrustedActors(List.of(), List.of());

  public ServiceDirectoryTopologyService(
      TrustedActorsSupplier trustedActorsSupplier,
      ObjectProvider<TopologyChangedListener> topologyChangedListeners,
      CertificateValidationService certificateValidationService,
      SelfSignedCertificateLatch latch,
      @Value("${eshg.servicedirectory.topology.pollRetryGracePeriod:75000}")
          long pollRetryGracePeriod) {
    this.trustedActorsSupplier = trustedActorsSupplier;
    this.topologyChangedListeners = topologyChangedListeners.stream().toList();
    this.certificateValidationService = certificateValidationService;
    this.latch = latch;
    this.pollRetryGracePeriod =
        pollRetryGracePeriod < 0
            ? ChronoUnit.FOREVER.getDuration() // about 292,271,023,045 years
            : Duration.ofMillis(pollRetryGracePeriod);

    logger.debug(
        "registered {} topologyChangedListeners: {}",
        this.topologyChangedListeners.size(),
        this.topologyChangedListeners);
  }

  @Scheduled(fixedDelayString = "${eshg.servicedirectory.topology.pollInterval:15000}")
  public void poll() throws InterruptedException {
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

    if (durationSinceLastSuccessfulPoll.compareTo(pollRetryGracePeriod) > 0) {
      trustedActors = new TrustedActors(List.of(), List.of());
      lastEtag = null;
      logger.warn(
          "could not poll trusted actors since {}: {} - pollRetryGracePeriod expired -> "
              + "trusting nobody until next successful polling",
          lastSuccessfulPollTime,
          e.getMessage());
      notifyListeners(trustedActors);
    } else {
      logger.info("could not poll trusted actors: {} -> will try again later", e.getMessage());
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
    logger
        .atLevel(level)
        .log(
            "valid active inbound actors: {}",
            trustedActors.inbound.stream().map(ActorResponseDto::commonName).sorted().toList());
    logger
        .atLevel(level)
        .log(
            "valid active outbound actors: {}",
            trustedActors.outbound.stream().map(ActorResponseDto::commonName).sorted().toList());
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
              .flatMap(a -> Stream.of(a.currentCertificate(), a.previousCertificate()))
              .filter(Objects::nonNull)
              .map(CertificateDto::value)
              .map(X509Utils::parsePem)
              .toList();

      SslBundle newSslBundle =
          sslBundleFactory.buildWithNewDynamicRemoteCertificates(dynamicCertificates);

      sslBundleRegistry.updateBundle(ESHGACTOR_BUNDLE_NAME, newSslBundle);
      logger.info("updated SSL Truststore to reflect changed serviceDirectory topology");
    }
  }
}
