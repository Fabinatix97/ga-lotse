<#import "../common/forms.ftlh" as forms />

<#macro content schoolAndPromotionHints="NUL">
<#-- @ftlvariable name="schoolAndPromotionHints" type="de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterSchoolAndPromotionHintsDto" -->
  <table class="schoolAndPromotionHints" style="width: 100%">
    <colgroup>
      <col style="width: 34%" />
      <col style="width: 33%" />
      <col style="width: 33%" />
    </colgroup>
    <tr>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.behavior title="Verhalten" />
      </td>
    </tr>
    <tr>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.language title="Sprache" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.articulation title="Artikulation" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.grammarAndVocabulary title="Grammatik / Wortschatz" />
      </td>
    </tr>
    <tr>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.auditiveInformationProcessing title="Auditive Informationsverarbeitung" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.visualPerception title="Visuelle Wahrnehmung" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.colorsShapesNumbersSets title="Farben / Formen / Zahlen / Mengen" />
      </td>
    </tr>
    <tr>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.fineOrVisuoMotorSkills title="Feinmotorik / Visuomotorik" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.grossMotorSkillsOrPhysicalCoordination title="Grobmotorik / Körperkoordination" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.leftHandedness title="Linkshändigkeit" />
      </td>
    </tr>
  </table>
</#macro>
