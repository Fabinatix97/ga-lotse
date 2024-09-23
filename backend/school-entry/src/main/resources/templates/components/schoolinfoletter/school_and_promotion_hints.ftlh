<#import "../common/forms.ftlh" as forms />

<#macro content schoolAndPromotionHints>
<#-- @ftlvariable name="examination" type="de.eshg.schoolentry.pdf.schoolinfoletter.model.SchoolInfoLetterSchoolAndPromotionHints" -->
  <table class="schoolAndPromotionHints" style="width: 100%">
    <colgroup>
      <col style="width: 34%" />
      <col style="width: 33%" />
      <col style="width: 33%" />
    </colgroup>
    <tr>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints.behavior title="Verhalten" />
      </td>
    </tr>
    <tr>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints.language title="Sprache" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints.articulation title="Artikulation" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints.grammarAndVocabulary title="Grammatik / Wortschatz" />
      </td>
    </tr>
    <tr>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints.auditiveInformationProcessing title="Auditive Informationsverarbeitung" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints.visualPerception title="Visuelle Wahrnehmung" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints.colorsShapesNumbersSets title="Farben / Formen / Zahlen / Mengen" />
      </td>
    </tr>
    <tr>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints.fineOrVisuoMotorSkills title="Feinmotorik / Visuomotorik" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints.grossMotorSkillsOrPhysicalCoordination title="Grobmotorik / Körperkoordination" />
      </td>
      <td>
        <@forms.checkbox checked=schoolAndPromotionHints.leftHandedness title="Linkshändigkeit" />
      </td>
    </tr>
  </table>
</#macro>
