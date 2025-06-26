/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.file.common;

import java.io.IOException;
import java.io.InputStream;
import org.apache.tika.Tika;

/**
 * Please remove once Tika returns the correct content types for markdown files and yaml files (see
 * also <a href="https://github.com/plone/Products.CMFPlone/issues/2248">here</a>)
 */
public class TikaWrapper {

  private final Tika tika = new Tika();

  public String detect(byte[] fileContent) {
    return correctContentType(tika.detect(fileContent));
  }

  public String detect(InputStream inputStream) throws IOException {
    return correctContentType(tika.detect(inputStream));
  }

  public String detect(InputStream inputStream, String originalFilename) throws IOException {
    return correctContentType(tika.detect(inputStream, originalFilename));
  }

  private String correctContentType(String contentType) {
    if ("text/x-web-markdown".equals(contentType)) {
      return "text/markdown";
    } else if ("text/x-yaml".equals(contentType)) {
      return "application/yaml";
    } else {
      return contentType;
    }
  }
}
