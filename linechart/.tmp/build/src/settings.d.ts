import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
declare class XAxisSetting extends FormattingSettingsCard {
    xAxisShow: formattingSettings.ToggleSwitch;
    minValue: formattingSettings.NumUpDown;
    maxValue: formattingSettings.NumUpDown;
    fontSize: formattingSettings.NumUpDown;
    fontFamily: formattingSettings.FontPicker;
    fontBold: formattingSettings.ToggleSwitch;
    fontItalic: formattingSettings.ToggleSwitch;
    fontUnderline: formattingSettings.ToggleSwitch;
    fontColor: formattingSettings.ColorPicker;
    textLabelX: formattingSettings.TextInput;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
declare class YAxisSetting extends FormattingSettingsCard {
    yAxisShow: formattingSettings.ToggleSwitch;
    fontSize: formattingSettings.NumUpDown;
    fontFamily: formattingSettings.FontPicker;
    fontBold: formattingSettings.ToggleSwitch;
    fontItalic: formattingSettings.ToggleSwitch;
    fontUnderline: formattingSettings.ToggleSwitch;
    fontColor: formattingSettings.ColorPicker;
    textLabelY: formattingSettings.TextInput;
    reverse: formattingSettings.ToggleSwitch;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
declare class LineSettings extends FormattingSettingsCard {
    LineShow: formattingSettings.ToggleSwitch;
    lineColor: formattingSettings.ColorPicker;
    lineThickness: formattingSettings.NumUpDown;
    lineDash: formattingSettings.NumUpDown;
    name: string;
    displayName?: string;
    slices: FormattingSettingsSlice[];
}
declare class MarkerSetting extends FormattingSettingsCard {
    markerShow: formattingSettings.ToggleSwitch;
    markerColor: formattingSettings.ColorPicker;
    markerThickness: formattingSettings.NumUpDown;
    markerDash: formattingSettings.NumUpDown;
    markerValue: formattingSettings.NumUpDown;
    name: string;
    displayName?: string;
    slices: FormattingSettingsSlice[];
}
/**
* visual settings model class
*
*/
export declare class VisualFormattingSettingsModel extends FormattingSettingsModel {
    xAxis: XAxisSetting;
    yAxis: YAxisSetting;
    line: LineSettings;
    marker: MarkerSetting;
    cards: FormattingSettingsCard[];
}
export {};
