/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.informationstatementtemplate;

import de.eshg.lib.editor.api.model.EditorBodyDto;
import de.eshg.lib.editor.api.model.EditorDto;
import de.eshg.lib.editor.api.model.element.EditorElementDto;
import de.eshg.lib.editor.api.model.element.EditorElementTextBlockDto;
import de.eshg.lib.editor.api.model.element.EditorElementTextDto;
import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.InformationStatementTemplate;
import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.element.Element;
import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.element.ElementText;
import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.element.ElementTextBlock;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class InformationStatementTemplateEditorMapper {
  public EditorDto mapElementsToInterfaceType(
      InformationStatementTemplate informationStatementTemplate) {

    List<EditorElementDto> editorElements =
        informationStatementTemplate.getElements().stream()
            .map(this::elementToEditorElementDto)
            .toList();
    return new EditorDto(
        informationStatementTemplate.getExternalId(), new EditorBodyDto(editorElements));
  }

  public EditorElementDto elementToEditorElementDto(Element element) {
    return switch (element.getType()) {
      case TEXT -> mapText((ElementText) element);
      case TEXT_BLOCK -> mapTextBlock((ElementTextBlock) element);
    };
  }

  private static EditorElementTextDto mapText(ElementText text) {
    return new EditorElementTextDto(
        text.getExternalId(),
        text.isEditable(),
        text.isMoveable(),
        text.isDeletable(),
        false,
        null,
        text.getText() != null ? text.getText() : "");
  }

  private EditorElementTextBlockDto mapTextBlock(ElementTextBlock textBlock) {
    return new EditorElementTextBlockDto(
        textBlock.getExternalId(),
        textBlock.isEditable(),
        textBlock.isMoveable(),
        textBlock.isDeletable(),
        false,
        null,
        textBlock.getTitle() != null ? textBlock.getTitle() : "",
        textBlock.getText() != null ? textBlock.getText() : "");
  }

  public static Element elementToReportElement(EditorElementDto editorElementDto) {
    return switch (editorElementDto.getType()) {
      case TEXT -> mapText((EditorElementTextDto) editorElementDto);
      case TEXT_BLOCK -> mapTextBlock((EditorElementTextBlockDto) editorElementDto);
      default ->
          throw new IllegalArgumentException(
              "Type %s is currently not supported".formatted(editorElementDto.getType()));
    };
  }

  private static ElementText mapText(EditorElementTextDto editorElementDto) {
    ElementText elementText = new ElementText();
    elementText.setEditable(editorElementDto.isEditable());
    elementText.setMoveable(editorElementDto.isMoveable());
    elementText.setDeletable(editorElementDto.isDeletable());
    elementText.setText(editorElementDto.getText());
    return elementText;
  }

  private static ElementTextBlock mapTextBlock(EditorElementTextBlockDto editorElementDto) {
    ElementTextBlock reportElementTextBlock = new ElementTextBlock();
    reportElementTextBlock.setEditable(editorElementDto.isEditable());
    reportElementTextBlock.setMoveable(editorElementDto.isMoveable());
    reportElementTextBlock.setDeletable(editorElementDto.isDeletable());
    reportElementTextBlock.setTitle(editorElementDto.getTitle());
    reportElementTextBlock.setText(editorElementDto.getText());
    return reportElementTextBlock;
  }
}
