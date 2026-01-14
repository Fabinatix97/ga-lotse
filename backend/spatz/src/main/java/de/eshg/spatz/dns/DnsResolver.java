/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.dns;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.spatz.config.SpatzConfigurationProperties;
import io.micrometer.common.util.StringUtils;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.xbill.DNS.AAAARecord;
import org.xbill.DNS.ARecord;
import org.xbill.DNS.DClass;
import org.xbill.DNS.EDNSOption;
import org.xbill.DNS.Flags;
import org.xbill.DNS.Message;
import org.xbill.DNS.Name;
import org.xbill.DNS.OPTRecord;
import org.xbill.DNS.Opcode;
import org.xbill.DNS.Rcode;
import org.xbill.DNS.Record;
import org.xbill.DNS.Resolver;
import org.xbill.DNS.ResolverConfig;
import org.xbill.DNS.Section;
import org.xbill.DNS.SimpleResolver;
import org.xbill.DNS.Type;

@Service
public class DnsResolver {

  private static final Logger logger = LoggerFactory.getLogger(DnsResolver.class);

  private final Resolver upstreamResolver;
  private final List<String> forwardRequestAllowList;
  private final int ttl;
  private final SynchronizedRecords records;

  public DnsResolver(SpatzConfigurationProperties spatzConfigProperties) {
    upstreamResolver = getResolver(spatzConfigProperties.dns().upstreamHost());
    forwardRequestAllowList =
        spatzConfigProperties.dns().forwardRequestAllowList().stream()
            .map(String::toLowerCase)
            .toList();
    ttl = spatzConfigProperties.dns().ttl() <= 0 ? 5 : spatzConfigProperties.dns().ttl();
    records =
        new SynchronizedRecords(
            Optional.ofNullable(spatzConfigProperties.dns().staticHosts())
                .orElse(Collections.emptyList()));
  }

  private static Resolver getResolver(String host) {
    if (StringUtils.isBlank(host)) {
      try {
        return new SimpleResolver(
            ResolverConfig.getCurrentConfig().servers().getFirst().getHostString());
      } catch (UnknownHostException e) {
        throw new IllegalArgumentException(e);
      }
    }
    final URI uri;
    try {
      uri = new URI("dns://" + host);
    } catch (URISyntaxException e) {
      throw new IllegalArgumentException(e);
    }
    int port = uri.getPort() < 0 ? SimpleResolver.DEFAULT_PORT : uri.getPort();
    return new SimpleResolver(new InetSocketAddress(uri.getHost(), port));
  }

  public void setLoopBackRecords(Collection<String> hostNames) {
    List<DnsRecord> newRecords =
        hostNames.stream().map(String::toLowerCase).map(DnsRecord::loopBack).toList();
    this.records.setRecords(newRecords);
  }

  public Message resolve(Message request) {
    try {
      return innerResolve(request);
    } catch (Exception e) {
      logger.error("Unexpected error", e);
      return error(request, Rcode.SERVFAIL);
    }
  }

  private Message innerResolve(Message request) throws IOException {
    DnsRecord dnsRecord = records.getRecord(request.getQuestion().getName().toString(true));
    if (dnsRecord == null) {
      return forwardRequest(request, upstreamResolver, forwardRequestAllowList);
    }

    int opCode = request.getHeader().getOpcode();
    if (opCode != Opcode.QUERY) {
      String opCodeToString = Opcode.string(opCode);
      logger.warn("Operation code {} not implemented", opCodeToString);
      return error(request, Rcode.NOTIMP);
    }

    Record question = request.getQuestion();
    if (question == null) {
      logger.warn("Received query without question");
      return error(request, Rcode.FORMERR);
    }

    int dClass = question.getDClass();
    if (dClass != DClass.IN) {
      String classToString = DClass.string(dClass);
      logger.warn("Refusing to answer queries with class {}", classToString);
      return error(request, Rcode.REFUSED);
    }

    return respondWith(request, dnsRecord, ttl);
  }

  private static Message error(Message request, int rCode) {
    Message response = Message.newQuery(request.getQuestion());
    response.getHeader().setRcode(rCode);
    response.getHeader().setID(request.getHeader().getID());
    response.getHeader().setOpcode(request.getHeader().getOpcode());
    response.getHeader().setFlag(Flags.QR);
    response.getHeader().setFlag(Flags.RA);
    if (request.getHeader().getFlag(Flags.RD)) {
      response.getHeader().setFlag(Flags.RD);
    }
    return response;
  }

  private static Message respondWith(Message request, DnsRecord dnsRecord, int ttl) {
    logger.trace("Preparing authoritative response of {}", dnsRecord);
    validateRequest(request);
    int rrType = request.getQuestion().getType();
    Message response = Message.newQuery(request.getQuestion());
    response.getHeader().setID(request.getHeader().getID());
    response.getHeader().setFlag(Flags.QR);
    response.getHeader().setFlag(Flags.AA);
    response.getHeader().setFlag(Flags.RA);
    if (rrType == Type.A || rrType == Type.ANY) {
      response.addRecord(
          new ARecord(getRecordName(dnsRecord), DClass.IN, ttl, dnsRecord.ipv4()), Section.ANSWER);
    }
    if (rrType == Type.AAAA || rrType == Type.ANY) {
      response.addRecord(
          new AAAARecord(getRecordName(dnsRecord), DClass.IN, ttl, dnsRecord.ipv6()),
          Section.ANSWER);
    }
    if (response.getSection(Section.ANSWER).isEmpty()) {
      String typeToString = Type.string(rrType);
      logger.warn("Unhandled resource dnsRecord type: {}", typeToString);
    }
    return response;
  }

  private static Name getRecordName(DnsRecord dnsRecord) {
    return Name.fromConstantString(dnsRecord.name() + ".");
  }

  private static void validateRequest(Message request) {
    if (request.getSection(Section.QUESTION).size() != 1) {
      logger.warn("Ignoring additional records in question section of request");
    }
    if (!request.getSection(Section.ANSWER).isEmpty()) {
      logger.warn("Ignoring records in answer section of request");
    }
    if (!request.getSection(Section.AUTHORITY).isEmpty()) {
      logger.warn("Ignoring records in authority section of request");
    }
    if (!request.getSection(Section.ADDITIONAL).isEmpty()) {
      logger.warn("Ignoring records in additional section of request");
    }
  }

  private static Message forwardRequest(
      Message request, Resolver resolver, List<String> forwardRequestAllowList) throws IOException {
    String name = request.getQuestion().getName().toString(true).toLowerCase();
    if (!forwardRequestAllowList.contains(name)) {
      logger.warn("Refusing to forward query to {} not in allow-list", name);
      return error(request, Rcode.REFUSED);
    }
    logger.trace("Forwarding request to {}", resolver);
    removeCookies(request);
    Message response = resolver.send(request);
    response.getHeader().unsetFlag(Flags.AA);
    response.getHeader().setFlag(Flags.RA);
    removeCookies(response);
    return response;
  }

  private static void removeCookies(Message message) {
    OPTRecord optRecord = message.getOPT();
    if (optRecord != null && (optRecord.getOptions(EDNSOption.Code.COOKIE) != null)) {
      message.removeRecord(optRecord, Section.ADDITIONAL);
      OPTRecord dietOptRecord =
          new OPTRecord(
              optRecord.getPayloadSize(),
              optRecord.getExtendedRcode(),
              optRecord.getVersion(),
              optRecord.getFlags(),
              optRecord.getOptions().stream()
                  .filter(o -> o.getCode() != EDNSOption.Code.COOKIE)
                  .toList());
      message.addRecord(dietOptRecord, Section.ADDITIONAL);
    }
  }

  private static class SynchronizedRecords {
    private final Map<String, DnsRecord> records = new HashMap<>();
    private final Lock recordsLock = new ReentrantLock();
    private final Map<String, DnsRecord> staticRecords;

    public SynchronizedRecords(Collection<String> staticHosts) {
      this.staticRecords =
          staticHosts.stream()
              .map(String::toLowerCase)
              .map(DnsRecord::loopBack)
              .collect(StreamUtil.toLinkedHashMap(DnsRecord::name));
      setRecords(List.of());
    }

    public void setRecords(Collection<DnsRecord> records) {
      recordsLock.lock();
      try {
        this.records.putAll(records.stream().collect(StreamUtil.toLinkedHashMap(DnsRecord::name)));
        Set<String> hostNames = records.stream().map(DnsRecord::name).collect(Collectors.toSet());
        this.records.keySet().removeIf(Predicate.not(hostNames::contains));
        this.records.putAll(staticRecords);
      } finally {
        recordsLock.unlock();
      }
    }

    public DnsRecord getRecord(String name) {
      recordsLock.lock();
      try {
        return records.get(name.toLowerCase());
      } finally {
        recordsLock.unlock();
      }
    }
  }
}
