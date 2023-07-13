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
import DataView = powerbi.DataView;
import * as d3 from "d3";
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
    // field
    private host : IVisualHost;
    private svg: Selection<SVGElement>;
    private container: Selection<SVGElement>;
    private line: Selection<SVGElement>
    private xAxis:Selection<SVGElement>
    
    private visualSetting: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: VisualConstructorOptions) {
        this.formattingSettingsService = new FormattingSettingsService()   
        
        this.svg = d3.select(options.element).append('svg').classed("LineChart", true)

        this.container = this.svg.append("g").classed("container", true)

        this.line = this.container.append("line").classed("line", true)

        this.xAxis = this.container.append("text").classed("textLabel", true)
        // scale
        // var xScale = d3.scaleLinear().domain([0, 5]).range([500, 0])

        // var yScale = d3.scaleLinear().domain([0, 10]).range([500, 0])

        // // axes
        // var x_axis = d3.axisBottom(xScale)
        // var y_axis = d3.axisLeft(yScale)

        // // call axis
        // this.svg.append("g")
        // .attr("transform", `translate(20, 500)`)
        // .call(x_axis)
        // this.svg.append("g")
        // .attr("transform", "translate(20, 5)")
        // .call(y_axis)

       
       
    
    }
    public update(options: VisualUpdateOptions) {
        let dataView: DataView = options.dataViews[0]
        let view_width: number = options.viewport.width; // width of figure
        let view_height: number = options.viewport.height; // height of figure
        // assign width, height to svg (figure)
        this.svg.attr("width", view_width);
        this.svg.attr("height", view_height);
    
        var data = <Array<number>>dataView.categorical.values[0].values.slice(0, 5)

        const margin = { top: 50, right: 50, bottom: 50, left: 50};
        const width = 400 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

 

        const x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);

 

        const y = d3.scaleLinear()
            .range([height, 0]);

 

        const chart = this.svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

 

        x.domain(<Array<string>>dataView.categorical.categories[0].values.slice(0, 5));
        y.domain([0, d3.max(data)]);

 

        chart.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", (d, i) => x(i.toString())!)
            .attr("y", (d) => y(d))
            .attr("width", x.bandwidth())
            .attr("height", (d) => height - y(d));

 

        chart.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

 

        chart.append("g")
            .call(d3.axisLeft(y));


        
        

        this.visualSetting = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews)
       
        // this.line
        //     .attr("x1", "0")
        //     .attr("y1", "0")
        //     .attr("x2", width / 3)
        //     .attr("y2", height / 3)
        //     .attr("stroke", this.visualSetting.line.lineColor.value.value)
        // var bold:string = "normal"
        // var italic:string = "normal"
        // var underline:string = "none"
        // if (this.visualSetting.xAxis.fontBold.value == true){
        //     bold = "bold"
        // }

        // if (this.visualSetting.xAxis.fontItalic.value == true){
        //     italic = "italic"
        // }
        // if (this.visualSetting.xAxis.fontUnderline.value == true){
        //     underline = "underline"
        // }
        // this.xAxis
        // .attr("font-family", this.visualSetting.xAxis.fontFamily.value)
        // .style("font-size", this.visualSetting.xAxis.fontSize.value.toString() + "px")
        // .style("fill", this.visualSetting.xAxis.fontColor.value.value)
        // .style("font-weight", bold)
        // .style("font-style", italic)
        // .style("text-decoration", underline)
        }
        



    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.visualSetting);
    }
   
}