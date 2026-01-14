/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist;

import de.eshg.file.common.CustomMediaTypes;
import de.eshg.inspection.checklist.api.UploadMediaFileRequestDto;
import de.eshg.inspection.checklist.api.update.UpdateChecklistDto;
import de.eshg.inspection.checklist.api.update.UpdateChecklistResponse;
import de.eshg.inspection.checklist.api.update.element.UpdateChecklistAudioDto;
import de.eshg.inspection.checklist.api.update.element.UpdateChecklistElementDto;
import de.eshg.inspection.checklist.api.update.element.UpdateChecklistImageDto;
import de.eshg.inspection.checklist.persistence.Checklist;
import de.eshg.inspection.checklist.persistence.ChecklistSection;
import de.eshg.inspection.checklist.persistence.element.ChecklistAudioElement;
import de.eshg.inspection.checklist.persistence.element.ChecklistElement;
import de.eshg.inspection.checklist.persistence.element.ChecklistImageElement;
import de.eshg.inspection.checklistdefinition.api.ChecklistElementType;
import de.eshg.inspection.common.persistence.MediaFile;
import de.eshg.inspection.common.persistence.MediaFileRepository;
import de.eshg.inspection.inspection.InspectionService;
import de.eshg.inspection.inspection.api.InspectionPhase;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.util.FileUtil;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;
import org.apache.logging.log4j.util.InternalException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MediaFileService {

  private final MediaFileRepository mediaFileRepository;
  private final InspectionService inspectionService;

  @Value("${de.eshg.inspection.checklist.max.image.sidelength}")
  private long maxImageSidelength;

  public MediaFileService(
      MediaFileRepository mediaFileRepository, InspectionService inspectionService) {
    this.mediaFileRepository = mediaFileRepository;
    this.inspectionService = inspectionService;
  }

  UpdateChecklistResponse saveFile(
      MultipartFile file, UploadMediaFileRequestDto uploadMediaFileRequest) {
    Inspection inspection =
        inspectionService.loadInspectionForUpdate(uploadMediaFileRequest.inspectionExternalId());
    if (inspection.getPhase() != InspectionPhase.READY_FOR_EXECUTION
        && inspection.getPhase() != InspectionPhase.EXECUTING) {
      throw new BadRequestException(
          "Uploading image for checklist is not allowed. "
              + "Inspection has to be in phase READY_FOR_EXECUTION or EXECUTING.");
    }

    List<MediaType> allowedMediaTypes =
        getAllowedMediaTypes(uploadMediaFileRequest.updateElementDto());

    MediaFile mediaFile = FileUtil.readFileAndValidate(file, allowedMediaTypes, maxImageSidelength);
    mediaFile.setFileExternalId(uploadMediaFileRequest.fileExternalId());
    MediaFile savedFile = mediaFileRepository.save(mediaFile);
    UpdateChecklistElementDto updateElement =
        linkFileToRequest(uploadMediaFileRequest, savedFile.getFileExternalId());
    return inspectionService.updateChecklist(
        uploadMediaFileRequest.inspectionExternalId(),
        uploadMediaFileRequest.checklistId(),
        new UpdateChecklistDto(List.of(updateElement)));
  }

  private List<MediaType> getAllowedMediaTypes(
      UpdateChecklistElementDto updateChecklistElementDto) {
    switch (updateChecklistElementDto) {
      case UpdateChecklistImageDto ignored -> {
        return List.of(MediaType.IMAGE_JPEG, MediaType.IMAGE_PNG);
      }
      case UpdateChecklistAudioDto ignored -> {
        return List.of(CustomMediaTypes.MEDIA_TYPE_WAV, CustomMediaTypes.MEDIA_TYPE_MP3);
      }
      default ->
          throw new IllegalArgumentException(
              String.format(
                  "Element type %s not supported for file upload",
                  updateChecklistElementDto.getClass()));
    }
  }

  MediaFile load(UUID externalId) {
    Optional<MediaFile> mediaFile = mediaFileRepository.findByFileExternalId(externalId);
    return mediaFile
        .filter(MediaFile::isNotDeleted)
        .orElseThrow(() -> new NotFoundException("Media file with given id was not found"));
  }

  InputStreamResource loadContent(MediaFile mediaFile) {
    try {
      Blob blob = mediaFile.getFileContent().getFile();
      return new BlobInputStreamResource(
          blob.getBinaryStream(), mediaFile.getFileName(), mediaFile.getFileSize());
    } catch (SQLException e) {
      throw new IllegalStateException(e);
    }
  }

  void delete(UUID inspectionExternalId, UUID externalId) {
    MediaFile mediaFile = load(externalId);
    Inspection inspection = inspectionService.loadInspectionForUpdate(inspectionExternalId);

    verifyFileInInspection(externalId, inspection);
    verifyExecutionTaskNotClosed(inspection);

    mediaFile.setDeleted(true);
  }

  private static UpdateChecklistElementDto linkFileToRequest(
      UploadMediaFileRequestDto uploadMediaFileRequest, UUID fileId) {
    UpdateChecklistElementDto updateElement = uploadMediaFileRequest.updateElementDto();
    switch (updateElement) {
      case UpdateChecklistImageDto imageDto -> imageDto.setImageExternalId(fileId);
      case UpdateChecklistAudioDto audioDto -> audioDto.setAudioExternalId(fileId);
      default -> throw new InternalException("Uploaded file type not handled");
    }

    return updateElement;
  }

  private static void verifyFileInInspection(UUID externalId, Inspection inspection) {
    boolean isAttachedAsImage =
        getChecklistElementStream(inspection)
            .filter(element -> element.getType() == ChecklistElementType.IMAGE)
            .map(ChecklistImageElement.class::cast)
            .map(ChecklistImageElement::getImages)
            .flatMap(List::stream)
            .map(imageElement -> imageElement.getImageFile().getFileExternalId())
            .anyMatch(externalId::equals);
    boolean isAttachedAsAudio =
        getChecklistElementStream(inspection)
            .filter(element -> element.getType() == ChecklistElementType.AUDIO)
            .map(ChecklistAudioElement.class::cast)
            .map(ChecklistAudioElement::getAudios)
            .flatMap(List::stream)
            .map(audio -> audio.getAudioFile().getFileExternalId())
            .anyMatch(externalId::equals);
    if (!isAttachedAsImage && !isAttachedAsAudio) {
      throw new BadRequestException("File not found in any checklist of this inspection");
    }
  }

  private static Stream<ChecklistElement> getChecklistElementStream(Inspection inspection) {
    return inspection.getChecklists().stream()
        .map(Checklist::getSections)
        .flatMap(List::stream)
        .map(ChecklistSection::getElements)
        .flatMap(List::stream);
  }

  private static void verifyExecutionTaskNotClosed(Inspection inspection) {
    if (inspection.getExecutionTask().isPresent()
        && inspection.getExecutionTask().get().getTaskStatus() == TaskStatus.CLOSED) {
      throw new BadRequestException(
          "Inspection has already been executed; modification of checklist is not allowed");
    }
  }

  static class BlobInputStreamResource extends InputStreamResource {

    private final long contentLength;

    BlobInputStreamResource(InputStream inputStream, String description, long contentLength) {
      super(inputStream, description);
      this.contentLength = contentLength;
    }

    @Override
    public long contentLength() {
      return contentLength;
    }
  }
}
