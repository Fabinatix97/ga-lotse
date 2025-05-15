<#import "../common/forms.ftlh" as forms />

<#macro content therapyAndPromotionInfo="NUL" >
<#-- @ftlvariable name="therapyAndPromotionInfo" type="de.eshg.schoolentry.pdf.schoolinfoletter.model.SchoolInfoLetterTherapyAndPromotionInfoDto" -->
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
        <@forms.checkbox checked=therapyAndPromotionInfo?isHash && therapyAndPromotionInfo.speechTherapy title="Logopädie"/>
      </td>
      <td>
        <@forms.checkbox checked=therapyAndPromotionInfo?isHash && therapyAndPromotionInfo.ergoTherapy title="Ergotherapie"/>
      </td>
      <td>
        <@forms.checkbox checked=therapyAndPromotionInfo?isHash && therapyAndPromotionInfo.physioTherapy title="Krankengymnastik"/>
      </td>
      <td>
        <@forms.checkbox checked=therapyAndPromotionInfo?isHash && therapyAndPromotionInfo.psychoMotorSkills title="Psychomotorik"/>
      </td>
      <td>
        <@forms.checkbox checked=therapyAndPromotionInfo?isHash && therapyAndPromotionInfo.miscellaneous title="sonstiges"/>
      </td>
    </tr>
  </table>
</#macro>
