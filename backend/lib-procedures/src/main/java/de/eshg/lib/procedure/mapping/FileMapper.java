/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.mapping;

import de.eshg.domain.model.audit.DefaultRevisionEntity;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.Image;
import de.eshg.lib.procedure.domain.model.ImageMetaData;
import de.eshg.lib.procedure.domain.model.Mail;
import de.eshg.lib.procedure.domain.model.MailMetaData;
import de.eshg.lib.procedure.domain.model.MetaData;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PdfMetaData;
import de.eshg.lib.procedure.domain.model.ProcedureFileType;
import de.eshg.lib.procedure.model.AbstractFileDto;
import de.eshg.lib.procedure.model.ConcreteFileDto;
import de.eshg.lib.procedure.model.ConcreteFileOrFileReference;
import de.eshg.lib.procedure.model.FileTypeDto;
import de.eshg.lib.procedure.model.GenericFileDto;
import de.eshg.lib.procedure.model.GenericFileReferenceDto;
import de.eshg.lib.procedure.model.ImageDto;
import de.eshg.lib.procedure.model.ImageMetaDataDto;
import de.eshg.lib.procedure.model.ImageMetaDataHistoryDto;
import de.eshg.lib.procedure.model.MailDto;
import de.eshg.lib.procedure.model.MailMetaDataDto;
import de.eshg.lib.procedure.model.MailMetaDataHistoryDto;
import de.eshg.lib.procedure.model.MetaDataDto;
import de.eshg.lib.procedure.model.MetaDataHistoryDto;
import de.eshg.lib.procedure.model.PdfDto;
import de.eshg.lib.procedure.model.PdfMetaDataDto;
import de.eshg.lib.procedure.model.PdfMetaDataHistoryDto;
import de.eshg.lib.procedure.model.ProgressEntryReferenceFilePairDto;
import de.eshg.lib.procedure.procedures.ProgressEntryReferenceFilePair;
import de.eshg.mapper.RevisionEntry;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public final class FileMapper {

  private FileMapper() {}

  public static MetaData toDomainType(MetaDataDto metaData) {
    return switch (metaData) {
      case null -> null;
      case ImageMetaDataDto imageMetaData -> toDomainType(imageMetaData);
      case PdfMetaDataDto pdfMetaData -> toDomainType(pdfMetaData);
      case MailMetaDataDto mailMetaData -> toDomainType(mailMetaData);
    };
  }

  public static ConcreteFileOrFileReference toConcreteInterfaceTypeOrReferenceInterfaceType(
      File file) {
    if (file == null) {
      return null;
    }
    if (file.isDeleted()) {
      return toInterfaceTypeAsReference(file);
    }
    return toInterfaceType(file);
  }

  private static ImageMetaData toDomainType(ImageMetaDataDto imageMetaData) {
    if (imageMetaData == null) {
      return null;
    }

    ImageMetaData domainType = new ImageMetaData();
    domainType.setCreatedDate(imageMetaData.getCreatedDate());
    domainType.setDescription(imageMetaData.getDescription());
    return domainType;
  }

  private static PdfMetaData toDomainType(PdfMetaDataDto pdfMetaData) {
    if (pdfMetaData == null) {
      return null;
    }

    PdfMetaData domainType = new PdfMetaData();
    domainType.setCreatedDate(pdfMetaData.getCreatedDate());
    domainType.setDescription(pdfMetaData.getDescription());
    return domainType;
  }

  private static MailMetaData toDomainType(MailMetaDataDto mailMetaData) {
    if (mailMetaData == null) {
      return null;
    }

    MailMetaData domainType = new MailMetaData();
    domainType.setMailFrom(mailMetaData.getMailFrom());
    domainType.setMailTo(mailMetaData.getMailTo());
    domainType.setSentDate(mailMetaData.getSentDate());
    domainType.setDescription(mailMetaData.getDescription());
    return domainType;
  }

  public static ConcreteFileDto toInterfaceType(File file) {
    return switch (file) {
      case null -> null;
      case Image image -> toInterfaceType(image);
      case Pdf pdf -> toInterfaceType(pdf);
      case Mail mail -> toInterfaceType(mail);
      default ->
          throw new IllegalArgumentException(
              "Unsupported file subclass: %s".formatted(file.getClass().getSimpleName()));
    };
  }

  private static ImageDto toInterfaceType(Image image) {
    ImageDto imageDto = new ImageDto();
    mapCommonFields(imageDto, image);

    imageDto.setMetaData(toInterfaceType(image.getMetaData()));
    return imageDto;
  }

  private static PdfDto toInterfaceType(Pdf pdf) {
    PdfDto pdfDto = new PdfDto();
    mapCommonFields(pdfDto, pdf);

    pdfDto.setMetaData(toInterfaceType(pdf.getMetaData()));
    return pdfDto;
  }

  private static MailDto toInterfaceType(Mail mail) {
    MailDto mailDto = new MailDto();
    mapCommonFields(mailDto, mail);

    mailDto.setMetaData(toInterfaceType(mail.getMetaData()));
    mailDto.setAttachments(toInterfaceTypes(mail.getAttachments()));
    mailDto.setRemovedInvalidAttachments(mail.getRemovedInvalidAttachments());
    return mailDto;
  }

  private static List<ConcreteFileDto> toInterfaceTypes(List<File> attachments) {
    if (attachments == null) {
      return null;
    }

    return attachments.stream().map(FileMapper::toInterfaceType).toList();
  }

  private static void mapCommonFields(AbstractFileDto fileDto, File file) {
    fileDto.setFileId(file.getExternalId());
    fileDto.setCreatedAt(file.getCreatedAt());
    fileDto.setModifiedAt(file.getModifiedAt());
    fileDto.setCreatedBy(file.getCreatedBy());
    fileDto.setFileName(file.getFileName());
    fileDto.setFileType(toInterfaceType(file.getFileType()));
    fileDto.setFileSizeBytes(file.getFileSizeBytes());
    fileDto.setAttachedToMail(getAttachedToMailExternalId(file));
    fileDto.setDeleted(file.isDeleted());
    fileDto.setDeletable(file.isDeletable());
    fileDto.setLocked(file.isLocked());
  }

  private static ImageMetaDataDto toInterfaceType(ImageMetaData metaData) {
    if (metaData == null) {
      return null;
    }

    ImageMetaDataDto metaDataDto = new ImageMetaDataDto();
    metaDataDto.setCreatedDate(metaData.getCreatedDate());
    metaDataDto.setDescription(metaData.getDescription());
    return metaDataDto;
  }

  private static PdfMetaDataDto toInterfaceType(PdfMetaData metaData) {
    if (metaData == null) {
      return null;
    }

    PdfMetaDataDto metaDataDto = new PdfMetaDataDto();
    metaDataDto.setCreatedDate(metaData.getCreatedDate());
    metaDataDto.setDescription(metaData.getDescription());
    return metaDataDto;
  }

  private static MailMetaDataDto toInterfaceType(MailMetaData metaData) {
    if (metaData == null) {
      return null;
    }

    MailMetaDataDto metaDataDto = new MailMetaDataDto();
    metaDataDto.setSubject(metaData.getSubject());
    metaDataDto.setMessageText(metaData.getMessageText());
    metaDataDto.setMailFrom(metaData.getMailFrom());
    metaDataDto.setMailTo(metaData.getMailTo());
    metaDataDto.setSentDate(metaData.getSentDate());
    metaDataDto.setDescription(metaData.getDescription());
    return metaDataDto;
  }

  private static FileTypeDto toInterfaceType(ProcedureFileType fileType) {
    return switch (fileType) {
      case JPEG -> FileTypeDto.JPEG;
      case PNG -> FileTypeDto.PNG;
      case PDF -> FileTypeDto.PDF;
      case EML -> FileTypeDto.EML;
    };
  }

  private static UUID getAttachedToMailExternalId(File file) {
    return Optional.ofNullable(file.getAttachedToMail()).map(File::getExternalId).orElse(null);
  }

  static GenericFileReferenceDto toInterfaceTypeAsReference(File file) {
    if (file == null) {
      return null;
    }
    return new GenericFileReferenceDto(file.getExternalId(), file.isDeleted(), file.isDeletable());
  }

  public static MetaDataHistoryDto toInterfaceType(
      RevisionEntry<? extends MetaData> revisionEntryWithChange) {
    return switch (revisionEntryWithChange.getEntity()) {
      case MailMetaData mailMetaData ->
          toInterfaceType(revisionEntryWithChange.getRevision(), mailMetaData);
      case ImageMetaData imageMetaData ->
          toInterfaceType(revisionEntryWithChange.getRevision(), imageMetaData);
      case PdfMetaData pdfMetaData ->
          toInterfaceType(revisionEntryWithChange.getRevision(), pdfMetaData);
      default ->
          throw new IllegalArgumentException(
              "Unsupported metadata subclass: %s"
                  .formatted(revisionEntryWithChange.getEntity().getClass().getSimpleName()));
    };
  }

  private static PdfMetaDataHistoryDto toInterfaceType(
      DefaultRevisionEntity revision, PdfMetaData pdfMetaData) {
    PdfMetaDataHistoryDto metaDataHistoryDto = new PdfMetaDataHistoryDto();
    metaDataHistoryDto.setPdfMetaData(toInterfaceType(pdfMetaData));
    RevisionHistoryMapper.mapCommonFields(metaDataHistoryDto, revision);
    return metaDataHistoryDto;
  }

  private static ImageMetaDataHistoryDto toInterfaceType(
      DefaultRevisionEntity revision, ImageMetaData imageMetaData) {
    ImageMetaDataHistoryDto metaDataHistoryDto = new ImageMetaDataHistoryDto();
    metaDataHistoryDto.setImageMetaData(toInterfaceType(imageMetaData));
    RevisionHistoryMapper.mapCommonFields(metaDataHistoryDto, revision);
    return metaDataHistoryDto;
  }

  private static MailMetaDataHistoryDto toInterfaceType(
      DefaultRevisionEntity revision, MailMetaData mailMetaData) {
    MailMetaDataHistoryDto metaDataHistoryDto = new MailMetaDataHistoryDto();
    metaDataHistoryDto.setMailMetaData(toInterfaceType(mailMetaData));
    RevisionHistoryMapper.mapCommonFields(metaDataHistoryDto, revision);
    return metaDataHistoryDto;
  }

  public static ProgressEntryReferenceFilePairDto toInterfaceType(
      ProgressEntryReferenceFilePair progressEntryReferenceFilePair) {
    if (progressEntryReferenceFilePair == null) {
      return null;
    }

    return new ProgressEntryReferenceFilePairDto(
        progressEntryReferenceFilePair.progressEntryExternalId(),
        toGeneralInterfaceType(progressEntryReferenceFilePair.file()));
  }

  private static GenericFileDto toGeneralInterfaceType(File file) {
    GenericFileDto fileDto = new GenericFileDto();
    mapCommonFields(fileDto, file);
    return fileDto;
  }
}
