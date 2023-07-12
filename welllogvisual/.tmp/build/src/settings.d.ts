import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
/**
 * Data Point Formatting Card
 */
export declare class CircleSettings extends FormattingSettingsCard {
    circleShow: formattingSettings.ToggleSwitch;
    circleColor: formattingSettings.ColorPicker;
    circleBorderColor: formattingSettings.ColorPicker;
    circleThickness: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    slices: FormattingSettingsSlice[];
}
export declare class TextValueSetting extends FormattingSettingsCard {
    textValueShow: formattingSettings.ToggleSwitch;
    displayUnitsProperty: formattingSettings.AutoDropdown;
    fontColor: formattingSettings.ColorPicker;
    fontFamily: formattingSettings.FontPicker;
    fontSize: formattingSettings.NumUpDown;
    fontBold: formattingSettings.ToggleSwitch;
    fontItalic: formattingSettings.ToggleSwitch;
    fontUnderline: formattingSettings.ToggleSwitch;
    name: string;
    displayName: string;
    description?: string;
    slices: FormattingSettingsSlice[];
}
export declare class VisualSettings extends FormattingSettingsModel {
    circle: CircleSettings;
    textValue: TextValueSetting;
    cards: FormattingSettingsCard[];
}
