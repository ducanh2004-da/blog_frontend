
// Một layout giả lập bao gồm Header giả và Nội dung giả
export const PageSkeleton = () => {
  return (
    <div className="w-full min-h-screen animate-pulse bg-white dark:bg-slate-900">
      {/* Giả lập Header */}
      <div className="h-16 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 w-full mb-8" />
      
      {/* Giả lập Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề trang */}
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-6" />
        
        {/* Các dòng nội dung hoặc thẻ card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              <div className="h-40 bg-gray-200 dark:bg-slate-700 rounded-xl w-full" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/5" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};