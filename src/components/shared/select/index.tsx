import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectItemType {
  value: string;
  label: string;
}

interface SelectButtonProps {
  placeholder: string;
  selectLabel: string;
  selectItems: SelectItemType[];
  onChange?: (value: string) => void;
}

export function SelectButton({
  placeholder,
  selectLabel,
  selectItems,
  onChange,
}: SelectButtonProps) {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-[200px] text-black p-7 text-lg font-semibold border rounded-xl shadow-sm bg-white hover:shadow-md transition">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-xl shadow-sm bg-white hover:shadow-md transition">
        <SelectGroup>
          <SelectLabel>{selectLabel}</SelectLabel>
          {selectItems.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="shadow-sm"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
