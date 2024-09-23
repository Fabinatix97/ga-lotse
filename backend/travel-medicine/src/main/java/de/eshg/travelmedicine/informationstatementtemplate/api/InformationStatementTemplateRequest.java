/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.informationstatementtemplate.api;

import de.eshg.lib.editor.api.model.element.EditorElementDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record InformationStatementTemplateRequest(
    @NotNull @Size(max = 200) String name,
    @NotNull @Size(max = 200) String title,
    @NotNull InformationStatementTemplateStateDto state,
    List<UUID> diseaseIDs,
    @Valid List<EditorElementDto> editorElements) {}
