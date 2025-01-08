/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.dns;

import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.UnknownHostException;

public record DnsRecord(String name, Inet4Address ipv4, Inet6Address ipv6) {
  private static final Inet4Address loopBack4;
  private static final Inet6Address loopBack6;

  static {
    try {
      loopBack4 = (Inet4Address) InetAddress.getByAddress(new byte[] {127, 0, 0, 1});
      loopBack6 =
          (Inet6Address)
              InetAddress.getByAddress(new byte[] {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1});
    } catch (UnknownHostException e) {
      throw new IllegalArgumentException(e);
    }
  }

  public static DnsRecord loopBack(String host) {
    return new DnsRecord(host, loopBack4, loopBack6);
  }
}
