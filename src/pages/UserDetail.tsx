import React from "react";
import { User } from "@/types/user.type";
import { Mail, Twitter, ExternalLink } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { blogService } from "@/features/home/service/blog.service";
import { useQuery } from "@tanstack/react-query";
import { Blog } from "@/features/home/types/blog.type";

type Props = {
  user: User;
};

// Default export component
export default function UserDetails() {
  const user = useAuthStore((s) => s.userDetails);
  const navigate = useNavigate();
  // safe fallbacks if some fields are undefined
  const avatar = user?.avatar || "/images/avatar-placeholder.svg";
  const cover = "/bgImage.jpg";
  const name = user?.username || "Tên Người Dùng";
  const role = user?.role || "Blogger";
  const location = user?.address || "Vietnam";
  const bio = "Vào rồi thì sao ko ủng hộ nhà phát triển 1 tym cái nhờ";
  const website = "#";
  const stats = {
    posts: 34,
    followers: 1290,
    following: 180,
  };
  const skills: string[] = ["React", "TypeScript", "Tailwind CSS", "AWS"];
  const {
    data: recent,
    isLoading,
    isError
  } = useQuery<Blog[]>({
      queryKey: ['blogs'],
      queryFn: () => blogService.getPostByUserId(user?.id),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Cover */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <Tooltip title="Back">
              <IconButton
                onClick={() => navigate(-1)}
                color="primary"
                aria-label="back"
              >
                <ArrowBackIcon className="w-80 h-80" />
              </IconButton>
            </Tooltip>
        <div
          className="h-44 sm:h-56 md:h-64 bg-center bg-cover"
          style={{ backgroundImage: `url(${cover})` }}
        />

        {/* Card content */}
        <div className="bg-white dark:bg-slate-900 -mt-12 rounded-t-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Avatar + basic info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {user?.avatar ? (
                    <img
                  src={avatar}
                  alt={`${name} avatar`}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow"
                />
                ):(
                    <Avatar
                              style={{ width: 24, height: 24, fontSize: 12 }}
                            >
                              {user?.username?.charAt(0)?.toUpperCase() ?? "U"}
                            </Avatar>
                )
                }
                
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold leading-tight text-slate-900 dark:text-slate-100">
                    {name}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {role} • <span className="hidden sm:inline">{location}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">Website</span>
                  </a>

                  <button className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:opacity-95">
                    Follow
                  </button>
                </div>
              </div>

              <p className="mt-4 text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                {bio}
              </p>

              {/* Social + stats */}
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-3">
                  <a href={`mailto:${user?.email || ""}`} className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Mail className="w-4 h-4" />
                    <span className="hidden sm:inline">{user?.email || "Email"}</span>
                  </a>
                </div>

                <div className="flex gap-4 ml-0 sm:ml-auto">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.posts}</div>
                    <div className="text-xs text-slate-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.followers}</div>
                    <div className="text-xs text-slate-500">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.following}</div>
                    <div className="text-xs text-slate-500">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main layout: two-column on md+ */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Recent Posts */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Bài viết gần đây</h2>

              <div className="mt-4 space-y-4">
                {recent?.map((post: any) => (
                  <article key={post.id} className="bg-white dark:bg-slate-800 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="text-md font-semibold text-slate-900 dark:text-slate-100">{post.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{post.excerpt}</p>
                      </div>

                      <div className="text-sm text-slate-400 mt-3 sm:mt-0">{post.date} • {post.readTime}</div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-4">
                <a href="#" className="text-sm text-slate-700 dark:text-slate-300 hover:underline">Xem tất cả bài viết →</a>
              </div>
            </div>

            {/* Right: About / Skills */}
            <aside className="space-y-6">
              <div className="p-4 rounded-lg border bg-white dark:bg-slate-800">
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">Giới thiệu ngắn</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{bio}</p>
              </div>

              <div className="p-4 rounded-lg border bg-white dark:bg-slate-800">
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">Kỹ năng</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((s, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 rounded-full border bg-slate-50 dark:bg-slate-700">{s}</span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-white dark:bg-slate-800">
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">Liên hệ</h4>
                <div className="mt-3 flex flex-col gap-2">
                  <a href={`mailto:${user?.email || ""}`} className="text-sm">Gửi email</a>
                  <a href={website} target="_blank" rel="noreferrer" className="text-sm">Trang cá nhân</a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------
  Preview / sample data (dùng khi bạn muốn render trong Storybook / page demo)
  Chỉ để tham khảo — trong dự án thật bạn nên import UserDetails và truyền user từ API.
---------- */

export const SAMPLE_USER = {
  name: "Đỗ Đức Anh",
  role: "Full-stack Developer",
  location: "Hồ Chí Minh, Vietnam",
  avatar: "https://i.pravatar.cc/300",
  cover: "https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcd",
  email: "ducanh@example.com",
  website: "https://your-site.example.com",
  social: {
    twitter: "https://twitter.com/example",
    github: "https://github.com/example",
  },
  bio: "Mình là một lập trình viên đam mê xây dựng ứng dụng web. Trên blog này mình chia sẻ về React, NestJS, và tất tần tật chuyện dev.",
  skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
  stats: { posts: 42, followers: 1280, following: 152 },
  recentPosts: [],
};

/* Usage in a page:

import UserDetails, { SAMPLE_USER } from './UserProfileComponent'

export default function Page(){
  return <UserDetails user={SAMPLE_USER} />
}

*/
