import { Tabs, TextInput } from "@mantine/core"
import { Controller, FormProvider, useForm } from "react-hook-form"
import UploadPreview from "./UploadPreview"
import UploadZone from "./UploadZone"

const UploadMethodTabs = ({errors, control, isUploading, setCoverSource,files, setFiles}) => {
 
    const methods = useForm();
    console.log("control ",control)

    return (
      <>
         <label className="label">Album cover</label>
        <Tabs
        defaultValue="local"
        unstyled
        onTabChange={(value) => setCoverSource(value)}
        styles={(theme) => ({
          tab: {
            ...theme.fn.focusStyles(),
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9],
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[4]}`,
            padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
            cursor: 'pointer',
            fontSize: theme.fontSizes.sm,
            display: 'flex',
            alignItems: 'center',

            '&:disabled': {
              opacity: 0.5,
              cursor: 'not-allowed',
            },

            '&:not(:first-of-type)': {
              borderLeft: 0,
            },

            '&:first-of-type': {
              borderTopLeftRadius: theme.radius.md,
              borderBottomLeftRadius: theme.radius.md,
            },

            '&:last-of-type': {
              borderTopRightRadius: theme.radius.md,
              borderBottomRightRadius: theme.radius.md,
            },

            '&[data-active]': {
              backgroundColor: theme.colors.blue[7],
              borderColor: theme.colors.blue[7],
              color: theme.white,
            },
          },

          tabIcon: {
            marginRight: theme.spacing.xs,
            display: 'flex',
            alignItems: 'center',
          },

          tabsList: {
            display: 'flex',
          },
        })}
      >
        <Tabs.List styles={{ border: "2px black double" }}>
          <Tabs.Tab value="local">Local file</Tabs.Tab>
          <Tabs.Tab value="url">Cover url</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="local" pt="xs" style={{ paddingBottom: "20px" }}>
          <UploadZone setFiles={setFiles} isUploading={isUploading}/>
          <h1>Preview</h1>
          <UploadPreview files={files} />
        </Tabs.Panel>

        <Tabs.Panel value="url" pt="xs">
          <div className="field">
            <div className="control">
            <FormProvider {...methods} >
              <Controller
                name="cover"
                control={control}
                render={({ field }) => <TextInput error={errors.cover?.message} placeholder="Insert the link to the cover image"  {...field} />}
              />
              </FormProvider>
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>
      </>
    )
}

export default UploadMethodTabs