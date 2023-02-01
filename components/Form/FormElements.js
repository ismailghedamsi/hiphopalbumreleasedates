import { TextInput } from "@mantine/core";
import { Controller, FormProvider, useForm } from "react-hook-form"
import { DatePicker as MantineDatePicker } from "@mantine/dates";

export function TextField({ control, error, label, name, placeholder }) {
  
    const methods = useForm();

    return (
        <div className="field">
            <label className="label">{label}</label>
            <div className="control">
                <FormProvider {...methods} >
                    <Controller
                        name={name}
                        control={control}
                        render={({ field }) => <TextInput error={error} placeholder={placeholder} {...field} />}
                    />
                </FormProvider>
            </div>
        </div>
    )
}

export function DatePicker({ label, name, error, control,placeholder }) {
    const methods = useForm();
    return (<div className="field">
        <label className="label">{label}</label>
        <div className="control">
            <FormProvider {...methods} >
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => <MantineDatePicker clearable={false} defaultValue={""} focusable data-autofocus error={error} placeholder={placeholder} label="" withAsterisk {...field} dateParser={(dateString) => new Date(dateString).toISOString()} />}
                />
            </FormProvider>
        </div>
    </div>)
}