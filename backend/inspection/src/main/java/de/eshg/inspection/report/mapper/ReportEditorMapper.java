/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.mapper;

import de.eshg.inspection.common.persistence.MediaFile;
import de.eshg.inspection.common.persistence.MediaFileRepository;
import de.eshg.inspection.report.persistence.Report;
import de.eshg.inspection.report.persistence.element.ReportElement;
import de.eshg.inspection.report.persistence.element.ReportElementAnswer;
import de.eshg.inspection.report.persistence.element.ReportElementAudios;
import de.eshg.inspection.report.persistence.element.ReportElementChapter;
import de.eshg.inspection.report.persistence.element.ReportElementFullTextBlock;
import de.eshg.inspection.report.persistence.element.ReportElementImages;
import de.eshg.inspection.report.persistence.element.ReportElementQA;
import de.eshg.inspection.report.persistence.element.ReportElementSection;
import de.eshg.inspection.report.persistence.element.ReportElementSeparator;
import de.eshg.inspection.report.persistence.element.ReportElementText;
import de.eshg.inspection.report.persistence.element.ReportElementTextBlock;
import de.eshg.inspection.report.persistence.element.ReportElementTopLevelTitle;
import de.eshg.lib.editor.api.model.EditorBodyDto;
import de.eshg.lib.editor.api.model.EditorDto;
import de.eshg.lib.editor.api.model.element.EditorElementAnswerDto;
import de.eshg.lib.editor.api.model.element.EditorElementAudioDto;
import de.eshg.lib.editor.api.model.element.EditorElementAudiosDto;
import de.eshg.lib.editor.api.model.element.EditorElementChapterDto;
import de.eshg.lib.editor.api.model.element.EditorElementDto;
import de.eshg.lib.editor.api.model.element.EditorElementFullTextBlockDto;
import de.eshg.lib.editor.api.model.element.EditorElementImageDto;
import de.eshg.lib.editor.api.model.element.EditorElementImagesDto;
import de.eshg.lib.editor.api.model.element.EditorElementQADto;
import de.eshg.lib.editor.api.model.element.EditorElementSectionDto;
import de.eshg.lib.editor.api.model.element.EditorElementSeparatorDto;
import de.eshg.lib.editor.api.model.element.EditorElementTextBlockDto;
import de.eshg.lib.editor.api.model.element.EditorElementTextDto;
import de.eshg.lib.editor.api.model.element.EditorElementTopLevelTitleDto;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ReportEditorMapper {
  private static final Logger log = LoggerFactory.getLogger(ReportEditorMapper.class);

  private final MediaFileRepository mediaFileRepository;

  public ReportEditorMapper(MediaFileRepository mediaFileRepository) {
    this.mediaFileRepository = mediaFileRepository;
  }

  public EditorDto reportToEditorDto(Report report) {
    List<EditorElementDto> editorElements =
        report.getReportElements().stream().map(this::reportElementToEditorElementDto).toList();
    return new EditorDto(report.getExternalId(), new EditorBodyDto(editorElements));
  }

  public EditorElementDto reportElementToEditorElementDto(ReportElement reportElement) {
    return switch (reportElement.getType()) {
      case TOPLEVEL_TITLE -> mapToplevelTitle((ReportElementTopLevelTitle) reportElement);
      case CHAPTER -> mapChapter((ReportElementChapter) reportElement);
      case SECTION -> mapSection((ReportElementSection) reportElement);
      case TEXT -> mapText((ReportElementText) reportElement);
      case TEXT_BLOCK -> mapTextBlock((ReportElementTextBlock) reportElement);
      case FULL_TEXT_BLOCK -> mapFullTextBlock((ReportElementFullTextBlock) reportElement);
      case QUESTION_AND_ANSWERS -> mapQuestionAndAnswers((ReportElementQA) reportElement);
      case IMAGES -> mapImages((ReportElementImages) reportElement);
      case SEPARATOR -> mapSeparator((ReportElementSeparator) reportElement);
      case AUDIOS -> mapAudio((ReportElementAudios) reportElement);
    };
  }

  private EditorElementDto mapAudio(ReportElementAudios reportAudioElement) {
    List<MediaFile> mediaFileList =
        mediaFileRepository.findAllByFileExternalIdInOrderById(
            reportAudioElement.getAudioChecklistElementIds());

    Map<UUID, MediaFile> mediaFileMap =
        mediaFileList.stream()
            .collect(Collectors.toMap(MediaFile::getFileExternalId, mediaFile -> mediaFile));

    List<EditorElementAudioDto> audioDtos =
        reportAudioElement.getAudioChecklistElementIds().stream()
            .map(
                audioId -> {
                  Optional<MediaFile> mediaFile = Optional.ofNullable(mediaFileMap.get(audioId));
                  if (mediaFile.isEmpty()) {
                    log.error("Could not find audio for id {}", audioId);
                  }

                  return new EditorElementAudioDto(
                      audioId,
                      mediaFile.map(MediaFile::getFileName).orElse(null),
                      mediaFile.map(MediaFile::getFileSize).orElse(null),
                      mediaFile.map(MediaFile::getCreatedAt).orElse(null));
                })
            .toList();

    return new EditorElementAudiosDto(
        reportAudioElement.getExternalId(),
        reportAudioElement.isEditable(),
        reportAudioElement.isMoveable(),
        reportAudioElement.isDeletable(),
        reportAudioElement.isIncident(),
        null,
        reportAudioElement.getTitle() != null ? reportAudioElement.getTitle() : "",
        audioDtos);
  }

  private static EditorElementQADto mapQuestionAndAnswers(ReportElementQA qaElement) {
    List<EditorElementAnswerDto> answerDtos =
        qaElement.getAnswers().stream()
            .map(
                answerElement ->
                    new EditorElementAnswerDto(
                        answerElement.getExternalId(),
                        answerElement.isSelected(),
                        answerElement.getText() != null ? answerElement.getText() : "",
                        answerElement.getExtraText()))
            .toList();

    return new EditorElementQADto(
        qaElement.getExternalId(),
        qaElement.isEditable(),
        qaElement.isMoveable(),
        qaElement.isDeletable(),
        qaElement.isIncident(),
        null,
        qaElement.getTitle() != null ? qaElement.getTitle() : "",
        answerDtos);
  }

  private EditorElementImagesDto mapImages(ReportElementImages imagesElement) {
    List<MediaFile> mediaFileList =
        mediaFileRepository.findAllByFileExternalIdInOrderById(
            imagesElement.getImageChecklistElementIds());

    Map<UUID, MediaFile> mediaFileMap =
        mediaFileList.stream()
            .collect(Collectors.toMap(MediaFile::getFileExternalId, mediaFile -> mediaFile));

    List<EditorElementImageDto> imageDtos =
        imagesElement.getImageChecklistElementIds().stream()
            .map(
                imageId -> {
                  Optional<MediaFile> mediaFile = Optional.ofNullable(mediaFileMap.get(imageId));
                  if (mediaFile.isEmpty()) {
                    log.error("Could not find image for id {}", imageId);
                  }

                  return new EditorElementImageDto(
                      imageId,
                      mediaFile.map(MediaFile::getFileName).orElse(null),
                      mediaFile.map(MediaFile::getFileSize).orElse(null),
                      mediaFile.map(MediaFile::getCreatedAt).orElse(null));
                })
            .toList();

    return new EditorElementImagesDto(
        imagesElement.getExternalId(),
        imagesElement.isEditable(),
        imagesElement.isMoveable(),
        imagesElement.isDeletable(),
        imagesElement.isIncident(),
        null,
        imagesElement.getTitle() != null ? imagesElement.getTitle() : "",
        imageDtos);
  }

  private static EditorElementTextBlockDto mapTextBlock(ReportElementTextBlock textBlock) {
    return new EditorElementTextBlockDto(
        textBlock.getExternalId(),
        textBlock.isEditable(),
        textBlock.isMoveable(),
        textBlock.isDeletable(),
        textBlock.isIncident(),
        null,
        textBlock.getTitle() != null ? textBlock.getTitle() : "",
        textBlock.getText() != null ? textBlock.getText() : "");
  }

  private static EditorElementFullTextBlockDto mapFullTextBlock(
      ReportElementFullTextBlock textBlock) {
    return new EditorElementFullTextBlockDto(
        textBlock.getExternalId(),
        textBlock.isEditable(),
        textBlock.isMoveable(),
        textBlock.isDeletable(),
        false,
        null,
        textBlock.getTitle() != null ? textBlock.getTitle() : "",
        textBlock.getText() != null ? textBlock.getText() : "");
  }

  private static EditorElementTextDto mapText(ReportElementText text) {
    return new EditorElementTextDto(
        text.getExternalId(),
        text.isEditable(),
        text.isMoveable(),
        text.isDeletable(),
        text.isIncident(),
        null,
        text.getText() != null ? text.getText() : "");
  }

  private static EditorElementSectionDto mapSection(ReportElementSection section) {
    return new EditorElementSectionDto(
        section.getExternalId(),
        section.isEditable(),
        section.isMoveable(),
        section.isDeletable(),
        section.isIncident(),
        null,
        section.getTitle() != null ? section.getTitle() : "");
  }

  private static EditorElementChapterDto mapChapter(ReportElementChapter chapter) {
    return new EditorElementChapterDto(
        chapter.getExternalId(),
        chapter.isEditable(),
        chapter.isMoveable(),
        chapter.isDeletable(),
        chapter.isIncident(),
        null,
        chapter.getTitle() != null ? chapter.getTitle() : "");
  }

  private static EditorElementTopLevelTitleDto mapToplevelTitle(
      ReportElementTopLevelTitle topLevelTitle) {
    return new EditorElementTopLevelTitleDto(
        topLevelTitle.getExternalId(),
        topLevelTitle.isEditable(),
        topLevelTitle.isMoveable(),
        topLevelTitle.isDeletable(),
        topLevelTitle.isIncident(),
        null,
        topLevelTitle.getTitle() != null ? topLevelTitle.getTitle() : "");
  }

  private static EditorElementSeparatorDto mapSeparator(ReportElementSeparator separatorElement) {
    return new EditorElementSeparatorDto(
        separatorElement.getExternalId(),
        separatorElement.isEditable(),
        separatorElement.isMoveable(),
        separatorElement.isDeletable(),
        separatorElement.isIncident(),
        null);
  }

  public static ReportElement editorElementToReportElement(EditorElementDto editorElementDto) {
    return switch (editorElementDto.getType()) {
      case TOPLEVEL_TITLE -> mapToplevelTitle((EditorElementTopLevelTitleDto) editorElementDto);
      case CHAPTER -> mapChapter((EditorElementChapterDto) editorElementDto);
      case SECTION -> mapSection((EditorElementSectionDto) editorElementDto);
      case TEXT -> mapText((EditorElementTextDto) editorElementDto);
      case TEXT_BLOCK -> mapTextBlock((EditorElementTextBlockDto) editorElementDto);
      case FULL_TEXT_BLOCK -> mapFullTextBlock((EditorElementFullTextBlockDto) editorElementDto);
      case QUESTION_AND_ANSWERS -> mapQuestionAndAnswers((EditorElementQADto) editorElementDto);
      case IMAGES -> mapImages((EditorElementImagesDto) editorElementDto);
      case SEPARATOR -> mapSeparator((EditorElementSeparatorDto) editorElementDto);
      case AUDIOS -> mapAudios((EditorElementAudiosDto) editorElementDto);
    };
  }

  private static ReportElement mapAudios(EditorElementAudiosDto editorElementDto) {
    ReportElementImages reportElementImages = new ReportElementImages();
    reportElementImages.setEditable(editorElementDto.isEditable());
    reportElementImages.setMoveable(editorElementDto.isMoveable());
    reportElementImages.setDeletable(editorElementDto.isDeletable());
    reportElementImages.setTitle(editorElementDto.getTitle());
    List<UUID> imageExternalIds =
        editorElementDto.getAudios().stream().map(EditorElementAudioDto::externalId).toList();
    reportElementImages.getImageChecklistElementIds().addAll(imageExternalIds);
    return reportElementImages;
  }

  private static ReportElementTopLevelTitle mapToplevelTitle(
      EditorElementTopLevelTitleDto editorElementDto) {
    ReportElementTopLevelTitle reportElementTopLevelTitle = new ReportElementTopLevelTitle();
    reportElementTopLevelTitle.setEditable(editorElementDto.isEditable());
    reportElementTopLevelTitle.setMoveable(editorElementDto.isMoveable());
    reportElementTopLevelTitle.setDeletable(editorElementDto.isDeletable());
    reportElementTopLevelTitle.setTitle(editorElementDto.getTitle());
    return reportElementTopLevelTitle;
  }

  private static ReportElementChapter mapChapter(EditorElementChapterDto editorElementDto) {
    ReportElementChapter reportElementChapter = new ReportElementChapter();
    reportElementChapter.setEditable(editorElementDto.isEditable());
    reportElementChapter.setMoveable(editorElementDto.isMoveable());
    reportElementChapter.setDeletable(editorElementDto.isDeletable());
    reportElementChapter.setTitle(editorElementDto.getTitle());
    return reportElementChapter;
  }

  private static ReportElementSection mapSection(EditorElementSectionDto editorElementDto) {
    ReportElementSection reportElementSection = new ReportElementSection();
    reportElementSection.setEditable(editorElementDto.isEditable());
    reportElementSection.setMoveable(editorElementDto.isMoveable());
    reportElementSection.setDeletable(editorElementDto.isDeletable());
    reportElementSection.setTitle(editorElementDto.getTitle());
    return reportElementSection;
  }

  private static ReportElementText mapText(EditorElementTextDto editorElementDto) {
    ReportElementText reportElementText = new ReportElementText();
    reportElementText.setEditable(editorElementDto.isEditable());
    reportElementText.setMoveable(editorElementDto.isMoveable());
    reportElementText.setDeletable(editorElementDto.isDeletable());
    reportElementText.setText(editorElementDto.getText());
    return reportElementText;
  }

  private static ReportElementTextBlock mapTextBlock(EditorElementTextBlockDto editorElementDto) {
    ReportElementTextBlock reportElementTextBlock = new ReportElementTextBlock();
    reportElementTextBlock.setEditable(editorElementDto.isEditable());
    reportElementTextBlock.setMoveable(editorElementDto.isMoveable());
    reportElementTextBlock.setDeletable(editorElementDto.isDeletable());
    reportElementTextBlock.setTitle(editorElementDto.getTitle());
    reportElementTextBlock.setText(editorElementDto.getText());
    return reportElementTextBlock;
  }

  private static ReportElementFullTextBlock mapFullTextBlock(
      EditorElementFullTextBlockDto editorElementDto) {
    ReportElementFullTextBlock reportElementTextBlock = new ReportElementFullTextBlock();
    reportElementTextBlock.setEditable(editorElementDto.isEditable());
    reportElementTextBlock.setMoveable(editorElementDto.isMoveable());
    reportElementTextBlock.setDeletable(editorElementDto.isDeletable());
    reportElementTextBlock.setTitle(editorElementDto.getTitle());
    reportElementTextBlock.setText(editorElementDto.getText());
    return reportElementTextBlock;
  }

  private static ReportElementQA mapQuestionAndAnswers(EditorElementQADto editorElementDto) {
    ReportElementQA reportElementQA = new ReportElementQA();
    reportElementQA.setEditable(editorElementDto.isEditable());
    reportElementQA.setMoveable(editorElementDto.isMoveable());
    reportElementQA.setDeletable(editorElementDto.isDeletable());
    reportElementQA.setTitle(editorElementDto.getTitle());
    List<ReportElementAnswer> answers =
        editorElementDto.getAnswers().stream().map(ReportEditorMapper::mapAnswer).toList();
    reportElementQA.getAnswers().addAll(answers);
    return reportElementQA;
  }

  private static ReportElementAnswer mapAnswer(EditorElementAnswerDto answerDto) {
    ReportElementAnswer answer = new ReportElementAnswer();
    answer.setSelected(answerDto.selected());
    answer.setText(answerDto.answerText());
    answer.setExtraText(answerDto.extraText());
    return answer;
  }

  private static ReportElementImages mapImages(EditorElementImagesDto editorElementDto) {
    ReportElementImages reportElementImages = new ReportElementImages();
    reportElementImages.setEditable(editorElementDto.isEditable());
    reportElementImages.setMoveable(editorElementDto.isMoveable());
    reportElementImages.setDeletable(editorElementDto.isDeletable());
    reportElementImages.setTitle(editorElementDto.getTitle());
    List<UUID> imageExternalIds =
        editorElementDto.getImages().stream().map(EditorElementImageDto::externalId).toList();
    reportElementImages.getImageChecklistElementIds().addAll(imageExternalIds);
    return reportElementImages;
  }

  private static ReportElementSeparator mapSeparator(EditorElementSeparatorDto editorElementDto) {
    ReportElementSeparator reportElementSeparator = new ReportElementSeparator();
    reportElementSeparator.setEditable(editorElementDto.isEditable());
    reportElementSeparator.setMoveable(editorElementDto.isMoveable());
    reportElementSeparator.setDeletable(editorElementDto.isDeletable());
    return reportElementSeparator;
  }
}
