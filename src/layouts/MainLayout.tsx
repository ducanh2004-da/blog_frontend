import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useState, useRef, useCallback, memo } from "react";
import Avatar from "@mui/material/Avatar";
import { MainDropdown } from "@/components";
import { ChevronDown, Search, Zap } from "lucide-react";

/**
 * SearchBox - Header search input with debouncing
 */
const SearchBox = memo(function SearchBox({
  onSearch,
}: {
  onSearch: (term: string) => void;
}) {
  const [input, setInput] = useState("");
  const debounceRef = useRef<number | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // Debounce search to 300ms
    if (debounceRef.current) {
      globalThis.clearTimeout(debounceRef.current);
    }
    debounceRef.current = globalThis.setTimeout(() => {
      onSearch(value.trim());
      debounceRef.current = null;
    }, 300);
  }, [onSearch]);

  return (
    <div className="flex-1 max-w-md">
      <div className="relative flex items-center">
        <input
          type="search"
          placeholder="Tìm kiếm bài viết, người dùng..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && onSearch(input.trim())}
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-colors"
          aria-label="Search posts and users"
        />
        <Search className="absolute right-3 h-4 w-4 text-gray-400" aria-hidden="true" />
      </div>
    </div>
  );
});

/**
 * AIButton - AI support button
 */
const AIButton = memo(function AIButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="hidden md:flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      aria-label="Open AI assistant"
    >
      <Zap className="h-4 w-4" />
      <span>Support with ViLearn A.I</span>
    </button>
  );
});

/**
 * ProfileMenu - User profile dropdown menu
 */
const ProfileMenu = memo(function ProfileMenu({
  user,
  onLogout,
  onNavigateProfile,
}: {
  user: any;
  onLogout: () => void;
  onNavigateProfile: () => void;
}) {
  const [dropdownValue, setDropdownValue] = useState("profile");

  const menuOptions = [
    { label: "Hồ sơ", value: "profile", icon: "lucide:user" },
    { label: "Đăng xuất", value: "logout", icon: "lucide:log-out" },
  ];

  const handleMenuSelect = async (value: string) => {
    switch (value) {
      case "profile":
        onNavigateProfile();
        break;
      case "logout":
        onLogout();
        break;
      default:
        break;
    }
  };

  if (!user) {
    return (
      <button
        onClick={onNavigateProfile}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="Sign in"
      >
        Đăng nhập
      </button>
    );
  }

  return (
    <MainDropdown
      value={dropdownValue}
      options={menuOptions}
      onChange={(v) => {
        setDropdownValue(v);
        handleMenuSelect(v);
      }}
      minWidth="180px"
      className="ml-auto"
      align="right"
      showChecks={false}
      userInfo={{ username: user?.username, email: user?.email }}
    >
      {() => (
        <div className="flex cursor-pointer items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-gray-100">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-semibold text-white shadow-md overflow-hidden">
            {user?.avatar ? (
              <img
                src={user?.avatar}
                alt={user?.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <Avatar style={{ width: 24, height: 24, fontSize: 12 }}>
                {user?.username?.charAt(0)?.toUpperCase() ?? "U"}
              </Avatar>
            )}
          </div>

          <div className="hidden sm:flex flex-col text-sm">
            <span className="font-medium text-gray-900">
              {user?.username ?? user.email}
            </span>
            <small className="text-xs text-gray-500">
              {user?.role || "User"}
            </small>
          </div>

          <ChevronDown className="h-4 w-4 text-gray-600" />
        </div>
      )}
    </MainDropdown>
  );
});

/**
 * MainLayout Component
 * Top-level layout with header, sidebar toggle for mobile, and main content area
 * 
 * Features:
 * - Responsive header with search
 * - User profile dropdown
 * - AI assistant button
 * - Mobile-friendly navigation
 * - Accessibility support (ARIA labels, semantic HTML)
 */
export default function MainLayout() {
  const user = useAuthStore((s) => s.userDetails);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleSearch = useCallback((_searchTerm: string) => {
    // Search is handled by Home component via outlet context
    // This callback exists for future search API integration
  }, []);

  const handleAIClick = useCallback(() => {
    navigate('/ai');
  }, [navigate]);

  const handleNavigateProfile = useCallback(() => {
    navigate(user ? '/profile' : '/auth/login');
  }, [navigate, user]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/');
  }, [logout, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1400px] flex h-16 items-center justify-between gap-4 md:gap-6">
            {/* Logo / Brand */}
            <div className="flex-shrink-0">
              <button
                onClick={() => navigate("/")}
                className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1"
                aria-label="BlogPlatform home"
              >
                📝 EduSocial
              </button>
            </div>

            {/* Search Box */}
            <SearchBox onSearch={handleSearch} />

            {/* Right Section: AI Button, Profile */}
            <div className="flex items-center gap-3 md:gap-4">
              <AIButton onClick={handleAIClick} />

              <div className="h-8 w-px bg-gray-200 hidden md:block" aria-hidden="true" />

              <ProfileMenu
                user={user}
                onLogout={handleLogout}
                onNavigateProfile={handleNavigateProfile}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-gradient-to-b from-white to-gray-50">
        <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="mx-auto max-w-[1400px]">
            <Outlet context={{ search: '' }} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-gray-50">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mx-auto max-w-[1400px] text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} EduSocial. Tất cả quyền được bảo vệ.</p>
            <div className="mt-4 flex justify-center gap-6 text-xs">
              <button type="button" className="hover:text-indigo-600 transition-colors bg-none border-none cursor-pointer">
                Điều khoản
              </button>
              <button type="button" className="hover:text-indigo-600 transition-colors bg-none border-none cursor-pointer">
                Quyền riêng tư
              </button>
              <button type="button" className="hover:text-indigo-600 transition-colors bg-none border-none cursor-pointer">
                Liên hệ
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
