import React from 'react'

export default function Dashboard()  {
  return (
    <main>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {["Total Sales", "Active Styles", "New Messages", "Ongoing Campaigns"].map((item) => (
            <div key={item} className="bg-neutral-200 dark:bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-gray-500">{item}</h3>
              <p className="text-3xl font-bold text-black mt-2">0</p>
            </div>
          ))}
      </div>
    </main>
  )
}
