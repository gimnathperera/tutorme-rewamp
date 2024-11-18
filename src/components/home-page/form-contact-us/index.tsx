import Icon from "@/components/shared/icon";
import InputMultiLineText from "@/components/shared/input-multi-line-text";
import InputText from "@/components/shared/input-text";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { ContactUsSchema, contactUsSchema } from "./schema";
import SubmitButton from "@/components/shared/submit-button";

const FormContactUs = () => {
  const contactUsForm = useForm({
    resolver: zodResolver(contactUsSchema),
    defaultValues: {} as ContactUsSchema,
    mode: "onChange",
  });

  const onSubmit = (data: ContactUsSchema) => {
    console.log("Form Submitted", data);
  };

  return (
    <FormProvider {...contactUsForm}>
      <form onSubmit={contactUsForm.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <InputText label="Your name" name="name" placeholder="John Doe" />

          <InputText
            label="Your email"
            name="email"
            placeholder="xyz@email.com"
          />
          <InputMultiLineText
            label="Your message"
            name="message"
            placeholder="Leave a comment"
          />
        </div>
        <div className="mt-8">
          <SubmitButton title="Send message" type="submit" />
        </div>
      </form>
    </FormProvider>
  );
};

export default FormContactUs;
