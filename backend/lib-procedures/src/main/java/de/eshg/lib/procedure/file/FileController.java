/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import de.eshg.lib.foureyes.mapping.ApprovalRequestMapper;
import de.eshg.lib.foureyes.model.ApprovalRequestDto;
import de.eshg.lib.foureyes.model.CreateApprovalRequestRequest;
import de.eshg.lib.procedure.api.FileApi;
import de.eshg.lib.procedure.audit.AuditService;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.FileContent;
import de.eshg.lib.procedure.domain.model.FileDeletionApprovalRequest;
import de.eshg.lib.procedure.domain.model.MetaData;
import de.eshg.lib.procedure.mapping.FileMapper;
import de.eshg.lib.procedure.model.ConcreteFileDto;
import de.eshg.lib.procedure.model.GetMetaDataHistoryResponse;
import de.eshg.lib.procedure.model.MetaDataDto;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import org.hibernate.Hibernate;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "File")
public class FileController implements FileApi {

  private final FileStorageService fileStorageService;
  private final AuditService auditService;
  private final ApprovalRequestMapper approvalRequestMapper;

  public FileController(
      FileStorageService fileStorageService,
      AuditService auditService,
      ApprovalRequestMapper approvalRequestMapper) {
    this.fileStorageService = fileStorageService;
    this.auditService = auditService;
    this.approvalRequestMapper = approvalRequestMapper;
  }

  @Override
  @Transactional(readOnly = true)
  public ConcreteFileDto getFile(UUID fileId) {
    File file = fileStorageService.findFileOrThrow(fileId);
    return FileMapper.toInterfaceType(file);
  }

  @Override
  @Transactional
  public ConcreteFileDto updateFileMetaData(UUID fileId, MetaDataDto metaData) {
    MetaData domainMetaData = FileMapper.toDomainType(metaData);
    File file = fileStorageService.updateFileMetaData(fileId, domainMetaData);
    return FileMapper.toInterfaceType(file);
  }

  @Override
  @Transactional(readOnly = true)
  public GetMetaDataHistoryResponse getMetaDataHistory(UUID fileId) {
    File file = fileStorageService.findFileOrThrow(fileId);

    MetaData metaData = file.getMetaData();
    Class<? extends MetaData> metaDataClass = Hibernate.getClass(metaData);
    return new GetMetaDataHistoryResponse(
        auditService.getRevisionsOfEntity(metaDataClass, metaData.getId()).stream()
            .map(FileMapper::toInterfaceType)
            .toList());
  }

  @Override
  @Transactional
  public void deleteFile(UUID fileId) {
    fileStorageService.deleteFile(fileId);
  }

  @Override
  @Transactional(readOnly = true)
  public ResponseEntity<byte[]> downloadFile(UUID fileId) {
    FileContent fileContent = fileStorageService.getFileContent(fileId);
    File file = fileContent.getFile();
    ContentDisposition contentDisposition =
        ContentDisposition.attachment()
            .filename(file.getFileName(), StandardCharsets.UTF_8)
            .build();
    return ResponseEntity.ok()
        .contentType(file.getFileType().getMediaType())
        .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
        .body(fileContent.getContent());
  }

  @Override
  @Transactional
  public ApprovalRequestDto requestFileDeletion(
      UUID fileId, CreateApprovalRequestRequest createApprovalRequestRequest) {
    FileDeletionApprovalRequest fileDeletionApprovalRequest =
        fileStorageService.requestFileDeletion(fileId, createApprovalRequestRequest.reason());
    return approvalRequestMapper.toInterfaceType(fileDeletionApprovalRequest);
  }
}
