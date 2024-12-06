import { useAuthContext } from "@/contexts";
import { useState, useRef, MutableRefObject, useEffect, FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Props = {
  isLoading: boolean;
  userName?: string;
  userEmail?: string;
};

const ProfileDropdown: FC<Props> = ({ isLoading, userName, userEmail }) => {
  const { logout } = useAuthContext();

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

  const handleLogoutUser = () => {
    closeDropdown();
    logout();
  };
  return (
    <div className="relative">
      {isLoading ? (
        <Skeleton
          circle
          height={48}
          width={48}
          baseColor="#f3f3f3"
          highlightColor="#ecebeb"
        />
      ) : (
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
      )}

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-gray-900 font-medium">{userName}</p>
            <p className="text-gray-500 text-sm">{userEmail}</p>
          </div>
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
                onClick={handleLogoutUser}
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
