import { groupsData } from "@/data/teams";

export default function GroupSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {groupsData.map((group) => (
        <div key={group.letter} className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
          <div className="bg-blue-600 text-white px-4 py-2 font-bold text-center">
            Grupo {group.letter}
          </div>
          <div className="p-4 space-y-3">
            {group.teams.map((team) => (
              <div key={team.id} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{team.flag}</span>
                  <span className="font-medium text-slate-700">{team.name}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">CONFIRMED</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}