/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.document.generator.util;

import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class DesktopUtil {
  private static final Logger log = LoggerFactory.getLogger(DesktopUtil.class);

  private DesktopUtil() {
    // utils class
  }

  public static boolean isWindows() {
    return System.getProperty("os.name").toLowerCase().contains("windows");
  }

  public static boolean isLinux() {
    return System.getProperty("os.name").toLowerCase().contains("linux");
  }

  public static boolean isMac() {
    return System.getProperty("os.name").toLowerCase().contains("mac");
  }

  /**
   * Tries to open the file with the default application of the operating system.
   *
   * <p>The method tries the following, in order:
   *
   * <ol>
   *   <li>If the filename has extension ".xxx" and the environment variable {@code XXX_OPEN_WITH}
   *       exists, then launch the command {@code "${XXX_OPEN_WITH}" "<file>"}.<br>
   *       For example, if the file has the filename "foo.pdf" and the environment variable {@code
   *       PDF_OPEN_WITH} has value {@code "C:\Program Files\SumatraPDF\sumatra.exe"}, then the
   *       method will execute the command {@code "C:\Program Files\SumatraPDF\sumatra.exe"
   *       "foo.pdf"}.
   *   <li>Otherwise, if {@link Desktop#isDesktopSupported()} then it tries to open the file with
   *       the associated default application using {@link Desktop#open(File)}.
   *   <li>If that fails, then the method falls back to various other methods, depending on the
   *       operating system:
   *       <ul>
   *         <li>for Windows: {@code rundll32 url.dll,FileProtocolHandler <file>}
   *         <li>for Linux: {@code xdg-open <file>}
   *         <li>for MacOS: {@code open <file>}
   *       </ul>
   * </ol>
   *
   * @param file the file to open
   */
  public static void openWithDefaultApplication(File file) {
    if (hasOpenWithEnvvarForFile(file)) {
      openWithConfiguredApplication(file);
    } else if (Desktop.isDesktopSupported()
        && Desktop.getDesktop().isSupported(Desktop.Action.OPEN)) {
      try {
        Desktop.getDesktop().open(file);
      } catch (IOException | UnsupportedOperationException e) {
        openWithDefaultApplicationFallback(file);
      }
    } else {
      openWithDefaultApplicationFallback(file);
    }
  }

  private static boolean hasOpenWithEnvvarForFile(File file) {
    return getOpenWithEnvvarForFile(file) != null;
  }

  private static String getOpenWithEnvvarForFile(File file) {
    String envvar = getFileExtension(file).toUpperCase(Locale.ROOT) + "_OPEN_WITH";
    return System.getenv(envvar);
  }

  private static void openWithConfiguredApplication(File file) {
    String openWithCommand = getOpenWithEnvvarForFile(file);
    exec(openWithCommand, file.getAbsolutePath());
  }

  private static void openWithDefaultApplicationFallback(File file) {
    if (isWindows()) {
      openWithDefaultApplicationWindows(file);
    } else if (isLinux()) {
      openWithDefaultApplicationLinux(file);
    } else if (isMac()) {
      openWithDefaultApplicationMac(file);
    } else {
      throw new UnsupportedOperationException("unsupported OS: " + System.getProperty("os.name"));
    }
  }

  private static void openWithDefaultApplicationWindows(File file) {
    exec("rundll32", "url.dll,FileProtocolHandler", file.getAbsolutePath());
  }

  private static void openWithDefaultApplicationLinux(File file) {
    exec("xdg-open", file.getAbsolutePath());
  }

  private static void openWithDefaultApplicationMac(File file) {
    exec("/usr/bin/open", file.getAbsolutePath());
  }

  private static void exec(String... args) {
    try {
      log.debug("Starting {} ...", String.join(" ", args));
      Runtime.getRuntime().exec(args);
    } catch (IOException e) {
      throw new RuntimeException("error starting: " + Arrays.toString(args), e);
    }
  }

  private static String getFileExtension(File file) {
    int idx = file.getName().lastIndexOf('.');
    return idx >= 0 ? file.getName().substring(idx + 1) : "";
  }
}
