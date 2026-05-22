function StatsCard({ title, value, icon, color = "purple", trend }) {
  const colors = {
    purple: "bg-purple-500/10 border-purple-500/20",
    blue: "bg-blue-500/10 border-blue-500/20",
    green: "bg-green-500/10 border-green-500/20",
    orange: "bg-orange-500/10 border-orange-500/20",
  };

  const iconColors = {
    purple: "text-purple-500",
    blue: "text-blue-500",
    green: "text-green-500",
    orange: "text-orange-500",
  };

  return (
    <div className={`${colors[color]} rounded-xl p-6 border backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`text-3xl ${iconColors[color]}`}>{icon}</div>
        {trend && (
          <span className="text-green-400 text-sm flex items-center gap-1">
            <span>↑</span> {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

export default StatsCard;