const friends = [
  { id: 'f1', name: 'Duc Anh' },
  { id: 'f2', name: 'Nhat An' },
  { id: 'f3', name: 'Viet Anh' }
]
export default function Friend() {
    return (
        <aside className = "lg:col-span-3 order-2 lg:order-1" >
            <div className="sticky top-6 space-y-6">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800">Friends</h2>
                    <p className="text-xs text-gray-400 mt-1">People I write about or collaborate with</p>

                    <ul className="mt-4 space-y-3">
                        {friends.map((f) => (
                            <li key={f.id} className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-semibold">
                                    {f.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{f.name}</div>
                                    <div className="text-xs text-gray-400">3 posts</div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 flex gap-2">
                        <button className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">All</button>
                        <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Follow</button>
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800">Top Tags</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {['react', 'css', 'javascript', 'design', 'nestjs'].map((t) => (
                            <button key={t} className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">#{t}</button>
                        ))}
                    </div>
                </div>
            </div>
          </aside>
);
}