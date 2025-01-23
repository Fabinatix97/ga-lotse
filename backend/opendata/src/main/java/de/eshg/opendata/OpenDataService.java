/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata;

import de.eshg.file.common.FileTypeDetector;
import de.eshg.file.common.FileValidator;
import de.eshg.file.common.PdfAConformanceValidator;
import de.eshg.opendata.api.PostOpenDocumentRequest;
import de.eshg.opendata.api.ResourceDto;
import de.eshg.opendata.api.UpdateVersionMetaDataRequest;
import de.eshg.opendata.api.VersionDto;
import de.eshg.opendata.config.OpenDataProperties;
import de.eshg.opendata.domain.model.FileContent;
import de.eshg.opendata.domain.model.OpenDataFileType;
import de.eshg.opendata.domain.model.Resource;
import de.eshg.opendata.domain.model.Version;
import de.eshg.opendata.domain.repository.ResourceRepository;
import de.eshg.opendata.domain.repository.VersionRepository;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class OpenDataService {

  private static final Logger log = LoggerFactory.getLogger(OpenDataService.class);

  private final ResourceRepository resourceRepository;
  private final VersionRepository versionRepository;
  private final Clock clock;
  private final OpenDataProperties openDataProperties;

  public OpenDataService(
      ResourceRepository resourceRepository,
      VersionRepository versionRepository,
      Clock clock,
      OpenDataProperties openDataProperties) {
    this.resourceRepository = resourceRepository;
    this.versionRepository = versionRepository;
    this.clock = clock;
    this.openDataProperties = openDataProperties;
  }

  public VersionDto getSpecificVersion(UUID versionId) {
    Version version = getVersionByExternalIdOrThrow(versionId);
    return OpenDataMapper.toInterfaceType(version);
  }

  public ResponseEntity<byte[]> downloadDocument(UUID versionId) {
    Version version = getVersionByExternalIdOrThrow(versionId);
    ContentDisposition contentDisposition =
        ContentDisposition.attachment()
            .filename(version.getFileName(), StandardCharsets.UTF_8)
            .build();
    return ResponseEntity.ok()
        .contentType(version.getFileType().getCommonFileType().getMediaType())
        .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
        .body(version.getDocument().getContent());
  }

  public void updateVersionMetadata(UUID versionId, UpdateVersionMetaDataRequest updateRequest) {
    Version version = getVersionForUpdateOrThrow(versionId, updateRequest.version());
    validateNewFileNameExtension(updateRequest.fileName(), version);
    validateStatisticsDates(updateRequest.statisticStartDate(), updateRequest.statisticEndDate());

    version.setVersionName(updateRequest.versionName());
    version.setFileName(updateRequest.fileName());
    version.setDescription(updateRequest.description());
    version.setLicence(updateRequest.licence());
    version.setSources(updateRequest.sources());
    version.setStatisticStartDate(updateRequest.statisticStartDate());
    version.setStatisticEndDate(updateRequest.statisticEndDate());
  }

  public void deleteVersion(UUID versionId) {
    Version version = getVersionByExternalIdOrThrow(versionId);
    Resource correlatingResource = version.getResource();

    if (correlatingResource.getVersions().size() == 1) {
      resourceRepository.delete(correlatingResource);
    } else {
      correlatingResource.getVersions().remove(version);
    }
  }

  public ResourceDto createOpenDocument(PostOpenDocumentRequest postRequest, MultipartFile file) {
    validateStatisticsDates(postRequest.statisticStartDate(), postRequest.statisticEndDate());
    OpenDataFileType fileType = getFileTypeAndValidateFile(file);

    Resource correlatingResource =
        Optional.ofNullable(postRequest.resourceName())
            .map(this::findOrCreateResource)
            .orElseGet(() -> createResource(UUID.randomUUID().toString()));

    Version version = new Version();

    version.setStatisticStartDate(postRequest.statisticStartDate());
    version.setStatisticEndDate(postRequest.statisticEndDate());
    version.setSources(postRequest.sources());
    version.setAuthor(openDataProperties.getAuthor());
    version.setDescription(postRequest.description());
    version.setPublicationDate(Instant.now(clock));
    version.setVersionName(postRequest.versionName());
    version.setFileName(file.getOriginalFilename());

    FileContent fileContent = new FileContent();
    byte[] fileContentBytes = getBytes(file);
    fileContent.setContent(fileContentBytes);
    version.setDocument(fileContent);
    version.setFileSize(fileContentBytes.length);

    version.setFileType(fileType);
    version.setLicence(postRequest.licence());
    version.setMajor(calculateNextMajorVersion(correlatingResource, version));
    version.setMinor(calculateNextMinorVersion(correlatingResource, version));

    correlatingResource.addVersion(version);
    versionRepository.flush();

    return OpenDataMapper.toInterfaceType(correlatingResource);
  }

  private Resource findOrCreateResource(String resourceName) {
    return resourceRepository
        .findByResourceNameFetchingVersions(resourceName)
        .orElseGet(() -> createResource(resourceName));
  }

  private byte[] getBytes(MultipartFile file) {
    try {
      return file.getBytes();
    } catch (IOException e) {
      log.error("Corrupt file content", e);
      throw new BadRequestException("Corrupt file content");
    }
  }

  private OpenDataFileType getFileTypeAndValidateFile(MultipartFile file) {
    try {
      FileValidator.validate(file);
      OpenDataFileType fileType =
          OpenDataMapper.mapToOpenDataFileType(FileTypeDetector.getSupportedFileTypeOrThrow(file));

      if (fileType.equals(OpenDataFileType.PDF)) {
        PdfAConformanceValidator.validate(file.getBytes());
      }
      return fileType;
    } catch (IOException e) {
      log.error("File header was corrupt", e);
      throw new BadRequestException("File header was corrupt");
    }
  }

  private Resource createResource(String resourceName) {
    Resource resource = new Resource();
    resource.setResourceName(resourceName);
    return resourceRepository.save(resource);
  }

  private Version getVersionByExternalIdOrThrow(UUID versionId) {
    return versionRepository
        .findByExternalId(versionId)
        .orElseThrow(() -> new NotFoundException("Version not found"));
  }

  public int calculateNextMajorVersion(Resource resource, Version version) {
    List<Version> versionsWithSameMajor = getSameMajorVersions(resource, version);
    if (versionsWithSameMajor.isEmpty()) {
      return resource.getVersions().stream()
          .mapToInt(Version::getMajor)
          .map(major -> major + 1)
          .max()
          .orElse(1);
    } else {
      return versionsWithSameMajor.getFirst().getMajor();
    }
  }

  public int calculateNextMinorVersion(Resource resource, Version version) {
    List<Version> versionsWithSameMajor = getSameMajorVersions(resource, version);
    if (versionsWithSameMajor.isEmpty()) {
      return 0;
    } else {
      return versionsWithSameMajor.stream().mapToInt(Version::getMinor).max().getAsInt() + 1;
    }
  }

  private List<Version> getSameMajorVersions(Resource resource, Version version) {
    return resource.getVersions().stream()
        .filter(entry -> hasTheSameTimeframe(version, entry))
        .toList();
  }

  private boolean hasTheSameTimeframe(Version version, Version entry) {
    return Objects.equals(entry.getStatisticStartDate(), version.getStatisticStartDate())
        && Objects.equals(entry.getStatisticEndDate(), version.getStatisticEndDate());
  }

  private void validateStatisticsDates(LocalDate start, LocalDate end) {
    if ((start != null && end == null) || (start == null && end != null)) {
      throw new BadRequestException("Both date fields must be either set together or not at all.");
    }

    if (end != null && end.isBefore(start)) {
      throw new BadRequestException("StatisticEndDate is before StatisticStartDate.");
    }
  }

  private void validateNewFileNameExtension(String newFileName, Version version) {
    String currentExtension = FilenameUtils.getExtension(version.getFileName());
    String newExtension = FilenameUtils.getExtension(newFileName);
    if (!Objects.equals(currentExtension, newExtension)) {
      throw new BadRequestException("It is forbidden to change or remove the file extension");
    }
  }

  private Version getVersionForUpdateOrThrow(UUID versionId, Long entityVersion) {
    Version version =
        versionRepository
            .findByExternalIdForUpdate(versionId)
            .orElseThrow(() -> new NotFoundException("Version not found"));
    ValidationUtil.validateVersion(entityVersion, version);
    return version;
  }
}
