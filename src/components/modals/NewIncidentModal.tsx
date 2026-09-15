import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Plus, X, Camera } from 'lucide-react';
import { Ocorrencia, Unidade, Setor } from '../../types/sst';

interface NewIncidentModalProps {
  onClose: () => void;
  unidades: Unidade[];
  setores: Setor[];
  onAddIncident: (newIncident: Ocorrencia) => void;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  onClose,
  unidades,
  setores,
  onAddIncident,
}) => {
  const [tipo, setTipo] = useState<Ocorrencia['tipo']>('Incidente / Quase-Acidente');
  const [unidadeId, setUnidadeId] = useState<string>(unidades[0]?.id || 'UN-01');
  const [setorId, setSetorId] = useState<string>(setores[0]?.id || 'SET-01');
  const [colaborador, setColaborador] = useState<string>('');
  const [funcao, setFuncao] = useState<string>('');
  const [atividade, setAtividade] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [causaImediata, setCausaImediata] = useState<string>('');
  const [causaBasica, setCausaBasica] = useState<string>('');
  const [severidade, setSeveridade] = useState<Ocorrencia['severidade']>('Leve');
  const [diasPerdidos, setDiasPerdidos] = useState<number>(0);
  const [turno, setTurno] = useState<Ocorrencia['turno']>('TURNO_A');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;

    const selectedUnidade = unidades.find((u) => u.id === unidadeId);
    const selectedSetor = setores.find((s) => s.id === setorId);

    const newCode = `OC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newOcorrencia: Ocorrencia = {
      id: `oc-${Date.now()}`,
      codigo: newCode,
      unidadeId,
      unidadeNome: selectedUnidade?.nome || 'Unidade Principal',
      setorId,
      setorNome: selectedSetor?.nome || 'Setor Industrial',
      dataHora: new Date().toISOString().replace('T', ' ').slice(0, 16),
      tipo,
      classificacao: tipo === 'Acidente com Afastamento (CPT)' ? 'Crítica' : tipo === 'Acidente sem Afastamento (SPT)' ? 'Alta' : 'Média',
      severidade,
      turno,
      colaboradorEnvolvido: colaborador || 'Não informado / Coletivo',
      funcaoColaborador: funcao || 'Operador',
      atividade: atividade || 'Operação padrão',
      descricao,
      causaImediata: causaImediata || 'Desvio operacional identificado durante a atividade',
      causaBasica: causaBasica || 'Procedimento operacional requer revisão técnica e retreinamento',
      fatoresContribuintes: ['Falta de atenção concentrada', 'Sinalização visual insuficiente'],
      testemunhas: ['Supervisor de turno'],
      evidenciasFotograficas: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
      ],
      investigadorResponsavel: 'Técnico de Segurança de Plantão',
      statusInvestigacao: 'Em Investigação',
      diasPerdidos: Number(diasPerdidos) || 0,
    };

    onAddIncident(newOcorrencia);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Registro de Ocorrência SST (Acidente / Incidente)</h3>
              <p className="text-[11px] text-slate-400">Notificação imediata para abertura de fluxo de investigação e ação 5W2H</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 overflow-y-auto space-y-3 flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Tipo de Ocorrência:</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Incidente / Quase-Acidente">Incidente / Quase-Acidente (Bird)</option>
                <option value="Acidente com Afastamento (CPT)">Acidente com Afastamento (CPT)</option>
                <option value="Acidente sem Afastamento (SPT)">Acidente sem Afastamento (SPT)</option>
                <option value="Condição Insegura">Condição Insegura</option>
                <option value="Ato Inseguro / Comportamental">Ato Inseguro / Comportamental</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Severidade Preliminar:</label>
              <select
                value={severidade}
                onChange={(e) => setSeveridade(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Leve">Leve (Sem lesão ou primeiro socorro)</option>
                <option value="Moderada">Moderada (Atendimento médico ambulatorial)</option>
                <option value="Grave">Grave (Afastamento ou perda de função)</option>
                <option value="Fatal">Catastrófica / Fatal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Unidade:</label>
              <select
                value={unidadeId}
                onChange={(e) => setUnidadeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>{u.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Setor Fabril:</label>
              <select
                value={setorId}
                onChange={(e) => setSetorId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {setores.map((s) => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Turno de Trabalho:</label>
              <select
                value={turno}
                onChange={(e) => setTurno(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="TURNO_A">Turno A (06h - 14h)</option>
                <option value="TURNO_B">Turno B (14h - 22h)</option>
                <option value="TURNO_C">Turno C (22h - 06h)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Colaborador Envolvido:</label>
              <input
                type="text"
                value={colaborador}
                onChange={(e) => setColaborador(e.target.value)}
                placeholder="Nome do colaborador ou 'Coletivo'"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Função / Cargo:</label>
              <input
                type="text"
                value={funcao}
                onChange={(e) => setFuncao(e.target.value)}
                placeholder="Ex: Operador de Prensa, Mecânico..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Descrição Factual da Ocorrência (*):</label>
            <textarea
              required
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva exatamente o que ocorreu, máquinas envolvidas, condições ambientais e como o trabalhador foi amparado..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Causa Imediata Aparente:</label>
              <input
                type="text"
                value={causaImediata}
                onChange={(e) => setCausaImediata(e.target.value)}
                placeholder="Ex: Óleo no piso, ausência de óculos..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Dias de Afastamento Previstos:</label>
              <input
                type="number"
                min="0"
                value={diasPerdidos}
                onChange={(e) => setDiasPerdidos(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Footer inside form */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * Gera alerta automático na Central de Alertas e notificação para o SESMT
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow"
              >
                Concluir Registro
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
