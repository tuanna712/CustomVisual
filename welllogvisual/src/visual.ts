/*
*  Power BI Visual CLI
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
// import thư viện
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import IVisualHost = powerbi.extensibility.IVisualHost;
import * as d3 from "d3";
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

import { VisualSettings } from "./settings";
import { FormattingSettingsService, formattingSettings } from "powerbi-visuals-utils-formattingmodel";

export class Visual implements IVisual {
    private host : IVisualHost;
    private svg: Selection<SVGElement>;
    private container: Selection<SVGElement>;
    private circle: Selection<SVGElement>;
    private textValue: Selection<SVGElement>;
    private textLabel: Selection<SVGElement>;

    // visual setting from setting
    private visualSettings: VisualSettings;
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: VisualConstructorOptions) {
        this.formattingSettingsService = new FormattingSettingsService();
        // create svg element
        this.svg = d3.select(options.element)
            .append('svg')
            .classed('circleCard', true);
        this.container = this.svg.append("g")
            .classed('container', true);
        this.circle = this.container.append("circle")
            .classed('circle', true);
        this.textValue = this.container.append("text")
            .classed("textValue", true);
        this.textLabel = this.container.append("text")
            .classed("textLabel", true);
        
    }

    public update(options: VisualUpdateOptions) {
        // define variable for width, height
        // console.log(options)
        // debugger
        let dataView: DataView = options.dataViews[0] // get data
        let width: number = options.viewport.width; // width of figure
        let height: number = options.viewport.height; // height of figure
        // assign width, height to svg (figure)
        this.svg.attr("width", width);
        this.svg.attr("height", height);
        let radius: number = Math.min(width, height) / 2.2; // radius of cirle

        this.visualSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualSettings, options.dataViews);
        this.visualSettings.circle.circleThickness.value = Math.max(0, this.visualSettings.circle.circleThickness.value);
        this.visualSettings.circle.circleThickness.value = Math.min(20, this.visualSettings.circle.circleThickness.value);
        // property of circle
        this.circle
            .style("fill", this.visualSettings.circle.circleColor.value.value) // style background color of the circle
            .style("fill-opacity", 1) // style background opacity of the circle
            .style("stroke", this.visualSettings.circle.circleBorderColor.value.value) // style border color of the circle
            .style("stroke-width", this.visualSettings.circle.circleThickness.value) // style border width of the circle
            .attr("r", radius) // assign radius of circle
            .attr("cx", width / 2)  // center of circle in the figure on x axes
            .attr("cy", height / 2); // center of circle in the figure on y axes
        let fontSizeValue: number = Math.min(width, height) / 4;
        // text value
        var bold:string = "normal"
        var italic:string = "normal"
        var underline:string = "none"
        if (this.visualSettings.textValue.fontBold.value == true){
            bold = "bold"
        }

        if (this.visualSettings.textValue.fontItalic.value == true){
            italic = "italic"
        }
        if (this.visualSettings.textValue.fontUnderline.value == true){
            underline = "underline"
        }
        
        this.textValue
            // .text(dataView.categorical.values[0].values.toString()) // value in circle chart
            .text(dataView.single.value.toString())
            .attr("x", "50%") // position of text in the circle on x axes
            .attr("y", "50%") // position of text in the circle on y axes
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("font-family", this.visualSettings.textValue.fontFamily.value)
            .style("font-size", this.visualSettings.textValue.fontSize.value.toString() + "px")
            .style("fill", this.visualSettings.textValue.fontColor.value.value)
            .style("font-weight", bold)
            .style("font-style", italic)
            .style("text-decoration", underline)


            
        let fontSizeLabel: number = fontSizeValue / 4;
        //  text label
        this.textLabel
            .text(dataView.metadata.columns[0].displayName) // content of text
            .attr("x", "50%")
            .attr("y", height / 2)
            .attr("dy", fontSizeValue / 1.2)
            .attr("text-anchor", "middle")
            .style("font-size", fontSizeLabel + "px");
    }
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        var visCirle = this.visualSettings.circle
        var visTextValue = this.visualSettings.textValue

        let circle:powerbi.visuals.FormattingCard = {
            description: "Circle Description",
            displayName: "Circle",
            uid: "Circle_uid",
            topLevelToggle: {
                uid: "circle_topLevelToggle_showToggleSwitch_uid",
                suppressDisplayName: true,
                control: {
                    type: powerbi.visuals.FormattingComponent.ToggleSwitch,
                    properties: {
                        descriptor: {
                            objectName: "circle",
                            propertyName: "show"
                        },
                        value: visCirle.circleShow.value
                    }
                }
            },
            groups: [
                {
                    displayName: "Circle",
                    uid: "circle_uid",
                    slices:[
                        {
                            uid: "circleColor_uid",
                            displayName: "Circle Color",
                            control: {
                                type: powerbi.visuals.FormattingComponent.ColorPicker,
                                properties: {
                                    descriptor: {
                                        objectName: "circle",
                                        propertyName: "circleColor"
                                    },
                                    value: { value: visCirle.circleColor.value.value }
                                }
                            }
                        },
                        {
                            uid: "circleBorderColor_uid",
                            displayName: "Circle Border Color",
                            control: {
                                type: powerbi.visuals.FormattingComponent.ColorPicker,
                                properties: {
                                    descriptor: {
                                        objectName: "circle",
                                        propertyName: "circleBorderColor"
                                    },
                                    value: { value: visCirle.circleBorderColor.value.value }
                                }
                            }
                        },
                        {
                            uid: "circle_Thickness_uid",
                            displayName: "Circle Thickness",
                            control: {
                                type: powerbi.visuals.FormattingComponent.NumUpDown,
                                properties: {
                                    descriptor: {
                                        objectName: "circle",
                                        propertyName: "circleThickness"
                                    },
                                    value: visCirle.circleThickness.value
                                }
                            }
                        }
                    ]
                }, 
                
            ],
            revertToDefaultDescriptors: [
                {
                    objectName: "circle",
                    propertyName: "circleColor"
                },
                {
                    objectName: "circle",
                    propertyName: "circleBoderColor"
                },
                {
                    objectName: "circle",
                    propertyName: "circleThickness"
                },
            ]
        }
        let textValue: powerbi.visuals.FormattingCard = {
            description: "Text value Description",
            displayName: "Text Value",
            uid: "textValue_uid",
            topLevelToggle: {
                uid: "textValue_topLevelToggle_showToggleSwitch_uid",
                suppressDisplayName: true,
                control: {
                    type: powerbi.visuals.FormattingComponent.ToggleSwitch,
                    properties: {
                        descriptor: {
                            objectName: "textValue",
                            propertyName: "show"
                        },
                        value: visTextValue.textValueShow.value
                    }
                }
            },
            groups: [],
            
            revertToDefaultDescriptors: [
                {
                    objectName: "textValue",
                    propertyName:"displayUnitsProperty"
                },
                {
                    objectName: "textValue",
                    propertyName: "fontFamily"
                },
                {
                    objectName: "textValue",
                    propertyName: "fontSize"
                },
                {
                    objectName: "textValue",
                    propertyName: "fontColor"
                },
                {
                    objectName: "textValue",
                    propertyName: "fontBold",
                },
                {
                    objectName: "textValue",
                    propertyName: "fontItalic"
                },
                {
                    objectName: "textValue",
                    propertyName: "fontUnderline"
                },
        
                // ... the rest of properties descriptors 
            ]
        }

        let group1_dataFont: powerbi.visuals.FormattingGroup = {
            displayName: "Font Control Group",
            uid: "textValue_fontControl_group_uid",
            slices: [
                // simple slice: 
                {
                    uid: "textValue_fontControl_displayUnits_uid",
                    displayName: "display units",
                    control: {
                        type: powerbi.visuals.FormattingComponent.Dropdown,
                        properties: {
                            descriptor: {
                                objectName: "textValue",
                                propertyName: "displayUnitsProperty",
                            },
                            value: 0
                        }
                    }

                },

                {
                    uid: "data_font_control_slice_uid",
                    displayName: "Font",
                    control: {
                        type: powerbi.visuals.FormattingComponent.FontControl,
                        properties: {
                            fontFamily: {
                                descriptor: {
                                    objectName: "textValue",
                                    propertyName: "fontFamily"
                                },
                                value: visTextValue.fontFamily.value
                            },
                            fontSize: {
                                descriptor: {
                                    objectName: "textValue",
                                    propertyName: "fontSize"
                                },
                                value: visTextValue.fontSize.value
                            },
                            bold: {
                                descriptor: {
                                    objectName: "textValue", 
                                    propertyName: "fontBold"
                                },
                                value: visTextValue.fontBold.value
                            },
                            italic: {
                                descriptor: {
                                    objectName: "textValue", 
                                    propertyName: "fontItalic"
                                },
                                value: visTextValue.fontItalic.value
                            },
                            underline: {
                                descriptor: {
                                    objectName: "textValue",
                                    propertyName: "fontUnderline"
                                },
                                value: visTextValue.fontUnderline.value
                            }

                        }
                    }
                }
            ]
        }

        let group2_dataDesign: powerbi.visuals.FormattingGroup = {
            displayName: "Data Design Group",
            uid: "textValue_dataDesign_group_uid",
            slices: [
                // font color
                {
                    displayName: "Font Color",
                    uid: "textValue_dataDesign_fontColor_slice",
                    control: {
                        type: powerbi.visuals.FormattingComponent.ColorPicker,
                        properties: {
                            descriptor: {
                                objectName: "textValue",
                                propertyName: "fontColor"
                            },
                            value: { value: visTextValue.fontColor.value.value}
                        }
                    }
                },
                // Align
                {
                    displayName: "Line Alignment",
                    uid: "textValue_dataDesign_lineAlignment_slice",
                    control: {
                        type: powerbi.visuals.FormattingComponent.AlignmentGroup,
                        properties: {
                            descriptor: {
                                objectName: "textValue",
                                propertyName: "lineAlignment"
                            },
                            mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
                            value: "right"
                        }
                    }
                }
            ]
        }

        // add formating group to textValue
        textValue.groups.push(group1_dataFont)
        textValue.groups.push(group2_dataDesign)
        
        // Build and return formatting model with data card
        const formattingModel: powerbi.visuals.FormattingModel = { cards: [circle, textValue] };
        return formattingModel
        // return this.formattingSettingsService.buildFormattingModel(this.visualSettings);
    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    // public getFormattingModel(): powerbi.visuals.FormattingModel {
    //     return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    // }
}