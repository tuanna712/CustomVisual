/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;


class XAxisSetting extends FormattingSettingsCard {
   public xAxisShow = new formattingSettings.ToggleSwitch({
    name: "show",
    displayName: undefined,
    value: true
   })
   public fontSize = new formattingSettings.NumUpDown({
    name: "fontSize",
    displayName: "Font Size",
    value: 16
   }) 
   public fontFamily = new formattingSettings.FontPicker({
    name: "fontFamily",
    displayName: "Font Family",
    value: "wf_standard-font, helvetica, arial, sans-serif"
   })
   public fontBold = new formattingSettings.ToggleSwitch({
    name: "fontBold",
    displayName: "Font Bold",
    value: false
   })

   public fontItalic = new formattingSettings.ToggleSwitch({
    name: "fontItalic",
    displayName: "Font Italic",
    value: false
   })
   public fontUnderline = new formattingSettings.ToggleSwitch({
    name: "fontUnderline",
    displayName: "Font Underline",
    value: false
   })
   public fontColor = new formattingSettings.ColorPicker({
    name: "fontColor",
    displayName: "Font Color",
    value: {value: "#333"}
   })


    name: string = "xAxis";
    displayName: string = "X-Axis";
    slices: Array<FormattingSettingsSlice> = [this.xAxisShow, this.fontSize, this.fontFamily, this.fontBold, this.fontItalic, this.fontUnderline, this.fontColor];
}

class YAxisSetting extends FormattingSettingsCard{
    public yAxisShow = new formattingSettings.ToggleSwitch({
    name: "show",
    displayName: undefined,
    value: true
   })
   public fontSize = new formattingSettings.NumUpDown({
    name: "fontSize",
    displayName: "Font Size",
    value: 16
   }) 
   public fontFamily = new formattingSettings.FontPicker({
    name: "fontFamily",
    displayName: "Font Family",
    value: "wf_standard-font, helvetica, arial, sans-serif"
   })
   public fontBold = new formattingSettings.ToggleSwitch({
    name: "fontBold",
    displayName: "Font Bold",
    value: false
   })

   public fontItalic = new formattingSettings.ToggleSwitch({
    name: "fontItalic",
    displayName: "Font Italic",
    value: false
   })
   public fontUnderline = new formattingSettings.ToggleSwitch({
    name: "fontUnderline",
    displayName: "Font Underline",
    value: false
   })
   public fontColor = new formattingSettings.ColorPicker({
    name: "fontColor",
    displayName: "Font Color",
    value: {value: "#333"}
   })


    name: string = "yAxis";
    displayName: string = "Y-Axis";
    slices: Array<FormattingSettingsSlice> = [this.yAxisShow, this.fontSize, this.fontFamily, this.fontBold, this.fontItalic, this.fontUnderline, this.fontColor];
}

class LineSettings extends FormattingSettingsCard{
    public lineColor = new formattingSettings.ColorPicker({
        name: "lineColor",
        displayName: "Line Color",
        value: {value: "#000000"}
    })

    name: string = "line"
    displayName?: string = "Line"
    slices: Array<FormattingSettingsSlice> = [this.lineColor]

}


/**
* visual settings model class
*
*/
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    xAxis = new XAxisSetting()
    yAxis = new YAxisSetting()
    line = new LineSettings()

    cards = [this.xAxis, this.yAxis, this.line];
}
