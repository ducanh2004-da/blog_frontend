// src/layouts/MainLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useState, useCallback, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import { MainDropdown } from "@/components";
import { ChevronDown } from "lucide-react";

export default function MainLayout() {
  const user = useAuthStore((s) => s.userDetails);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [isDropDown, setDropDown] = useState(false);
  const debounceRef = useRef<number | null>(null);

  const handleInputChange = (e: any) => {
    const v = e.target.value;
    setInput(v);

    // debounce 300ms
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      setSearch(v.trim());
      debounceRef.current = null;
    }, 300);
  };

  const menuOptions = [
    { label: "Profile", value: "profile", icon: "lucide:user" },
    { label: "Logout", value: "logout", icon: "lucide:log-out" },
  ];

  const handleMenuSelect = async (value: string) => {
    switch (value) {
      case "profile":
        navigate("/profile");
        break;
      case "logout":
        await logout();
        navigate("/");
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full">
      <header className="flex h-15 justify-between px-6 items-center border-b border-gray-200 bg-white shadow-sm">
        <div className="search-box max-w-3xl flex">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={input}
            onChange={handleInputChange}
            className="w-150 p-2 border border-gray-300 rounded-l-md focus:outline-none"
          />
          <button
            onClick={() => setSearch(input.trim())}
            className="p-2 cursor-pointer bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
          >
            Tìm
          </button>
        </div>

        <div className="aiSupport mr-20">
          <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 cursor-pointer flex items-center justify-center space-x-2"
          onClick={() => {
            navigate('/ai');
          }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>Support with ViLearn A.I</span>
          </button>
        </div>

        <div className="left-side-header flex items-center gap-4">
          <div className="profile-menu flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <MainDropdown
                    value="profile"
                    options={menuOptions}
                    onChange={handleMenuSelect}
                    minWidth="180px"
                    className="ml-auto"
                    align="right"
                    showChecks={false}
                    userInfo={{ username: user?.username, email: user?.email }}
                  >
                    {() => (
                      <div className="flex relative cursor-pointer gap-3">
                        <div className="w-[3rem] h-[3rem] rounded-full bg-primary text-white flex items-center justify-center text-[1.2rem] font-medium shadow-md overflow-hidden">
                          {user?.avatar ? (
                            <>
                              <img
                                src={user?.avatar}
                                alt={user?.username}
                                className="w-full h-full rounded-full object-cover"
                              />
                            </>
                          ) : (
                            <Avatar
                              style={{ width: 24, height: 24, fontSize: 12 }}
                            >
                              {user?.username?.charAt(0)?.toUpperCase() ?? "U"}
                            </Avatar>
                          )}
                        </div>

                        <div className="flex flex-col text-sm mt-2">
                          <span className="font-medium text-gray-700">
                            {user?.username ?? user.email}
                          </span>
                          <small className="text-xs text-gray-400">
                            {user?.role}
                          </small>
                        </div>
                        <ChevronDown className="mt-2" />
                      </div>
                    )}
                  </MainDropdown>
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate("/auth/login")}
                className="cursor-pointer px-3 py-1 rounded bg-indigo-600 text-white text-sm"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="w-full max-w-full min-h-screen relative overflow-hidden py-5">
        <Outlet context={{ search }} />
      </section>

      <footer>
        <div className="w-full p-4 text-center text-gray-500">
          &copy; {new Date().getFullYear()} BlogPlatform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
