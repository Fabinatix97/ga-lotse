/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.controller;

import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.centralrepository.exception.CentralRepositoryIOException;
import de.eshg.centralrepository.exception.ManualValidationException;
import de.eshg.centralrepository.persistence.entity.IdVersionPK;
import de.eshg.centralrepository.service.VersionedEntryService;
import de.eshg.lib.centralrepository.VersionedEntryApi;
import de.eshg.lib.centralrepository.api.*;
import de.eshg.rest.service.error.BadRequestException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.util.function.BiFunction;
import org.apache.commons.fileupload2.core.AbstractFileUpload;
import org.apache.commons.fileupload2.core.DiskFileItem;
import org.apache.commons.fileupload2.core.DiskFileItemFactory;
import org.apache.commons.fileupload2.core.FileItemHeaders;
import org.apache.commons.fileupload2.core.FileItemInput;
import org.apache.commons.fileupload2.core.FileItemInputIterator;
import org.apache.commons.fileupload2.jakarta.servlet6.JakartaServletFileUpload;
import org.apache.commons.fileupload2.jakarta.servlet6.JakartaServletRequestContext;
import org.hibernate.engine.jdbc.BlobProxy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.DirectFieldBindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@RestController
@Tag(name = "CentralRepository")
public class CentralRepositoryController implements VersionedEntryApi {

  private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

  private final VersionedEntryService versionedEntryService;
  private final Validator validator;

  public CentralRepositoryController(
      VersionedEntryService versionedEntryService, Validator validator) {
    this.versionedEntryService = versionedEntryService;
    this.validator = validator;
  }

  @Override
  public ResponseEntity<StreamingResponseBody> getContentOfOneVersion(
      String moduleName, String objectName, Long id, Integer version) {
    IdVersionPK pk = new IdVersionPK(id, version);

    String contentType = versionedEntryService.getContentType(moduleName, objectName, pk);
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.parseMediaType(contentType));

    StreamingResponseBody body = out -> versionedEntryService.transferContentTo(pk, out);
    return new ResponseEntity<>(body, headers, HttpStatus.OK);
  }

  @Override
  public MetadataResponseDto getMetadataOfOneVersion(
      String moduleName, String objectName, Long id, Integer version) {
    IdVersionPK pk = new IdVersionPK(id, version);
    return versionedEntryService.getMetadata(moduleName, objectName, pk);
  }

  @Override
  public MetadataListResponseDto getMetadataOfVersionsWithId(
      String moduleName, String objectName, Long id, VersionFilterType versions, boolean deleted) {
    return new MetadataListResponseDto(
        versionedEntryService.getMetadataOfVersionsWithId(
            moduleName, objectName, id, versions, deleted));
  }

  @Override
  public MetadataListResponseDto getMetadataOfVersionsWithModuleAndObjectName(
      String moduleName,
      String objectName,
      VersionFilterType versions,
      boolean deleted,
      String tags,
      String category) {
    if (objectName.equals("*")) {
      objectName = null; // null values will be ignored in the query
    }

    return new MetadataListResponseDto(
        versionedEntryService.getMetadataOfVersions(
            moduleName, objectName, versions, tags, category, deleted));
  }

  @Override
  public MetadataResponseDto createEntry(
      String moduleName, String objectName, HttpServletRequest servletRequest) {
    return parseMultiPartAndDo(
        servletRequest,
        (metadata, content) ->
            versionedEntryService.createEntry(moduleName, objectName, metadata, content));
  }

  private MetadataResponseDto parseMultiPartAndDo(
      HttpServletRequest servletRequest,
      BiFunction<MetadataRequestDto, ContentRequestDto, MetadataResponseDto>
          handleMetadataAndContent) {
    verifyIsMultiPart(servletRequest);

    JakartaServletFileUpload<DiskFileItem, DiskFileItemFactory> upload =
        new JakartaServletFileUpload<>();

    try {
      FileItemInputIterator iterator = upload.getItemIterator(servletRequest);

      MetadataRequestDto metadata = getMetadata(iterator);
      validate(metadata);

      ContentRequestDto content = getContent(iterator);

      return handleMetadataAndContent.apply(metadata, content);
    } catch (IOException e) {
      throw new CentralRepositoryIOException();
    }
  }

  private void validate(MetadataRequestDto metadata) {
    DirectFieldBindingResult directFieldBindingResult =
        new DirectFieldBindingResult(metadata, "metadataPart");
    validator.validate(metadata, directFieldBindingResult);
    if (directFieldBindingResult.hasErrors()) {
      throw new ManualValidationException(directFieldBindingResult);
    }
  }

  private static void verifyIsMultiPart(HttpServletRequest request) {
    if (!isMultipartRequest(request)) {
      throw new BadRequestException("only multi part is allowed");
    }
  }

  private static boolean isMultipartRequest(HttpServletRequest request) {
    // We can't use JakartaServletFileUpload.isMultipartContent because it assumes and checks
    // that a multipart request is a POST request
    return AbstractFileUpload.isMultipartContent(new JakartaServletRequestContext(request));
  }

  private static ContentRequestDto getContent(FileItemInputIterator iterator) throws IOException {
    verifyHasEnoughParts(iterator);

    FileItemInput contentItem = iterator.next();
    String contentType = contentItem.getContentType();

    if (MediaType.APPLICATION_JSON_VALUE.equals(contentType)) {
      String json = new String(contentItem.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
      return new ContentRequestDto(contentType, json, null);
    } else {
      int contentLength = getContentLength(contentItem);
      Blob blob = BlobProxy.generateProxy(contentItem.getInputStream(), contentLength);
      return new ContentRequestDto(contentType, null, blob);
    }
  }

  private static int getContentLength(FileItemInput contentItem) {
    FileItemHeaders headers = contentItem.getHeaders();
    if (headers == null) {
      return -1;
    }

    String contentLengthStr = headers.getHeader(HttpHeaders.CONTENT_LENGTH);
    if (contentLengthStr == null) {
      // we don't know the length, so we return -1, as that results in a Blob with unknown length
      return -1;
    }

    try {
      int result = Integer.parseInt(contentLengthStr);
      if (result <= 0) {
        return -1;
      }
      return result;
    } catch (NumberFormatException e) {
      return -1;
    }
  }

  private static void verifyHasEnoughParts(FileItemInputIterator iterator) throws IOException {
    if (!iterator.hasNext()) {
      throw new BadRequestException("requires exactly two items in the multi part request");
    }
  }

  private static MetadataRequestDto getMetadata(FileItemInputIterator iterator) throws IOException {
    verifyHasEnoughParts(iterator);

    FileItemInput metadataItem = iterator.next();
    if (!metadataItem.getContentType().contains(MediaType.APPLICATION_JSON_VALUE)) {
      throw new BadRequestException("only application/json is allowed for metadata");
    }

    try {
      return OBJECT_MAPPER.readValue(metadataItem.getInputStream(), MetadataRequestDto.class);
    } catch (DatabindException e) {
      e.clearLocation();
      throw new BadRequestException(e.getMessage());
    }
  }

  @Override
  public MetadataResponseDto createNewVersionForEntry(
      String moduleName,
      String objectName,
      Long id,
      Integer basedOnVersion,
      HttpServletRequest servletRequest) {
    return parseMultiPartAndDo(
        servletRequest,
        (metadata, content) ->
            versionedEntryService.createNewVersionOfEntry(
                moduleName, objectName, id, basedOnVersion, metadata, content));
  }

  @Override
  public MetadataResponseDto createNewVersionOnlyChangeMetadataForEntry(
      String moduleName,
      String objectName,
      Long id,
      Integer basedOnVersion,
      MetadataRequestDto metadata) {
    return versionedEntryService.createNewVersionOnlyChangingMetadataOfEntry(
        moduleName, objectName, id, basedOnVersion, metadata);
  }

  @Override
  public void setEntryAsDeleted(String moduleName, String objectName, Long id) {
    versionedEntryService.setEntryAsDeleted(moduleName, objectName, id);
  }

  @Override
  public void setOneVersionOfAnEntryAsDeleted(
      String moduleName, String objectName, Long id, Integer version) {
    versionedEntryService.setOneVersionOfAnEntryAsDeleted(moduleName, objectName, id, version);
  }
}
