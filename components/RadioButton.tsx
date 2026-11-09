import React from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import clsx from "clsx";

interface RadioButtonProps {
  value: any;
  onValueChange: (value: any) => void;
  items: string[];
  itemsValue: any[];
  defaultValue?: any;
  classNameGroup?: string;
  classNameItemContainer?: string;
  classNameItem?: string;
  classNameLabel?: string;
  classNameLabelWhenChecked?: string;
  classNameItemWhenChecked?: string;
  classNameItemContainerWhenChecked?: string;
  disabled?: boolean;
}
const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  onValueChange,
  items,
  itemsValue,
  defaultValue,
  classNameGroup,
  classNameItemContainer,
  classNameItem,
  classNameLabel,
  classNameLabelWhenChecked,
  classNameItemWhenChecked,
  classNameItemContainerWhenChecked,
  disabled,
}) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className={clsx("flex flex-row justify-between w-full", classNameGroup)}
      defaultValue={defaultValue ?? items[0]}
      disabled={disabled}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={clsx(
            "flex items-center rounded-lg transition-all",
            value === itemsValue[index] && classNameItemContainerWhenChecked,
            classNameItemContainer,
          )}
        >
          <RadioGroupItem
            value={itemsValue[index]}
            id={item}
            className={clsx(
              "mr-2",
              classNameItem,
              value === itemsValue[index] && classNameItemWhenChecked,
            )}
          />
          <Label
            htmlFor={item}
            className={clsx(
              value === itemsValue[index] && classNameLabelWhenChecked,
              classNameLabel,
            )}
          >
            {item}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default RadioButton;
