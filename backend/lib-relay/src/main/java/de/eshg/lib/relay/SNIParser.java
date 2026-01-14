/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.relay;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Serial;
import java.io.StringReader;
import java.nio.BufferUnderflowException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SNIParser {

  private static final Logger logger = LoggerFactory.getLogger(SNIParser.class);
  public static final int CONTENT_TYPE_HANDSHAKE = 22;
  private static final int CONTENT_TYPE_SSLV2_CLIENTHELLO = 1;
  private static final int HANDSHAKE_TYPE_CLIENTHELLO = 1;
  private static final int EXTENSION_SNI = 0;
  private static final byte EXTENSION_SNI_SERVER_NAME_TYPE_HOST_NAME = 0;
  private final ByteBuffer buffer;

  public SNIParser(ByteBuffer buffer) {
    this.buffer = buffer;
  }

  private void skip(int count) {
    buffer.position(buffer.position() + count);
  }

  /**
   * Reads SNI from data _without_ altering the ByteBuffer. Expects HTTP Header or TLS SNI extension
   */
  public String parse() {
    String sni = parseTLS();
    if (sni == null) {
      return parseHTML();
    } else {
      return sni;
    }
  }

  /**
   * Reads SNI from data _without_ altering the ByteBuffer. Expects HTTP Header or TLS SNI extension
   */
  public String parseHTML() {
    ByteBuffer data = this.buffer.duplicate();
    try (BufferedReader in =
        new BufferedReader(new StringReader(new String(data.array(), StandardCharsets.UTF_8)))) {
      String s = in.readLine();
      if (s == null) {
        logger.debug("not enough data to parse HTTP header: Could not read header line");
        return null;
      }
      String hostString = null;
      while ((s = in.readLine()) != null) {
        if (hostString
            != null) { // must have at least one line _after_ host-line to ensure host-line is
          // complete
          return hostString;
        }
        if (s.startsWith("Host: ")) {
          hostString = s.substring("Host: ".length());
          int colonIndex = hostString.indexOf(':');
          if (colonIndex > -1) {
            hostString = hostString.substring(0, colonIndex);
          }
        }
      }
      logger.debug("not enough data to parse HTTP header: Could not find header line 'Host'");
      return null;
    } catch (IOException e) {
      logger.debug("error while parsing HTML: {}", e.toString());
      return null;
    }
  }

  /** parses SNI host_name from TLS Handshake _without_ modifying the buffer */
  public String parseTLS() {
    buffer.mark();
    try {
      if (hasInvalidRecordSize()) return null;

      int handshakeType = buffer.get();
      if (handshakeType != HANDSHAKE_TYPE_CLIENTHELLO) {
        return null;
      }
      skip(3); // length
      skip(2); // version
      skip(32); // random data
      skip(buffer.get()); // sessionIdLength
      skip(buffer.getShort()); // cipherSuitsLength
      skip(buffer.get()); // compressionLength

      skip(2); // extensionsLength
      while (buffer.remaining() > 4) {
        int extensionType = buffer.getShort();
        int extensionLength = buffer.getShort();

        if (extensionType == EXTENSION_SNI) {
          buffer.getShort();
          int serverNameType = buffer.get();
          if (serverNameType == EXTENSION_SNI_SERVER_NAME_TYPE_HOST_NAME) { // host_name
            int serverNameLength = buffer.getShort();
            byte[] b = new byte[serverNameLength];
            buffer.get(b);
            return new String(b);
          } else {
            throw new SNIParserException(
                "not implemented: SNI Extension with serverNameType " + serverNameType);
          }
        } else {
          skip(extensionLength);
        }
      }
      return null;
    } catch (BufferUnderflowException e) {
      return null;
    } finally {
      buffer.reset();
    }
  }

  private boolean hasInvalidRecordSize() {
    int contentType = buffer.get();
    if (contentType == CONTENT_TYPE_HANDSHAKE) {
      skip(2); // Version
      int recordSize = buffer.getShort(); // Length
      return buffer.remaining() < recordSize;
    } else if (contentType == CONTENT_TYPE_SSLV2_CLIENTHELLO) {
      int len = buffer.get();
      int recordSize = ((contentType & 0x7f) << 8 | len);
      return buffer.remaining() < recordSize;
    } else {
      return true;
    }
  }

  /**
   * _modifyingly_ reads the SNI, followed by a zero-byte from a buffer, returning only the SNI as a
   * {@link String}
   */
  public static String readSNI(ByteBuffer data) throws IOException {
    int i = data.position();
    while (data.hasRemaining()) {
      if (data.get() == 0) {
        byte[] b = new byte[data.position() - i - 1];
        data.get(i, b);
        return new String(b, StandardCharsets.UTF_8);
      }
    }
    throw new IOException("cannot read SNI: NULL byte missing");
  }

  private static class SNIParserException extends RuntimeException {
    @Serial private static final long serialVersionUID = 0;

    public SNIParserException(String s) {
      super(s);
    }
  }
}
