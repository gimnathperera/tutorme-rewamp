import { useState, useRef, MutableRefObject, useEffect, FC } from "react";

const ProfileDropdown: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(
    null
  ) as unknown as MutableRefObject<HTMLInputElement>;

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
        onClick={toggleDropdown}
      >
        <img
          src="/images/testimonial/user1.svg"
          alt="Profile-image"
          className="w-10 h-10 rounded-full"
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <ul>
            <li>
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  closeDropdown();
                  console.log("Profile clicked");
                }}
              >
                Profile
              </button>
            </li>

            <li>
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  closeDropdown();
                  console.log("Logout clicked");
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
