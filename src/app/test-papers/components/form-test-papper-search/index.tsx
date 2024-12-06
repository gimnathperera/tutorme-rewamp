import InputSelect from "@/components/shared/input-select";
import { Option } from "@/types/shared-types";
import { FC } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { PaperSearchSchema } from "./schema";

type Props = {
  gradesOptions: Option[];
  subjectOptions: Option[];
  testPaperSearchForm: UseFormReturn<
    {
      grade: string;
      subject: string;
    },
    any,
    undefined
  >;
  isGradesLoading: boolean;
  isSubjectsLoading: boolean;
};

const FormTestPapperSearch: FC<Props> = ({
  gradesOptions,
  subjectOptions,
  testPaperSearchForm,
  isGradesLoading,
  isSubjectsLoading,
}) => {
  const onSubmit = (data: PaperSearchSchema) => {
    console.log("Form Submitted", data);
  };

  const selectedGrade = testPaperSearchForm.watch("grade");

  return (
    <FormProvider {...testPaperSearchForm}>
      <form onSubmit={testPaperSearchForm.handleSubmit(onSubmit)}>
        <div className="mb-6">
          <InputSelect
            label="Select Grade"
            name="grade"
            options={gradesOptions}
            loading={isGradesLoading}
          />
        </div>

        <div className="mb-6">
          <InputSelect
            label="Select Subject"
            name="subject"
            options={subjectOptions}
            disabled={!selectedGrade}
            loading={isSubjectsLoading}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default FormTestPapperSearch;
