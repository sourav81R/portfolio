type TimelineItem = {
  title: string
  subtitle: string
  period: string
  description?: string[]
}

type Props = {
  items: TimelineItem[]
}

const Timeline = ({ items }: Props) => {
  return (
    <div className="relative border-l border-gray-300 dark:border-gray-700 ml-4">
      {items.map((item, index) => (
        <div key={index} className="mb-12 ml-6 relative group">
          {/* Dot */}
          <span
            className="
              absolute -left-[13px] top-1.5
              w-4 h-4 rounded-full
              bg-green-500
              shadow-[0_0_0_4px_rgba(34,197,94,0.15)]
              group-hover:scale-110 transition
            "
          />

          {/* Card */}
          <div
            className="
              border border-gray-300 dark:border-gray-800
              bg-gray-50 dark:bg-gray-950
              rounded-xl p-6
              hover:border-green-500 transition
            "
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {item.title}
            </h3>

            <p className="text-green-500 text-sm mt-1">
              {item.subtitle}
            </p>

            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {item.period}
            </p>

            {item.description && (
              <ul className="mt-4 list-disc list-inside space-y-2 text-gray-700 dark:text-gray-400">
                {item.description.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Timeline
