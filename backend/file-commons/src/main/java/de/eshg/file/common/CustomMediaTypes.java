/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.file.common;

import java.util.List;
import org.springframework.http.MediaType;

public class CustomMediaTypes {
  private CustomMediaTypes() {}

  public static final String IMAGE_SVG_XML_VALUE = "image/svg+xml";
  public static final MediaType IMAGE_SVG_XML = MediaType.valueOf(IMAGE_SVG_XML_VALUE);

  public static final String EML_VALUE = "message/rfc822";
  public static final MediaType EML = MediaType.valueOf(EML_VALUE);

  public static final String ZIP_VALUE = "application/zip";
  public static final MediaType ZIP = MediaType.valueOf(ZIP_VALUE);

  public static final String TEXT_PLAIN_UTF_8_VALUE = "text/plain;charset=utf-8";
  public static final MediaType TEXT_PLAIN_UTF_8 = MediaType.valueOf(TEXT_PLAIN_UTF_8_VALUE);

  public static final String APPLICATION_XLSX_VALUE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  public static final MediaType APPLICATION_XLSX = MediaType.valueOf(APPLICATION_XLSX_VALUE);

  public static final String MEDIA_TYPE_WAV_VND_VALUE = "audio/vnd.wav";
  public static final MediaType MEDIA_TYPE_VND_WAV =
      MediaType.parseMediaType(MEDIA_TYPE_WAV_VND_VALUE);
  public static final MediaType MEDIA_TYPE_WAV = MediaType.parseMediaType("audio/wav");
  public static final MediaType MEDIA_TYPE_WAVE = MediaType.parseMediaType("audio/wave");
  public static final MediaType MEDIA_TYPE_VND_WAVE = MediaType.parseMediaType("audio/vnd.wave");
  public static final MediaType MEDIA_TYPE_X_PN_WAV = MediaType.parseMediaType("audio/x-pn-wav");
  public static final MediaType MEDIA_TYPE_X_WAV = MediaType.parseMediaType("audio/x-wav");
  public static final List<String> WAV_MEDIA_TYPE_VALUES_LIST =
      List.of(
          MEDIA_TYPE_VND_WAV.toString(),
          MEDIA_TYPE_WAV.toString(),
          MEDIA_TYPE_WAVE.toString(),
          MEDIA_TYPE_VND_WAVE.toString(),
          MEDIA_TYPE_X_PN_WAV.toString(),
          MEDIA_TYPE_X_WAV.toString());

  public static final String MEDIA_TYPE_MP3_VALUE = "audio/mpeg";
  public static final MediaType MEDIA_TYPE_MP3 = MediaType.parseMediaType(MEDIA_TYPE_MP3_VALUE);

  public static final String CSV_VALUE = "text/csv";
  public static final MediaType CSV = MediaType.valueOf(CSV_VALUE);
}
