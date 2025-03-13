/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.mapper;

import de.eshg.dental.api.OrthodonticFindingDto;
import de.eshg.dental.domain.model.OrthodonticFinding;
import java.util.List;

public class OrthodonticFindingMapper {
  public static List<OrthodonticFinding> mapToDomain(List<OrthodonticFindingDto> dtos) {
    return dtos.stream().map(OrthodonticFindingMapper::mapToDomain).toList();
  }

  private static OrthodonticFinding mapToDomain(OrthodonticFindingDto dto) {
    return switch (dto) {
      case null -> null;
      case ANGLE_CLASS_I -> OrthodonticFinding.ANGLE_CLASS_I;
      case ANGLE_CLASS_II -> OrthodonticFinding.ANGLE_CLASS_II;
      case ANGLE_CLASS_II_2 -> OrthodonticFinding.ANGLE_CLASS_II_2;
      case ANGLE_CLASS_III -> OrthodonticFinding.ANGLE_CLASS_III;
      case ANGLE_CLASS -> OrthodonticFinding.ANGLE_CLASS;
      case APLASIA -> OrthodonticFinding.APLASIA;
      case BUCAL_LINGUAL_OCCLUSION -> OrthodonticFinding.BUCAL_LINGUAL_OCCLUSION;
      case DIASTEMA -> OrthodonticFinding.DIASTEMA;
      case ANTERIOR_CROWDING -> OrthodonticFinding.ANTERIOR_CROWDING;
      case ANTERIOR_CROSSBITE -> OrthodonticFinding.ANTERIOR_CROSSBITE;
      case APPLIANCE_THERAPY -> OrthodonticFinding.APPLIANCE_THERAPY;
      case HABITS -> OrthodonticFinding.HABITS;
      case EDGE_TO_EDGE_BITE -> OrthodonticFinding.EDGE_TO_EDGE_BITE;
      case BILATERAL_LATERAL_CROSSBITE -> OrthodonticFinding.BILATERAL_LATERAL_CROSSBITE;
      case UNILATERAL_LATERAL_CROSSBITE -> OrthodonticFinding.UNILATERAL_LATERAL_CROSSBITE;
      case CLEFT_LIP_AND_PALATE -> OrthodonticFinding.CLEFT_LIP_AND_PALATE;
      case MIDLINE_DEVIATION -> OrthodonticFinding.MIDLINE_DEVIATION;
      case FIXED_APPLIANCE -> OrthodonticFinding.FIXED_APPLIANCE;
      case NON_OCCLUSION -> OrthodonticFinding.NON_OCCLUSION;
      case OPEN_BITE -> OrthodonticFinding.OPEN_BITE;
      case ANTERIOR_OPEN_BITE -> OrthodonticFinding.ANTERIOR_OPEN_BITE;
      case LATERAL_OPEN_BITE -> OrthodonticFinding.LATERAL_OPEN_BITE;
      case CROWDING -> OrthodonticFinding.CROWDING;
      case PROGENIC_FORCED_BITE -> OrthodonticFinding.PROGENIC_FORCED_BITE;
      case PROGNATHISM -> OrthodonticFinding.PROGNATHISM;
      case PSEUDOPROGNATHISM -> OrthodonticFinding.PSEUDOPROGNATHISM;
      case NARROW_JAW -> OrthodonticFinding.NARROW_JAW;
      case OTHER -> OrthodonticFinding.OTHER;
      case SUPPORT_ZONE_COLLAPSE -> OrthodonticFinding.SUPPORT_ZONE_COLLAPSE;
      case DEEP_BITE -> OrthodonticFinding.DEEP_BITE;
      case DEEP_BITE_WITH_GINGIVAL_CONTACT -> OrthodonticFinding.DEEP_BITE_WITH_GINGIVAL_CONTACT;
      case INCREASED_SAGITTAL_OVERJET -> OrthodonticFinding.INCREASED_SAGITTAL_OVERJET;
      case DISPLACEMENT -> OrthodonticFinding.DISPLACEMENT;
    };
  }

  public static List<OrthodonticFindingDto> mapToDto(List<OrthodonticFinding> orthodonticFindings) {
    return orthodonticFindings.stream().map(OrthodonticFindingMapper::mapToDto).toList();
  }

  private static OrthodonticFindingDto mapToDto(OrthodonticFinding dentitionType) {
    return switch (dentitionType) {
      case null -> null;
      case ANGLE_CLASS_I -> OrthodonticFindingDto.ANGLE_CLASS_I;
      case ANGLE_CLASS_II -> OrthodonticFindingDto.ANGLE_CLASS_II;
      case ANGLE_CLASS_II_2 -> OrthodonticFindingDto.ANGLE_CLASS_II_2;
      case ANGLE_CLASS_III -> OrthodonticFindingDto.ANGLE_CLASS_III;
      case ANGLE_CLASS -> OrthodonticFindingDto.ANGLE_CLASS;
      case APLASIA -> OrthodonticFindingDto.APLASIA;
      case BUCAL_LINGUAL_OCCLUSION -> OrthodonticFindingDto.BUCAL_LINGUAL_OCCLUSION;
      case DIASTEMA -> OrthodonticFindingDto.DIASTEMA;
      case ANTERIOR_CROWDING -> OrthodonticFindingDto.ANTERIOR_CROWDING;
      case ANTERIOR_CROSSBITE -> OrthodonticFindingDto.ANTERIOR_CROSSBITE;
      case APPLIANCE_THERAPY -> OrthodonticFindingDto.APPLIANCE_THERAPY;
      case HABITS -> OrthodonticFindingDto.HABITS;
      case EDGE_TO_EDGE_BITE -> OrthodonticFindingDto.EDGE_TO_EDGE_BITE;
      case BILATERAL_LATERAL_CROSSBITE -> OrthodonticFindingDto.BILATERAL_LATERAL_CROSSBITE;
      case UNILATERAL_LATERAL_CROSSBITE -> OrthodonticFindingDto.UNILATERAL_LATERAL_CROSSBITE;
      case CLEFT_LIP_AND_PALATE -> OrthodonticFindingDto.CLEFT_LIP_AND_PALATE;
      case MIDLINE_DEVIATION -> OrthodonticFindingDto.MIDLINE_DEVIATION;
      case FIXED_APPLIANCE -> OrthodonticFindingDto.FIXED_APPLIANCE;
      case NON_OCCLUSION -> OrthodonticFindingDto.NON_OCCLUSION;
      case OPEN_BITE -> OrthodonticFindingDto.OPEN_BITE;
      case ANTERIOR_OPEN_BITE -> OrthodonticFindingDto.ANTERIOR_OPEN_BITE;
      case LATERAL_OPEN_BITE -> OrthodonticFindingDto.LATERAL_OPEN_BITE;
      case CROWDING -> OrthodonticFindingDto.CROWDING;
      case PROGENIC_FORCED_BITE -> OrthodonticFindingDto.PROGENIC_FORCED_BITE;
      case PROGNATHISM -> OrthodonticFindingDto.PROGNATHISM;
      case PSEUDOPROGNATHISM -> OrthodonticFindingDto.PSEUDOPROGNATHISM;
      case NARROW_JAW -> OrthodonticFindingDto.NARROW_JAW;
      case OTHER -> OrthodonticFindingDto.OTHER;
      case SUPPORT_ZONE_COLLAPSE -> OrthodonticFindingDto.SUPPORT_ZONE_COLLAPSE;
      case DEEP_BITE -> OrthodonticFindingDto.DEEP_BITE;
      case DEEP_BITE_WITH_GINGIVAL_CONTACT -> OrthodonticFindingDto.DEEP_BITE_WITH_GINGIVAL_CONTACT;
      case INCREASED_SAGITTAL_OVERJET -> OrthodonticFindingDto.INCREASED_SAGITTAL_OVERJET;
      case DISPLACEMENT -> OrthodonticFindingDto.DISPLACEMENT;
    };
  }
}
