<#import "../common/forms.ftlh" as forms />

<#macro content schoolAndPromotionHints="NUL">
<#-- @ftlvariable name="schoolAndPromotionHints" type="de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterSchoolAndPromotionHintsDto" -->
  <table class="schoolAndPromotionHints" style="width: 100%; line-height: 1rem;">
    <colgroup>
      <col style="width: 50%" />
      <col style="width: 50%" />
    </colgroup>
    <tr>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.behavior title="Verhalten" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.grammarAndVocabulary title="Grammatik / Wortschatz" />
      </td>
    </tr>
    <tr>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.language title="Sprache" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.colorsShapesNumbersSets title="Farben / Formen / Zahlen / Mengen" />
      </td>
    </tr>
    <tr>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.auditiveInformationProcessing title="Auditive Informationsverarbeitung" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.leftHandedness title="Linkshändigkeit" />
      </td>
    </tr>
    <tr>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.fineOrVisuoMotorSkills title="Feinmotorik / Visuomotorik" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.grossMotorSkillsOrPhysicalCoordination title="Grobmotorik / Körperkoordination" />
      </td>
    </tr>
    <tr>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.articulation title="Artikulation" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints?isHash && schoolAndPromotionHints.visualPerception title="Visuelle Wahrnehmung" />
      </td>
    </tr>
  </table>
</#macro>
