<#import "../common/forms.ftlh" as forms />

<#macro content therapyAndPromotionInfo >
<#-- @ftlvariable name="therapyAndPromotionInfo" type="de.eshg.schoolentry.pdf.schoolinfoletter.model.SchoolInfoLetterTherapyAndPromotionInfo" -->
  <table style="width: 100%;">
    <colgroup>
      <col style="width: 20%" />
      <col style="width: 20%" />
      <col style="width: 20%" />
      <col style="width: 20%" />
      <col style="width: 20%" />
    </colgroup>
    <tr>
      <td>
        <@forms.checkbox checked=therapyAndPromotionInfo.speechTherapy title="Logopädie"/>
      </td>
      <td>
        <@forms.checkbox checked=therapyAndPromotionInfo.ergoTherapy title="Ergotherapie"/>
      </td>
      <td>
        <@forms.checkbox checked=therapyAndPromotionInfo.physioTherapy title="Krankengymnastik"/>
      </td>
      <td>
        <@forms.checkbox checked=therapyAndPromotionInfo.psychoMotorSkills title="Psychomotorik"/>
      </td>
      <td>
        <@forms.checkbox checked=therapyAndPromotionInfo.miscellaneous title="sonstiges"/>
      </td>
    </tr>
  </table>
</#macro>
