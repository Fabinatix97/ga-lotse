/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.logging;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.spi.IThrowableProxy;
import org.apache.commons.lang3.StringUtils;

record RenderingLoggingEvent(ILoggingEvent event, RenderingOptions options) {

  private static final String INFIX = " ";

  String getPrefix() {
    String prefix = "";

    if (options.includeLoggerName()) {
      prefix +=
          ("[%" + options.loggerNameLength() + "s]")
              .formatted(StringUtils.right(event.getLoggerName(), options.loggerNameLength()));
    }
    if (options.includeLogLevel()) {
      prefix += " [%-5s]".formatted(event.getLevel());
    }
    if (!event.getMDCPropertyMap().isEmpty()) {
      prefix += " " + event.getMDCPropertyMap();
    }
    return prefix;
  }

  int getPrefixLength() {
    return getPrefix().length();
  }

  private String getFormattedMessage(int padPrefix) {
    String prefixPadding = StringUtils.repeat(' ', padPrefix + INFIX.length());
    return event().getFormattedMessage().replace("\n", "\n" + prefixPadding).trim()
        + getException(prefixPadding.length());
  }

  private String getException(int prefixPaddingLength) {
    IThrowableProxy throwable = event().getThrowableProxy();
    if (throwable == null) {
      return "";
    }
    return formatThrowable(prefixPaddingLength, "", throwable);
  }

  private static String formatThrowable(
      int prefixPaddingLength, String prefix, IThrowableProxy throwable) {
    String exceptionName =
        StringUtils.right(throwable.getClassName() + ": ", prefixPaddingLength - prefix.length());
    String message =
        "\n"
            + StringUtils.leftPad(prefix + exceptionName, prefixPaddingLength, ' ')
            + throwable.getMessage();
    if (throwable.getCause() != null) {
      return message + formatThrowable(prefixPaddingLength, "Caused by: ", throwable.getCause());
    }
    return message;
  }

  String render(int padPrefix) {
    return StringUtils.rightPad(getPrefix(), padPrefix) + INFIX + getFormattedMessage(padPrefix);
  }
}
