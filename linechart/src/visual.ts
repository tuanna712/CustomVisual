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

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.IVisualHost;
import ISelectionId = powerbi.visuals.ISelectionId;
import * as api from "powerbi-visuals-api"
import DataView = powerbi.DataView;
import * as d3 from "d3";
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

import { VisualFormattingSettingsModel } from "./settings";
import { ISelection } from "powerbi-models";

// import { interactivitySelectionService } from "powerbi-visuals-utils-interactivityutils";

interface Well{
    depth: number,
    gr: number
    other?: number
}

export class Visual implements IVisual {
    // field
    private host : IVisualHost;
    private selectionManager
    private svg: Selection<SVGElement>;
    private line: Selection<SVGElement>
    private line2: Selection<SVGElement>
    private yAxis: Selection<any>
    private xAxis: Selection<any>
    private textXLabel: Selection<SVGElement>
    private textYLabel: Selection<SVGElement>
    private marker: Selection<SVGElement>
    private tooltip: Selection<SVGElement>
    private point: Selection<SVGElement>
    // private bar: Selection<SVGAElement>
    
    // Formating
    private visualSetting: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    // Specify the chart’s dimensions.
    private width:number = 500
    private height:number = 250
    private marginTop:number = 20
    private marginRight:number = 30
    private marginBottom:number = 30
    private marginLeft:number = 40

    // private  dataArray2 : Well[]= []
    constructor(options: VisualConstructorOptions) {
        this.host = options.host
        // this.selectionManager = this.host
        this.formattingSettingsService = new FormattingSettingsService()   

        this.svg = d3.select(options.element).append('svg').classed("LineChart", true).attr("viewBox", [0, 0, this.width, this.height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .style("-webkit-tap-highlight-color", "transparent")
        
       
        this.line = this.svg
        .append("path")
        .classed("lineVertical", true)

        this.line2 = this.svg
        .append("path")
        .classed("lineVertical", true)

        this.xAxis = this.svg
            .append('g')
            .classed('xAxis', true);

        this.yAxis = this.svg
            .append('g')
            .classed('yAxis', true);

        this.textXLabel = this.svg.append("text")
        this.textYLabel = this.svg.append("text")

        this.marker = this.svg.append("line").classed("marker", true).attr("stroke-width", 0)
        this.tooltip = this.svg.append("g")
        this.point = this.svg.append("circle").style("fill", "blue").classed("point", true)
        
        //  cạnh đáy
        this.svg
        .append("line")
        .attr("x1", this.marginLeft)
        .attr("y1", this.height - this.marginBottom)
        .attr("x2", this.width - this.marginRight)
        .attr("y2", this.height - this.marginBottom)
        .attr("stroke", "black")

        // cạnh bên
        this.svg
        .append("line")
        .attr("x1", this.width - this.marginRight)
        .attr("y1", this.height - this.marginBottom)
        .attr("x2", this.width - this.marginRight)
        .attr("y2", this.marginTop)
        .attr("stroke", "black")


    }
    public update(options: VisualUpdateOptions) {
        let dataView: DataView = options.dataViews[0]
        let categoricalDataView = dataView.categorical
        let categories = categoricalDataView.categories[0]
        let categoriesValue = categories.values

        let mesures = categoricalDataView.values[0]
        let mesuresValue = mesures.values
        let mesuresHighlight = mesures.highlights

        
        this.visualSetting = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews)
        this.visualSetting.line.lineThickness.value = Math.max(0, this.visualSetting.line.lineThickness.value);
        this.visualSetting.line.lineThickness.value = Math.min(20, this.visualSetting.line.lineThickness.value);
         
        let view_width: number = options.viewport.width; // width of figure
        let view_height: number = options.viewport.height; // height of figure
        // assign width, height to svg (figure)
        this.svg.attr("width", view_width);
        this.svg.attr("height", view_height);

        let list_depth = <Array<number>>dataView.categorical.categories[0].values
        let list_gr = <Array<number>>dataView.categorical.values[0].values
        // let list_other = <Array<number>>dataView.categorical.values[1].values


        var dataArray2: Well[] = []
        for (var i = 0; i < list_depth.length; i++){
            dataArray2.push({
                depth: list_depth[i],
                gr: list_gr[i],
                // other: list_other[i]
            })
        }
        // sort
        dataArray2.sort((a:Well, b:Well) => a.depth - b.depth)
        // split dataArray2 to 2 array
        const gr_array = dataArray2.map((d:Well) => d.gr)
        const other_array = dataArray2.map((d:Well) => d.other)
        const depth_array = dataArray2.map((d:Well) => d.depth)

        var minValue:number, maxValue:number

        if (this.visualSetting.xAxis.maxValue.value <= 0 && this.visualSetting.xAxis.minValue.value <= 0 ){
            minValue = d3.min(gr_array)
            maxValue = d3.max(gr_array)
        }
        else {
            minValue =  this.visualSetting.xAxis.minValue.value, 
            maxValue = this.visualSetting.xAxis.maxValue.value
        }
        const x = d3
        .scaleLinear()
        .domain([minValue, maxValue])
        .range([this.marginLeft, this.width - this.marginRight])
        const y = d3
            .scaleLinear()
            .range([this.marginTop, this.height - this.marginBottom])
        

        // revert y axis
        const reverse = this.visualSetting.yAxis.reverse.value
        // this.svg.selectAll(".yAxis").remove()
        if(reverse === true){
            y.domain([d3.max(depth_array), d3.min(depth_array)])
        }
        else {
            y.domain([d3.min(depth_array), d3.max(depth_array)])
        }

        // caculate value of marker on y axis
        const domain_distance = d3.max(depth_array) - d3.min(depth_array)

        // Add the horizontal axis.
        this.xAxis
        .call(
            d3
            .axisTop(x)
            .ticks(this.width / 80)
            .tickSizeOuter(0),
        )

        //   Grid vertical
        .call((g) =>
            g
            .selectAll(".tick line")
            // .clone()
            .attr("y2", this.height - this.marginTop - this.marginBottom)
            .attr("stroke-opacity", 0.1),
        )
     
        // .call((g) => g.select(".domain").remove()) // nếu muốn bỏ thanh dọc các trị thì bỏ comment
        //  add text label x axis
        this.textXLabel
        .attr("x", this.width / 2 )
        .attr("y", -this.marginTop )
        .style("text-anchor", "middle")
        .text(this.visualSetting.xAxis.textLabelX.value);
        // Add the vertical axis, a grid and an axis label.
       
        this.yAxis
        .classed("yAxis", true)
        .attr("transform", `translate(${this.marginLeft},0)`)
        .call(d3.axisLeft(y))
        //   .call((g) => g.select(".domain").remove())
        // grid horizontal
        .call((g) =>
            g
            .selectAll(".tick line")
            // .clone()
            .attr("x2", this.width - this.marginLeft - this.marginRight)
            .attr("stroke-opacity", 0.1),
        )

        this.textYLabel
        .attr("transform", "rotate(-90)")
        .attr("x", -100)
        .attr("y", 5)
        .style("text-anchor", "middle")
        .text(this.visualSetting.yAxis.textLabelY.value)

        
        // vertical line chart
        const line:any = d3
        .line()
        .x((d:any) => x(d.gr))
        .y((d:any) => y(d.depth))

        const line2:any = d3
        .line()
        .x((d:any) => x(d.other))
        .y((d:any) => y(d.depth))

        this.line
        .datum(dataArray2)
        .attr("fill", "none")
        .attr("stroke", this.visualSetting.line.lineColor.value.value)
        .attr("stroke-width", this.visualSetting.line.lineThickness.value)
        .attr("stroke-dasharray", this.visualSetting.line.lineDash.value)
        .attr("d", line)
        // .on("mousemove", () => {
        //     this.line.attr("stroke", "red")
        // })
        // .on("mouseout", () => {
        //     this.line.attr("stroke", "blue")
        // })
        // .on("click", () => {
        //     this.line.attr("stroke", "yellow")
        // })

        if (dataArray2.length == 1) {
            this.point
            .attr("cx", 100)
            .attr("cy", 100)
            .attr("r", 1)
        }

        // d3.selectAll(".point").remove()
        


        
        
        // second line
        // this.line2
        // .datum(dataArray2)
        // .attr("fill", "none")
        // .attr("stroke", "blue")
        // .attr("stroke-width", this.visualSetting.line.lineThickness.value)
        // .attr("stroke-dasharray", this.visualSetting.line.lineDash.value)
        // .attr("d", line2)

        // marker
        const value = this.visualSetting.marker.markerValue.value
        this.marker
        .attr("stroke", this.visualSetting.marker.markerColor.value.value)
        .attr("stroke-width", this.visualSetting.marker.markerThickness.value)
        .attr("x1", this.marginLeft)
        .attr("x2", this.width - this.marginRight)
        .attr("stroke-dasharray", this.visualSetting.marker.markerDash.value)

        var y_marker_value:number
        if(reverse === true){
            y_marker_value = this.marginTop + ((d3.max(depth_array) - value)/domain_distance)*(this.height - this.marginBottom -this.marginTop)
        }
        else {
            y_marker_value = this.marginTop + ((value - d3.min(depth_array))/domain_distance)*(this.height - this.marginBottom -this.marginTop)
        }
        this.marker
        .attr("y1", y_marker_value)
        .attr("y2", y_marker_value)

        const makerShow = this.visualSetting.marker.markerShow.value
        if (!makerShow) 
            this.marker.attr("stroke-width", 0)
        
    

        // tooltips
        const path = this.tooltip.selectAll("path")
            .data([,])
            .join("path")
            .attr("fill", "white")
            .attr("stroke", "black");

    }
        
        
    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        var yAxisSetting = this.visualSetting.yAxis
        var xAxisSetting = this.visualSetting.xAxis
        var lineSetting = this.visualSetting.line

        let line:powerbi.visuals.FormattingCard = {
            description: "Line Description",
            displayName: "Line",
            uid: "Line_uid",
            topLevelToggle: {
                uid: "line_topLevelToggle_showToggleSwitch_uid",
                suppressDisplayName: true,
                control: {
                    type: powerbi.visuals.FormattingComponent.ToggleSwitch,
                    properties: {
                        descriptor: {
                            objectName: "line",
                            propertyName: "show"
                        },
                        value: lineSetting.LineShow.value
                    }
                }
            },
            groups: [
               
                {
                    displayName: "Line",
                    uid: "line_uid",
                    slices: [
                        {
                            uid: "lineColor_uid",
                            displayName: "Line Color",
                            control: {
                                type: powerbi.visuals.FormattingComponent.ColorPicker,
                                properties: {
                                    descriptor: {
                                        objectName: "line",
                                        propertyName: "lineColor"
                                    },
                                    value: { value: lineSetting.lineColor.value.value }
                                }
                            }

                        },
                        {
                            uid: "line_Thickness_uid",
                            displayName: "Line Thickness",
                            control: {
                                type: powerbi.visuals.FormattingComponent.NumUpDown,
                                properties: {
                                    descriptor: {
                                        objectName: "line",
                                        propertyName: "lineThickness"
                                    },
                                    value: lineSetting.lineThickness.value
                                }
                            }
                        },
                        {
                            uid: "line_Dash_uid",
                            displayName: "Line Dash",
                            control: {
                                type: powerbi.visuals.FormattingComponent.NumUpDown,
                                properties: {
                                    descriptor: {
                                        objectName: "line",
                                        propertyName: "lineDash"
                                    },
                                    value: lineSetting.lineDash.value
                                }
                            }
                        }
                    ]
                }
                

            ],
            revertToDefaultDescriptors: [
                {
                    objectName: "line",
                    propertyName: "lineColor"
                },
                
                {
                    objectName: "line",
                    propertyName: "lineThickness"
                },

                {
                    objectName: "line",
                    propertyName: "lineThickness"
                },
            ]
        }
        let marker :powerbi.visuals.FormattingCard = {
            description: "Marker Description",
            displayName: "Marker",
            uid: "Marker_uid",
            topLevelToggle: {
                uid: "Marker_topLevelToggle_showToggleSwitch_uid",
                suppressDisplayName: true,
                control: {
                    type: powerbi.visuals.FormattingComponent.ToggleSwitch,
                    properties: {
                        descriptor: {
                            objectName: "marker",
                            propertyName: "show"
                        },
                        value: this.visualSetting.marker.markerShow.value
                    }
                }
            },
            groups: [
               
                {
                    displayName: "Marker",
                    uid: "Marker_uid",
                    slices: [
                        {
                            uid: "MarkerColor_uid",
                            displayName: "Marker Color",
                            control: {
                                type: powerbi.visuals.FormattingComponent.ColorPicker,
                                properties: {
                                    descriptor: {
                                        objectName: "marker",
                                        propertyName: "markerColor"
                                    },
                                    value: { value: this.visualSetting.marker.markerColor.value.value }
                                }
                            }

                        },
                        {
                            uid: "Marker_Thickness_uid",
                            displayName: "Marker Thickness",
                            control: {
                                type: powerbi.visuals.FormattingComponent.NumUpDown,
                                properties: {
                                    descriptor: {
                                        objectName: "marker",
                                        propertyName: "markerThickness"
                                    },
                                    value: this.visualSetting.marker.markerThickness.value
                                }
                            }
                        },
                        {
                            uid: "marker_Dash_uid",
                            displayName: "marker Dash",
                            control: {
                                type: powerbi.visuals.FormattingComponent.NumUpDown,
                                properties: {
                                    descriptor: {
                                        objectName: "marker",
                                        propertyName: "markerDash"
                                    },
                                    value: this.visualSetting.marker.markerDash.value
                                }
                            }
                        }, 
                        {
                            uid: "marker_Value_uid",
                            displayName: "Marker Value",
                            control: {
                                type: powerbi.visuals.FormattingComponent.NumUpDown,
                                properties: {
                                    descriptor: {
                                        objectName: "marker",
                                        propertyName: "markerValue"
                                    },
                                    value: this.visualSetting.marker.markerValue.value
                                }
                            }
                        }
                    ]
                }
                

            ],
            revertToDefaultDescriptors: [
                {
                    objectName: "marker",
                    propertyName: "markerColor"
                },
                
                {
                    objectName: "marker",
                    propertyName: "markerThickness"
                },

                {
                    objectName: "marker",
                    propertyName: "markerDash"
                },
                {
                    objectName: "marker",
                    propertyName: "markerValue"
                },
            ]
        }  

        let xAxis:powerbi.visuals.FormattingCard = {
            description: "X axis Description",
            displayName: "X axis",
            uid: "x_axis_uid",
            groups: [
                {
                    displayName: "Range",
                    uid: "range_group_uid",
                    slices: [
                        {
                            uid: "minimize_slice_uid",
                            displayName: "Minimize",
                            control: {
                                type: powerbi.visuals.FormattingComponent.NumUpDown,
                                properties: {
                                    descriptor: {
                                        objectName: "xAxis",
                                        propertyName: "minValue"
                                    },
                                    value: xAxisSetting.minValue.value
                                }
                            }
                        },
                        {
                            uid: "maximize_slice_uid",
                            displayName: "Maximize",
                            control: {
                                type: powerbi.visuals.FormattingComponent.NumUpDown,
                                properties: {
                                    descriptor: {
                                        objectName: "xAxis",
                                        propertyName: "maxValue"
                                    },
                                    value: xAxisSetting.maxValue.value
                                }
                            }
                        }
                    ]
                },
                {
                    displayName: "Title",
                    uid: "xAxis_title_group_uid",
                    slices: [
                        {
                            displayName: "Title X label",
                            uid: "title_x_label_slice_uid",
                            control: {
                                type: powerbi.visuals.FormattingComponent.TextInput,
                                properties: {
                                    placeholder: "Auto",
                                    descriptor: {
                                        objectName: "xAxis",
                                        propertyName: "textLabelX"
                                    },
                                    value: xAxisSetting.textLabelX.value
                                }
                            }
                        }
                    ]
                }
            ]
        }
        let yAxis:powerbi.visuals.FormattingCard = {
            description: "Y axis Description",
            displayName: "Y axis",
            uid: "y_axis_uid",
            topLevelToggle: {
                uid: "y_axis_topLevelToggle_showToggleSwitch_uid",
                suppressDisplayName: true,
                control: {
                    type: powerbi.visuals.FormattingComponent.ToggleSwitch,
                    properties: {
                        descriptor: {
                            objectName: "yAxis",
                            propertyName: "show"
                        },
                        value: yAxisSetting.yAxisShow.value
                    }
                }
            },
            groups: [
                {
                    displayName: "Font Control Group",
                    uid: "font_control_group_uid",
                    slices: [
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
                                        value: yAxisSetting.fontFamily.value
                                    },
                                    fontSize: {
                                        descriptor: {
                                            objectName: "textValue",
                                            propertyName: "fontSize"
                                        },
                                        value: yAxisSetting.fontSize.value
                                    },
                                    bold: {
                                        descriptor: {
                                            objectName: "textValue", 
                                            propertyName: "fontBold"
                                        },
                                        value: yAxisSetting.fontBold.value
                                    },
                                    italic: {
                                        descriptor: {
                                            objectName: "textValue", 
                                            propertyName: "fontItalic"
                                        },
                                        value: yAxisSetting.fontItalic.value
                                    },
                                    underline: {
                                        descriptor: {
                                            objectName: "textValue",
                                            propertyName: "fontUnderline"
                                        },
                                        value: yAxisSetting.fontUnderline.value
                                    }
        
                                }
                            }
                        }
                    ]
                },
                {
                    displayName: "Reverse Y axis",
                    uid: "reverse_y_axis_uid",
                    slices: [
                        {
                            uid: "reverse_y_axis_slice_uid",
                            displayName: "Reverse Y axis",
                            control: {
                                type: powerbi.visuals.FormattingComponent.ToggleSwitch,
                                properties: {
                                        descriptor: {
                                            objectName: "yAxis",
                                            propertyName: "reverseY"
                                        },
                                        value: yAxisSetting.reverse.value
                                }
                            }
                        }
                    ]
                },
                {
                    displayName: "Title",
                    uid: "yAxis_title_group_uid",
                    slices: [
                        {
                            displayName: "Title Y label",
                            uid: "title_y_label_slice_uid",
                            control: {
                                type: powerbi.visuals.FormattingComponent.TextInput,
                                properties: {
                                    placeholder: "Auto",
                                    descriptor: {
                                        objectName: "yAxis",
                                        propertyName: "textLabelY"
                                    },
                                    value: yAxisSetting.textLabelY.value
                                }
                            }
                        }
                    ]
                }
            ],
        }
        const formattingModel:powerbi.visuals.FormattingModel = {cards: [line, xAxis, yAxis, marker]}
        return formattingModel
        // return this.formattingSettingsService.buildFormattingModel(this.visualSetting);
    }
   
}