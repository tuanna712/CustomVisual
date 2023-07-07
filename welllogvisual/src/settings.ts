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
// variable formattingSettings is use to setting properties of circle
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * Data Point Formatting Card
 */
export class CircleSettings extends FormattingSettingsCard{
    // 1st property is color, declare and init for color by a object of formattingSetting.ColorPicker
    public circleColor = new formattingSettings.ColorPicker({
        name: "circleColor", // name when call in visual.ts
        displayName: "Color", // name display on PBI
        value: { value: "#fffff8" } // init value
    });

    public circleBorderColor = new formattingSettings.ColorPicker({
        name: "circleBorderColor",
        displayName: "Color border", // name display on PBI
        value: { value: "#333" } // init value
    })

    public circleThickness = new formattingSettings.NumUpDown({
        name: "circleThickness", // name when call in visual.ts
        displayName: "Thickness", // name when display on PBI
        value: 2 // init value
    });


    public name: string = "circle"; // name when call in visual.ts
    public displayName: string = "Circle123"; // name display on PBI
    public slices: FormattingSettingsSlice[] = [this.circleColor, this.circleBorderColor, this.circleThickness] // display slice/ box to change value
}

export class VisualSettings extends FormattingSettingsModel {
    public circle: CircleSettings = new CircleSettings();
    public cards: FormattingSettingsCard[] = [this.circle];
}