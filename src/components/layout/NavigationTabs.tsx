import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  ListTodo,
  AlertTriangle,
  ClipboardCheck,
  GraduationCap,
  FileText,
  BellRing,
  Shield
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'ocorrencias'
  | 'acoes'
  | 'riscos'
  | 'inspecoes'
  | 'treinamentos'
  | 'documentos'
  | 'alertas'
  | 'governanca';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  badgeCounts: {
    alertas: number;
    acoesAtrasadas: number;
    treinamentosVencidos: number;
    riscosCriticos: number;
  };
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
}

interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onSelectTab,
  badgeCounts
}) => {
  // Grouped tabs for clean hierarchy and zero visual noise
  const groups: NavGroup[] = [
    {
      groupLabel: 'Painel Geral',
      items: [
        {
          id: 'dashboard',
          label: 'Visão Executiva & KPIs',
          icon: LayoutDashboard,
        }
      ]
    },
    {
      groupLabel: 'Gestão Operacional',
      items: [
        {
          id: 'ocorrencias',
          label: 'Incidentes & Acidentes',
          icon: ShieldAlert,
        },
        {
          id: 'acoes',
          label: 'Plano de Ações (5W2H)',
          icon: ListTodo,
          badge: badgeCounts.acoesAtrasadas,
          badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/40'
        },
        {
          id: 'inspecoes',
          label: 'Inspeções & Checklists',
          icon: ClipboardCheck,
        }
      ]
    },
    {
      groupLabel: 'Prevenção & NRs',
      items: [
        {
          id: 'riscos',
          label: 'Matriz de Riscos (NR-01)',
          icon: AlertTriangle,
          badge: badgeCounts.riscosCriticos,
          badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
        },
        {
          id: 'treinamentos',
          label: 'Treinamentos & NRs',
          icon: GraduationCap,
          badge: badgeCounts.treinamentosVencidos,
          badgeColor: 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
        },
        {
          id: 'documentos',
          label: 'Documentos SST',
          icon: FileText,
        }
      ]
    },
    {
      groupLabel: 'Auditoria & Controle',
      items: [
        {
          id: 'alertas',
          label: 'Central de Alertas',
          icon: BellRing,
          badge: badgeCounts.alertas,
          badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/40'
        },
        {
          id: 'governanca',
          label: 'Camada 4 — Governança',
          icon: Shield,
        }
      ]
    }
  ];

  return (
    <nav
      id="sidebar-navigation-sst"
      className="w-full md:w-[260px] xl:w-[280px] bg-black border-r border-zinc-800/80 flex flex-col justify-between py-4 px-3 md:sticky md:top-[106px] md:h-[calc(100vh-106px)] overflow-y-auto z-30 select-none"
    >
      {/* Primary container matching selector div#root > div > nav > div:nth-of-type(1) */}
      <div className="flex flex-col gap-5 w-full">
        {groups.map((group, groupIdx) => (
          <div key={groupIdx} className="flex flex-col gap-1">
            <span className="text-[10px] font-mono font-semibold tracking-wider text-zinc-500 uppercase px-3 py-1">
              {group.groupLabel}
            </span>
            <div className="flex flex-col gap-0.5">
              {group.items.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-btn-${tab.id}`}
                    onClick={() => onSelectTab(tab.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-zinc-900 text-white font-semibold border-l-2 border-amber-400 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive ? 'text-amber-400' : 'text-zinc-500'
                        }`}
                      />
                      <span className="truncate">{tab.label}</span>
                    </div>

                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span
                        className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none flex-shrink-0 ${
                          tab.badgeColor || 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Noise-free Status footer */}
      <div className="pt-3 mt-4 border-t border-zinc-900/90 px-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>NR-01 • GRO/PGR</span>
          </div>
          <span className="text-zinc-600">v2.1.0</span>
        </div>
      </div>
    </nav>
  );
};
