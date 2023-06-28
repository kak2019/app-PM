import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Label } from '@fluentui/react/lib/Label';
import { Dropdown, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import {
    DatePicker,
    IDatePickerStyles,
    addDays
} from '@fluentui/react';
import { useConst } from '@fluentui/react-hooks';
export default function RequestView(): JSX.Element {
    const today = useConst(new Date(Date.now()));
    const minDate = useConst(addDays(today, 10));
    const datePickerStyles: Partial<IDatePickerStyles> = { root: { maxWidth: 300 } };
    const options: IDropdownOption[] = [
        { key: 'fruitsHeader', text: 'Fruits' }]

    const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: 300 },
    };
    return (
        <section>
            看到就是成功
            <Stack horizontal>
                <Label >Request By: </Label>{" "} <Text variant={'large'}>{"aaa"}</Text>
                {/* <TextField disabled defaultValue="I am disabled" style={{ width: 100 }} /> */}
            </Stack>
            <Stack horizontal>
                <Label>Terminal: </Label>
                <Dropdown
                    placeholder="Select an option"
                    //label="Basic uncontrolled example"
                    options={options}
                    styles={dropdownStyles}
                />

            </Stack>
            <Stack horizontal>
                <Label>Date Needed: </Label>
                <DatePicker
                    styles={datePickerStyles}


                    placeholder="Select a date..."
                    ariaLabel="Select a date"
                    minDate={minDate}
                    value={minDate}
                //maxDate={maxDate}
                // allowTextInput
                />
            </Stack>
            <Stack horizontal>
                <Label>Delivery Address: </Label> <Text variant={'large'}>{"request-flow-web-part.js"}</Text>
            </Stack>
        </section>
    )

}


