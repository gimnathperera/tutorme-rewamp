import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { PaperSearchSchema, paperSearchSchema } from "./schema";
import InputSelect from "@/components/shared/input-select";

const gradesOptions = [
  { label: "Grade 5", value: "5" },
  { label: "Grade 6", value: "6" },
  { label: "Grade 7", value: "7" },
  { label: "Grade 8", value: "8" },
  { label: "Grade 9", value: "9" },
  { label: "Grade 10", value: "10" },
  { label: "Grade 11", value: "11" },
  { label: "Grade 12", value: "12" },
  { label: "Grade 13", value: "13" },
];

const subjectOptions = [
  { label: "Mathematics", value: "math" },
  { label: "Science", value: "science" },
  { label: "English", value: "english" },
  { label: "History", value: "history" },
];

const FormTestPaperSearch: FC = () => {
  const testPaperSearchForm = useForm({
    resolver: zodResolver(paperSearchSchema),
    defaultValues: {} as PaperSearchSchema,
    mode: "onChange",
  });

  const onSubmit = (data: PaperSearchSchema) => {
    console.log("Form Submitted", data);
  };

  return (
    <FormProvider {...testPaperSearchForm}>
      <form onSubmit={testPaperSearchForm.handleSubmit(onSubmit)}>
        <div className="mb-6">
          <InputSelect
            label="Select Grade"
            name="grade"
            options={gradesOptions}
          />
        </div>

        <div className="mb-6">
          <InputSelect
            label="Select Subject"
            name="subject"
            options={subjectOptions}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default FormTestPaperSearch;
