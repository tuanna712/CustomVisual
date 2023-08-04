import powerbi from "powerbi-visuals-api";
import "./../style/visual.less";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
export declare class Visual implements IVisual {
    private host;
    private selectionManager;
    private svg;
    private line;
    private line2;
    private yAxis;
    private xAxis;
    private textXLabel;
    private textYLabel;
    private marker;
    private tooltip;
    private point;
    private visualSetting;
    private formattingSettingsService;
    private width;
    private height;
    private marginTop;
    private marginRight;
    private marginBottom;
    private marginLeft;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property.
     */
    getFormattingModel(): powerbi.visuals.FormattingModel;
}
