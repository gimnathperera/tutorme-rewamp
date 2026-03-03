import InputMultiLineText from "@/components/shared/input-multi-line-text";
import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { ContactUsSchema, contactUsSchema, initialFormValues } from "./schema";
import { useContactUsMutation } from "@/store/api/splits/contact-us";
import { getErrorInApiResult } from "@/utils/api";
import toast from "react-hot-toast";

const FormContactUs = () => {
  const contactUsForm = useForm({
    resolver: zodResolver(contactUsSchema),
    defaultValues: initialFormValues as ContactUsSchema,
    mode: "onChange",
  });

  const [sendInquiry, { isLoading }] = useContactUsMutation();

  const onSubmit = async ({ name, email, message }: ContactUsSchema) => {
    const payload = {
      message,
      sender: {
        name,
        email,
      },
    };
    const result = await sendInquiry(payload);
    const error = getErrorInApiResult(result);
    if (error) {
      return toast.error(error);
    }

    if (result.data) {
      onSendInquirySuccess();
    }
  };

  const onSendInquirySuccess = () => {
    contactUsForm.reset();
    toast.success("Your feedback has been submitted successfully");
  };

  return (
    <FormProvider {...contactUsForm}>
      <form onSubmit={contactUsForm.handleSubmit(onSubmit)}>
        <div>
          <InputText label="Name" name="name" placeholder="John Doe" />

          <InputText label="Email" name="email" placeholder="xyz@email.com" />
          <InputMultiLineText
            label="Message"
            name="message"
            placeholder="Leave a comment"
          />
        </div>
        <div className="mt-8">
          <SubmitButton
            title="Send message"
            type="submit"
            loading={isLoading}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default FormContactUs;
