import Link from "next/link";

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

const navigation: NavigationItem[] = [
  { name: "Find a Tutor", href: "/find-a-tutor", current: false },
  { name: "Grades", href: "/grades", current: false },
  { name: "Test Papers", href: "#faq-section", current: false },
   { name: "Tuition Rates", href: "/tuition-rates", current: false },
  { name: "FAQ", href: "#faq-section", current: false },
  { name: "Blog", href: "/blogs", current: false },
  { name: "Contact Us", href: "/#keep-in-touch-section", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const DrawerContent = () => {
  return (
    <div className="rounded-md max-w-sm w-full mx-auto">
      <div className="flex-1 space-y-4 py-1">
        <div className="sm:block">
          <div className="space-y-1 px-5 pt-2 pb-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-purple"
                    : "text-black hover:bg-gray-700 hover:text-purple",
                  "block py-2 rounded-md text-base font-medium"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawerContent;
