import React from 'react';
import Icon from '../../components/Icon';

interface TeamLevelData {
  level: number;
  title: string;
  investment: string;
  directMembers?: number;
  indirectMembers?: number;
  theme: {
    gradient: string;
    iconColor: string;
  };
}

const levelsData: TeamLevelData[] = [
  {
    level: 1,
    title: 'Starter',
    investment: '$35 - $499',
    theme: {
      gradient: 'from-gray-700 to-gray-800',
      iconColor: 'text-gray-300',
    },
  },
  {
    level: 2,
    title: 'Builder',
    investment: '$500 - $1499',
    directMembers: 3,
    indirectMembers: 5,
    theme: {
      gradient: 'from-cyan-500 to-blue-500',
      iconColor: 'text-cyan-200',
    },
  },
  {
    level: 3,
    title: 'Leader',
    investment: '$1500 - $2999',
    directMembers: 5,
    indirectMembers: 15,
    theme: {
      gradient: 'from-purple-500 to-indigo-500',
      iconColor: 'text-purple-200',
    },
  },
  {
    level: 4,
    title: 'Pro',
    investment: '$3000 - $4999',
    directMembers: 10,
    indirectMembers: 25,
    theme: {
      gradient: 'from-pink-500 to-rose-500',
      iconColor: 'text-pink-200',
    },
  },
  {
    level: 5,
    title: 'Elite',
    investment: '$5000+',
    directMembers: 20,
    indirectMembers: 70,
    theme: {
      gradient: 'from-brand-primary to-red-600',
      iconColor: 'text-rose-200',
    },
  },
];

const RequirementItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <p className="text-sm text-white/70">{label}</p>
      <p className="font-bold text-white">{value}</p>
    </div>
  </div>
);

const TeamLevelsPage: React.FC = () => {
  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Team Levels & Requirements</h1>
        <p className="text-lg text-gray-400 mt-2">
          Unlock new benefits as you and your team grow your investments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {levelsData.map((level, index) => (
          <div
            key={level.level}
            className={`flex flex-col rounded-xl shadow-2xl bg-gradient-to-br ${level.theme.gradient} transition-transform duration-300 hover:-translate-y-2`}
            style={{ animation: `fadeInUp 0.5s ${index * 100}ms ease-out forwards`, opacity: 0 }}
          >
            <div className="p-8 text-white flex-grow flex flex-col">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">{level.title}</h2>
                <div className="text-5xl font-extrabold opacity-20">{level.level}</div>
              </div>

              <div className="mt-8 space-y-4">
                <RequirementItem
                  icon={<Icon path="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25" className={`h-7 w-7 ${level.theme.iconColor}`} />}
                  label="Investment Range"
                  value={level.investment}
                />
                {level.directMembers !== undefined && (
                  <RequirementItem
                    icon={<Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" className={`h-7 w-7 ${level.theme.iconColor}`} />}
                    label="Direct Active Members"
                    value={level.directMembers}
                  />
                )}
                {level.indirectMembers !== undefined && (
                  <RequirementItem
                    icon={<Icon path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z" className={`h-7 w-7 ${level.theme.iconColor}`} />}
                    label="Indirect Active Members"
                    value={level.indirectMembers}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
       <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TeamLevelsPage;
