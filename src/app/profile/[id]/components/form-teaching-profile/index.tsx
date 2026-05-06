import { Controller, FormProvider, SubmitHandler } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { FC } from "react";
import { TeachingProfileSchema } from "./schema";
import SubmitButton from "@/components/shared/submit-button";
import { collapseTextSpaces } from "@/utils/form-normalizers";

type Props = {
  form: ReturnType<any>;
  onFormSubmit: SubmitHandler<TeachingProfileSchema>;
  isSubmitting: boolean;
};

const CHAR_LIMIT = 500;

const fields: {
  name: keyof TeachingProfileSchema;
  label: string;
  placeholder: string;
}[] = [
  {
    name: "teachingSummary",
    label: "Short Introduction About Yourself *",
    placeholder: "Personal qualities, teaching styles & methodologies",
  },
  {
    name: "academicDetails",
    label: "Summary of Teaching Experience & Academic Achievements *",
    placeholder:
      "Achievements & subjects taught, such as number of students, years, and results",
  },
  {
    name: "studentResults",
    label: "Results of Students / Track Record *",
    placeholder:
      "Past student results, grade improvements, examination outcomes",
  },
  {
    name: "sellingPoints",
    label: "Other Selling Points as a Tutor *",
    placeholder: "Teaching methods, commitment level, what makes you stand out",
  },
];

const FormTeachingProfile: FC<Props> = ({
  form,
  onFormSubmit,
  isSubmitting,
}) => {
  const { isDirty, isValid } = form.formState;
  const isButtonDisabled = !isDirty || isSubmitting || !isValid;

  return (
    <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 2xl:col-span-2">
      <h3 className="mb-4 text-lg font-semibold sm:text-xl">
        Teaching Profile
      </h3>
      <p className="mb-5 text-sm text-gray-500">
        Share your teaching background, student results, and what makes you
        stand out as a tutor.
      </p>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
            {fields.map(({ name, label, placeholder }) => (
              <Controller
                key={name}
                name={name}
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={name}
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {label.replace(" *", "")}
                      {label.endsWith(" *") && (
                        <span className="text-red-500"> *</span>
                      )}
                    </label>
                    <Textarea
                      id={name}
                      {...field}
                      value={field.value ?? ""}
                      onBlur={(event) => {
                        field.onBlur();
                        field.onChange(collapseTextSpaces(event.target.value));
                      }}
                      rows={4}
                      maxLength={CHAR_LIMIT}
                      placeholder={placeholder}
                      className={`resize-y bg-white text-sm ${
                        fieldState.error ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <div className="flex min-h-[1.25rem] items-center justify-between gap-3">
                      <span className="text-xs text-red-500">
                        {fieldState.error?.message}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(field.value ?? "").length} / {CHAR_LIMIT}
                      </span>
                    </div>
                  </div>
                )}
              />
            ))}
          </div>
          <div className="col-span-6 sm:col-full">
            <SubmitButton
              className="peer mt-4 rounded-lg bg-primary-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 sm:mt-5 sm:px-5 sm:text-base"
              type="submit"
              loading={isSubmitting}
              title="Update Teaching Profile"
              disabled={isButtonDisabled}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default FormTeachingProfile;
