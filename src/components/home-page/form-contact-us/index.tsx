import Icon from "@/components/shared/icon";
import InputMultiLineText from "@/components/shared/input-multi-line-text";
import InputText from "@/components/shared/input-text";

const FormContactUs = () => {
  return (
    <form action="#" className="space-y-4">
      <InputText label="Your name" name="name" placeholder="Jhon Doe" />

      <InputText label="Your email" name="email" placeholder="xyz@email.com" />
      <div className="sm:col-span-2">
        <InputMultiLineText
          label="Your message"
          name="message"
          placeholder="Leave a comment"
        />
      </div>
      <button
        type="submit"
        className="py-3 px-5 text-sm disabled:opacity-50 font-medium w-full text-center text-white rounded-lg bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 flex justify-center items-center hover:opacity-90"
      >
        <p> Send message</p>
        <Icon name="Send" size={16} className="ml-1" />
      </button>
    </form>
  );
};

export default FormContactUs;
