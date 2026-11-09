"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Company } from "@/types/types";
import { cx } from "class-variance-authority";

interface Props {
  defaultValue?: string;
  options: any[];
  onSelect: (value: any) => void;
  classNameButton?: string;
}

export function SearchableCombobox({
  defaultValue = "",
  options,
  onSelect,
  classNameButton,
}: Props) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");
  const [selectedOption, setSelectedOption] = React.useState<
    string | undefined
  >();

  // Filter options based on search input (search companyName)
  const filteredOptions = options?.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase()),
  );

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  React.useEffect(() => {
    const selectedOption =
      options.find((option) => option.name === value) || defaultValue;
    setSelectedOption(selectedOption?.name || defaultValue);
  }, [value, options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cx(
            selectedOption ? "text-black" : "text-muted-foreground",
            "w-full md:max-w-96 justify-between font-medium text-sm focus:ring-1 focus:ring-primary rounded-md",
            classNameButton,
          )}
        >
          <span className="truncate">
            {selectedOption
              ? `${selectedOption}`
              : "Select company or school..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-fit max-w-96 divide-y-2">
        <Command>
          <CommandInput
            placeholder="Search companies or schools..."
            defaultValue={defaultValue}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty
              onClick={() => {
                setSelectedOption(search);
                onSelect(search);
                setOpen(false);
              }}
              className="m-1 rounded-sm py-4 px-2 text-sm text-center font-semibold cursor-pointer text-white bg-primary hover:bg-primary-hover"
            >
              + Create
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions?.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                    setSearch("");
                    onSelect(currentValue);
                  }}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      value === option.name ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="font-medium">{option.name}</div>
                    {/* <div className="text-sm text-muted-foreground truncate">
                      {option.location?.address}
                    </div> */}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SearchableCombobox;
