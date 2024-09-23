/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor.api.model;

import de.eshg.lib.editor.api.model.element.EditorElementDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Request payload to add a new element to an editor.
 *
 * <p>Either {@code insertBefore} or {@code insertAfter} can be set. If both are not set, then add
 * the element at the end. If both are set an error is thrown.
 *
 * @param editorElement the element to add
 * @param insertBefore if non-null then add the element before this position
 * @param insertAfter if non-null then add the element after this position
 */
@Schema(name = "InsertEditorRequest")
public record InsertEditorRequest(
    @NotNull @Valid EditorElementDto editorElement,
    @Min(0) Integer insertBefore,
    @Min(0) Integer insertAfter) {}
