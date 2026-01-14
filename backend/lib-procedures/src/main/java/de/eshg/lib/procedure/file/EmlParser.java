/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import static de.eshg.file.common.FileType.JPEG;
import static de.eshg.file.common.FileType.PDF;
import static de.eshg.file.common.FileType.PNG;
import static de.eshg.file.common.FileValidator.FILE_REGEX_PATTERN;
import static de.eshg.file.common.FileValidator.isContentTypeValid;
import static jakarta.mail.Part.ATTACHMENT;
import static org.springframework.http.MediaType.TEXT_HTML_VALUE;
import static org.springframework.http.MediaType.TEXT_PLAIN_VALUE;

import de.eshg.file.common.FileType;
import de.eshg.file.common.FileTypeDetector;
import de.eshg.file.common.ImageRewriter;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.FileContent;
import de.eshg.lib.procedure.domain.model.Mail;
import de.eshg.lib.procedure.domain.model.MailMetaData;
import de.eshg.lib.procedure.domain.model.ProcedureFileType;
import de.eshg.rest.service.error.BadRequestException;
import jakarta.mail.Address;
import jakarta.mail.BodyPart;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Part;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMultipart;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.EnumSet;
import java.util.List;
import java.util.Objects;
import java.util.Properties;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;

class EmlParser {

  private static final Set<FileType> VALID_ATTACHMENT_FILE_TYPES = EnumSet.of(JPEG, PNG, PDF);

  private EmlParser() {}

  static Mail parse(byte[] file, int maxImageSideLength) {
    try (InputStream inputStream = new ByteArrayInputStream(file)) {
      Session session = Session.getDefaultInstance(new Properties());
      Message message = new FixedMessageIdMimeMessage(session, inputStream);

      Mail parsedMail = new Mail();
      parsedMail.setFileType(ProcedureFileType.EML);
      parsedMail.addMetaData(extractMetaData(message));

      int removedInvalidAttachments = removeAndCountInvalidAttachments(message);
      parsedMail.setRemovedInvalidAttachments(removedInvalidAttachments);
      extractAttachments(message, maxImageSideLength).forEach(parsedMail::addAttachment);

      FileContent fileContent = new FileContent();
      byte[] content = extractContent(message);
      fileContent.setContent(content);

      parsedMail.setFileSizeBytes(content.length);
      parsedMail.setFileContent(fileContent);

      return parsedMail;
    } catch (MessagingException | IOException e) {
      throw createMailParsingException("Could not extract meta data");
    }
  }

  private static String extractMessageText(Message message) throws MessagingException, IOException {
    if (message.isMimeType(TEXT_PLAIN_VALUE)) {
      return getStrippedContent(message);
    }
    if (message.getContent() instanceof MimeMultipart mimeMultipart) {
      return extractMessageText(mimeMultipart);
    }

    throw createMailParsingException("Could not extract message text");
  }

  private static String extractMessageText(MimeMultipart mimeMultipart)
      throws MessagingException, IOException {
    for (int i = 0; i < mimeMultipart.getCount(); i++) {
      BodyPart bodyPart = mimeMultipart.getBodyPart(i);
      if (bodyPart.isMimeType(TEXT_PLAIN_VALUE)) {
        return getStrippedContent(bodyPart);
      } else if (bodyPart.getContent() instanceof MimeMultipart content) {
        return extractMessageText(content);
      }
    }

    throw createMailParsingException("Could not extract message text");
  }

  private static String getStrippedContent(Part part) throws IOException, MessagingException {
    return part.getContent().toString().strip();
  }

  private static MailMetaData extractMetaData(Message message)
      throws MessagingException, IOException {
    Address[] mailFrom = message.getFrom();
    Address[] mailTo = message.getAllRecipients();
    Date sentDate = message.getSentDate();

    if (Objects.isNull(mailFrom) || Objects.isNull(mailTo) || Objects.isNull(sentDate)) {
      throw createMailParsingException("Could not extract MetaData");
    }

    MailMetaData mailMetaData = new MailMetaData();
    mailMetaData.setSubject(message.getSubject());
    mailMetaData.setMessageText(extractMessageText(message));
    mailMetaData.setMailFrom(convertAddressesToString(mailFrom));
    mailMetaData.setMailTo(convertAddressesToString(mailTo));
    mailMetaData.setSentDate(sentDate.toInstant());

    return mailMetaData;
  }

  private static String convertAddressesToString(Address[] addresses) {
    return Arrays.stream(addresses)
        .filter(InternetAddress.class::isInstance)
        .map(InternetAddress.class::cast)
        .map(InternetAddress::getAddress)
        .collect(Collectors.joining(","));
  }

  private static int removeAndCountInvalidAttachments(Message message)
      throws MessagingException, IOException {
    if (!(message.getContent() instanceof MimeMultipart content)) {
      return 0;
    }

    int removedInvalidAttachments = 0;
    for (BodyPart bodyPart : getAttachmentBodyParts(content)) {
      if (!isValidAttachment(getValidFileTypeOrNull(bodyPart))) {
        content.removeBodyPart(bodyPart);
        removedInvalidAttachments++;
      }
    }

    message.saveChanges();

    return removedInvalidAttachments;
  }

  private static FileType getValidFileTypeOrNull(Part part) throws IOException, MessagingException {
    FileType fileType = parseFileType(part);
    if (fileType != null
        && isContentTypeValid(part.getContentType(), fileType)
        && fileType.hasValidFileExtension(FilenameUtils.getExtension(part.getFileName()))) {
      return fileType;
    } else {
      return null;
    }
  }

  private static FileType parseFileType(Part part) throws IOException, MessagingException {
    byte[] fileContent = parseFileContent(part);
    String contentType = FileTypeDetector.detect(fileContent);
    return FileType.fromContentType(contentType);
  }

  private static byte[] parseFileContent(Part part) throws IOException, MessagingException {
    return IOUtils.toByteArray(part.getInputStream());
  }

  private static List<File> extractAttachments(Message message, int maxImageSideLength)
      throws MessagingException, IOException {
    if (!(message.getContent() instanceof MimeMultipart content)) {
      return Collections.emptyList();
    }

    List<File> files = new ArrayList<>();
    for (BodyPart bodyPart : getAttachmentBodyParts(content)) {
      File file =
          createFile(
              sanitizeAttachmentName(bodyPart.getFileName()),
              FileTypeMapper.mapToProcedureFileType(parseFileType(bodyPart)),
              parseFileContent(bodyPart),
              maxImageSideLength);
      files.add(file);
    }
    return files;
  }

  private static String sanitizeAttachmentName(String originalFilename) {
    if (StringUtils.isBlank(originalFilename)
        || !(FILE_REGEX_PATTERN.matcher(originalFilename).matches())) {
      return "Renamed_" + UUID.randomUUID() + "." + FilenameUtils.getExtension(originalFilename);
    } else {
      return originalFilename;
    }
  }

  private static List<BodyPart> getAttachmentBodyParts(MimeMultipart content)
      throws MessagingException, IOException {
    List<BodyPart> bodyParts = new ArrayList<>();
    for (int i = 0; i < content.getCount(); i++) {
      BodyPart bodyPart = content.getBodyPart(i);
      byte[] fileContent = parseFileContent(bodyPart);
      String contentType = FileTypeDetector.detect(fileContent);

      if (!isContentTypeText(contentType) || isAttachment(bodyPart)) {
        bodyParts.add(bodyPart);
      }
    }
    return bodyParts;
  }

  private static boolean isAttachment(Part part) throws MessagingException {
    return ATTACHMENT.equals(part.getDisposition());
  }

  private static boolean isContentTypeText(String contentType) {
    return TEXT_PLAIN_VALUE.equals(contentType) || TEXT_HTML_VALUE.equals(contentType);
  }

  private static boolean isValidAttachment(FileType fileType) {
    return fileType != null && VALID_ATTACHMENT_FILE_TYPES.contains(fileType);
  }

  private static File createFile(
      String fileName, ProcedureFileType fileType, byte[] fileContent, int maxImageSideLength)
      throws IOException {
    return switch (fileType) {
      case JPEG, PNG -> {
        byte[] rewrittenImage =
            ImageRewriter.validateAndRewriteImageFile(
                new ByteArrayInputStream(fileContent),
                fileType.getCommonFileType().getMediaType(),
                maxImageSideLength);
        yield FileFactory.createImageWithMetaData(
            fileName,
            fileType,
            rewrittenImage,
            ImageMetaDataExtractor.fromFileContent(rewrittenImage));
      }
      case PDF ->
          FileFactory.createPdfWithMetaData(
              fileName, fileContent, PdfMetaDataExtractor.fromFileContent(fileContent));
      default -> throw new IllegalStateException("Unexpected value: " + fileType);
    };
  }

  private static byte[] extractContent(Message message) throws MessagingException, IOException {
    try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
      message.writeTo(os);
      return os.toByteArray();
    }
  }

  private static BadRequestException createMailParsingException(String errorMessage) {
    return new BadRequestException(errorMessage);
  }

  static class FixedMessageIdMimeMessage extends jakarta.mail.internet.MimeMessage {

    public FixedMessageIdMimeMessage(Session session, InputStream is) throws MessagingException {
      super(session, is);
    }

    @Override
    protected void updateMessageID() {
      // do not update message id on saveChanges()
    }
  }
}
