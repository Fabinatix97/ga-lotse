/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.file.common;

import static de.eshg.file.common.CustomMediaTypes.MEDIA_TYPE_WAV;
import static de.eshg.file.common.CustomMediaTypes.WAV_MEDIA_TYPE_VALUES_LIST;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

public class FileValidator {

  private static final Logger log = LoggerFactory.getLogger(FileValidator.class);

  public static final Pattern FILE_REGEX_PATTERN =
      Pattern.compile("^([A-Za-z0-9\\-_]+)\\.([A-Za-z0-9]+)$");

  private static final int FILE_NAME_SIZE_MAX = 128;

  private FileValidator() {}

  public static MediaType validate(MultipartFile file) {
    try {
      FileType fileType = FileTypeDetector.getSupportedFileTypeOrThrow(file);
      MediaType detectedMediaType = validateContentType(file.getContentType(), fileType);

      Matcher fileNameMatcher = FILE_REGEX_PATTERN.matcher(file.getOriginalFilename());
      validateFilename(fileNameMatcher);
      validateExtension(fileNameMatcher, fileType);

      return detectedMediaType;
    } catch (final IOException e) {
      log.error("File header was corrupt", e);
      throw new BadRequestException("File header was corrupt");
    }
  }

  public static void validatePdfFile(MultipartFile pdf) throws IOException {
    if (pdf == null) {
      return;
    }

    validate(pdf);
    byte[] bytes = pdf.getBytes();
    if (FileTypeDetector.getSupportedFileTypeOrThrow(bytes) != FileType.PDF) {
      throw new BadRequestException(ErrorCode.INVALID_FILE, "Only PDF files are supported");
    }
    PdfAConformanceValidator.validate(bytes);
  }

  public static void validateCsvFile(MultipartFile csv) throws IOException {
    if (csv == null) {
      return;
    }
    MediaType detected = validate(csv);
    if (!detected.isCompatibleWith(CustomMediaTypes.CSV)) {
      throw new BadRequestException(
          ErrorCode.INVALID_FILE, "Incompatible media type %s detected".formatted(detected));
    }
    byte[] bytes = csv.getBytes();

    CsvValidator.validate(bytes);
  }

  public static MediaType validateAudioFile(MultipartFile file) {
    MediaType detectedMediaType = validateContentTypeAudio(file);
    Matcher fileNameMatcher = FILE_REGEX_PATTERN.matcher(file.getOriginalFilename());
    validateFilename(fileNameMatcher);
    return detectedMediaType;
  }

  public static MediaType validateYamlFile(MultipartFile file) {
    try {
      // Besides application/yaml, we want files of similar media types to be accepted, too.
      FileType fileType = FileTypeDetector.getSupportedFileTypeOrThrow(file);
      if (fileType != FileType.YAML) {
        throw new BadRequestException("Wrong content type " + fileType.getMediaType());
      }

      String fileContentType = file.getContentType();
      if (fileContentType == null) {
        // note: "" is accepted because some browsers fail to determine the type of a local file
        // properly, resulting in a mime type "" in the upload request
        throw new BadRequestException("Missing content-type header");
      }

      Matcher fileNameMatcher = FILE_REGEX_PATTERN.matcher(file.getOriginalFilename());
      validateFilename(fileNameMatcher);
      validateExtension(fileNameMatcher, fileType);

      return fileType.getMediaType();
    } catch (final IOException e) {
      log.error("File header was corrupt", e);
      throw new BadRequestException("File header was corrupt");
    }
  }

  // Alteration of validateContentType because only the Inspection Module provides audio upload
  // therefore no filetype is implemented which, throws an "Unsupported file type" error using the
  // original method.
  private static MediaType validateContentTypeAudio(MultipartFile file) {
    try {
      String detectedContentType = new TikaWrapper().detect(file.getInputStream());
      String fileContentType = file.getContentType();

      if (StringUtils.isBlank(fileContentType)) {
        throw new BadRequestException("Missing content-type header");
      }

      MediaType detectedMediaType = MediaType.parseMediaType(detectedContentType);
      MediaType fileMediaType = MediaType.parseMediaType(fileContentType);

      // WAV files can have different MIME-Type names,
      // if both match the String in the possible values list it is okay
      // if not proceed as normal and throw an error when checking compatibility
      if (WAV_MEDIA_TYPE_VALUES_LIST.contains(detectedMediaType.toString())
          && WAV_MEDIA_TYPE_VALUES_LIST.contains(fileMediaType.toString())) {
        return MEDIA_TYPE_WAV;
      }

      if (!fileMediaType.isCompatibleWith(detectedMediaType)) {
        throw new BadRequestException(
            "Mismatched media type; given in header: \""
                + fileMediaType
                + "\"; detected: \""
                + detectedMediaType
                + "\"");
      }

      return detectedMediaType;
    } catch (final IOException e) {
      log.error("File header was corrupt", e);
      throw new BadRequestException("File header was corrupt");
    }
  }

  private static MediaType validateContentType(String fileContentType, FileType fileType) {
    if (StringUtils.isBlank(fileContentType)) {
      throw new BadRequestException("Missing content-type header");
    }

    MediaType detectedMediaType = fileType.getMediaType();
    MediaType fileMediaType = MediaType.parseMediaType(fileContentType);

    if (!fileMediaType.isCompatibleWith(detectedMediaType)) {
      throw new BadRequestException(
          "Mismatched media type; given in header: \""
              + fileMediaType
              + "\"; detected: \""
              + detectedMediaType
              + "\"");
    }
    return detectedMediaType;
  }

  public static boolean isContentTypeValid(String fileContentType, FileType fileType) {
    if (StringUtils.isBlank(fileContentType)) {
      return false;
    }
    MediaType detectedMediaType = fileType.getMediaType();
    MediaType fileMediaType = MediaType.parseMediaType(fileContentType);
    return fileMediaType.isCompatibleWith(detectedMediaType);
  }

  private static void validateFilename(Matcher fileNameMatcher) {
    if (!fileNameMatcher.matches()) {
      throw new BadRequestException("Invalid file name");
    } else {
      String nameWithoutExtension = fileNameMatcher.group(1);
      if (nameWithoutExtension.length() > FILE_NAME_SIZE_MAX) {
        throw new BadRequestException("File name too long");
      }
    }
  }

  private static void validateExtension(Matcher fileNameMatcher, FileType fileType) {
    String fileExtension = fileNameMatcher.group(2);
    if (!fileType.hasValidFileExtension(fileExtension)) {
      throw new BadRequestException("Invalid file extension");
    }
  }

  public static void validateMarkdownFile(MultipartFile file) {
    if (file == null) {
      return;
    }
    MediaType detected = validate(file);
    if (!detected.isCompatibleWith(MediaType.TEXT_MARKDOWN)) {
      throw new BadRequestException(
          ErrorCode.INVALID_FILE, "Incompatible media type %s detected".formatted(detected));
    }
  }
}
