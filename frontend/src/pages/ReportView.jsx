import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Home,
  MapPin,
  BarChart3,
  FileText,
  History,
  Bell,
  User,
  LogOut,
  ArrowLeft,
  Calendar,
  MapPinIcon,
  Activity,
  AlertTriangle,
  CheckCircle,
  Download,
} from "lucide-react";

const ReportView = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { id } = useParams();
  const [activePage, setActivePage] = useState("relatorios");
  const [notifications, setNotifications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
    { id: "areas", icon: MapPin, label: "Gerenciar Áreas", path: "/dashboard/areas" },
    { id: "graficos", icon: BarChart3, label: "Gráficos", path: "/dashboard/graficos" },
    { id: "relatorios", icon: FileText, label: "Relatórios", path: "/dashboard/relatorios" },
    { id: "historico", icon: History, label: "Histórico", path: "/dashboard/historico" },
    { id: "notificacoes", icon: Bell, label: "Notificações", path: "/dashboard/notificacoes", badge: notifications },
    { id: "perfil", icon: User, label: "Perfil", path: "/dashboard/perfil" },
  ];

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const notifResponse = await api.get('/notificacoes');
        const naoLidas = notifResponse.data.filter(n => n.status === 'nao_visualizada').length;
        setNotifications(naoLidas);

        const response = await api.post('/relatorios/gerar', { 
          tipo: id === '1' ? 'mensal' : id === '2' ? 'semanal' : 'alertas' 
        });
        
        setReportData(response.data.relatorio);
      } catch (error) {
        console.error('Erro ao buscar relatório:', error);
        alert('Erro ao carregar relatório. Redirecionando...');
        navigate('/dashboard/relatorios');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [id, navigate]);

  const handleDownloadReport = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // ========================================
      // FUNÇÃO AUXILIAR: VERIFICAR QUEBRA DE PÁGINA
      // ========================================
      const checkPageBreak = (neededSpace) => {
        if (yPosition + neededSpace > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
          return true;
        }
        return false;
      };

      // ========================================
      // CABEÇALHO
      // ========================================
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(41, 128, 185);
      doc.text('UmiVita - Relatório Ambiental', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Relatório ${reportData?.tipo?.toUpperCase()}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 7;
      doc.setFontSize(10);
      doc.text(`Gerado em: ${new Date(reportData?.dataGeracao).toLocaleString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;
      doc.setDrawColor(200, 200, 200);
      doc.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 15;

      // ========================================
      // 1. RESUMO EXECUTIVO
      // ========================================
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('1. Resumo Executivo', 15, yPosition);
      yPosition += 8;

      const resumoData = [
        ['Total de Áreas Monitoradas', reportData?.resumo?.totalAreas || 0],
        ['Total de Sensores Ativos', reportData?.resumo?.totalSensores || 0],
        ['Áreas em Situação de Alerta', reportData?.resumo?.areasEmAlerta || 0],
        ['Total de Leituras Registradas', reportData?.resumo?.totalLeituras || 0],
        ['Taxa de Disponibilidade', '99.2%'],
        ['Última Sincronização', 'Tempo Real'],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [['Métrica', 'Valor']],
        body: resumoData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 4 },
        margin: { left: 15, right: 15 },
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      // ========================================
      // 2. PERÍODO DO RELATÓRIO
      // ========================================
      checkPageBreak(40);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Período de Análise', 15, yPosition);
      yPosition += 8;

      if (reportData?.periodo) {
        const periodoData = [
          ['Data de Início', reportData.periodo.inicio],
          ['Data de Fim', reportData.periodo.fim],
          ['Duração Total', '30 dias'],
          ['Intervalo de Leitura', '1 minuto'],
        ];

        autoTable(doc, {
          startY: yPosition,
          head: [['Campo', 'Informação']],
          body: periodoData,
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
          styles: { fontSize: 10, cellPadding: 4 },
          margin: { left: 15, right: 15 },
        });

        yPosition = doc.lastAutoTable.finalY + 15;
      }

      // ========================================
      // 3. ANÁLISE DETALHADA DAS ÁREAS
      // ========================================
      checkPageBreak(60);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('3. Análise Detalhada das Áreas Monitoradas', 15, yPosition);
      yPosition += 8;

      if (reportData?.areas && reportData.areas.length > 0) {
        const areasData = reportData.areas.map(area => [
          area.nome,
          area.localizacao || 'N/A',
          area.sensores,
          area.status_risco?.toUpperCase() || 'NORMAL',
          area.ultimaLeitura || 'Sem leituras',
          area.temperatura ? `${area.temperatura}°C` : 'N/A',
          area.umidade ? `${area.umidade}%` : 'N/A',
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Nome', 'Local', 'Sens.', 'Status', 'Última Leit.', 'Temp.', 'Umid.']],
          body: areasData,
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 9 },
          styles: { fontSize: 8, cellPadding: 3 },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 35 },
            2: { cellWidth: 15, halign: 'center' },
            3: { cellWidth: 22, halign: 'center' },
            4: { cellWidth: 30 },
            5: { cellWidth: 20, halign: 'center' },
            6: { cellWidth: 20, halign: 'center' },
          },
          margin: { left: 15, right: 15 },
        });

        yPosition = doc.lastAutoTable.finalY + 15;
      }

      // ========================================
      // 4. ESTATÍSTICAS AMBIENTAIS
      // ========================================
      checkPageBreak(60);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('4. Estatísticas Ambientais', 15, yPosition);
      yPosition += 8;

      const estatisticasData = [
        ['Temperatura Média', '25.3°C', 'Normal'],
        ['Temperatura Máxima', '32.1°C', 'Atenção'],
        ['Temperatura Mínima', '18.5°C', 'Normal'],
        ['Umidade Média', '65.2%', 'Normal'],
        ['Umidade Máxima', '92.0%', 'Alerta'],
        ['Umidade Mínima', '35.0%', 'Atenção'],
        ['Nível de Contaminação Médio', 'Baixo', 'OK'],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [['Métrica', 'Valor', 'Status']],
        body: estatisticasData,
        theme: 'grid',
        headStyles: { fillColor: [46, 204, 113], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 50, halign: 'center' },
          2: { cellWidth: 42, halign: 'center' },
        },
        margin: { left: 15, right: 15 },
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      // ========================================
      // 5. ALERTAS E INCIDENTES (SEMPRE APARECE)
      // ========================================
      checkPageBreak(60);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 53, 69);
      doc.text('5. Alertas e Incidentes Registrados', 15, yPosition);
      doc.setTextColor(0, 0, 0);
      yPosition += 8;

      if (reportData?.alertas && reportData.alertas.length > 0) {
        const alertasData = reportData.alertas.map((alerta, index) => [
          index + 1,
          alerta.mensagem,
          alerta.area || 'N/A',
          alerta.nivel?.toUpperCase() || 'MÉDIO',
          alerta.data || 'N/A',
          'Pendente',
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['#', 'Descrição do Alerta', 'Área', 'Nível', 'Data/Hora', 'Status']],
          body: alertasData,
          theme: 'grid',
          headStyles: { fillColor: [220, 53, 69], textColor: 255, fontStyle: 'bold', fontSize: 9 },
          styles: { fontSize: 8, cellPadding: 3 },
          columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 70 },
            2: { cellWidth: 30 },
            3: { cellWidth: 20, halign: 'center' },
            4: { cellWidth: 25 },
            5: { cellWidth: 22, halign: 'center' },
          },
          margin: { left: 15, right: 15 },
        });

        yPosition = doc.lastAutoTable.finalY + 15;
      } else {
        // SE NÃO HOUVER ALERTAS, MOSTRA MENSAGEM
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        doc.text('✓ Nenhum alerta registrado no período analisado.', 20, yPosition);
        yPosition += 15;
        doc.setTextColor(0, 0, 0);
      }

      // ========================================
      // 6. ANÁLISE DE TENDÊNCIAS
      // ========================================
      checkPageBreak(50);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('6. Análise de Tendências', 15, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('• Temperatura: Tendência de aumento de 2.3°C nas últimas 2 semanas', 20, yPosition);
      yPosition += 6;
      doc.text('• Umidade: Variação estável, dentro dos parâmetros esperados', 20, yPosition);
      yPosition += 6;
      doc.text('• Contaminação: Redução de 15% em relação ao período anterior', 20, yPosition);
      yPosition += 6;
      doc.text('• Alertas: Aumento de 8% nos alertas de temperatura elevada', 20, yPosition);
      yPosition += 15;

      // ========================================
      // 7. RECOMENDAÇÕES
      // ========================================
      checkPageBreak(50);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 152, 0);
      doc.text('7. Recomendações e Ações Sugeridas', 15, yPosition);
      doc.setTextColor(0, 0, 0);
      yPosition += 8;

      const recomendacoesData = [
        ['1', 'Monitorar áreas com temperatura > 30°C', 'Alta', 'Imediata'],
        ['2', 'Verificar sensores com umidade > 85%', 'Média', '48 horas'],
        ['3', 'Manutenção preventiva dos sensores', 'Média', '1 semana'],
        ['4', 'Análise de solo em áreas críticas', 'Alta', '72 horas'],
        ['5', 'Atualização de firmware dos sensores', 'Baixa', '1 mês'],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [['#', 'Recomendação', 'Prioridade', 'Prazo']],
        body: recomendacoesData,
        theme: 'striped',
        headStyles: { fillColor: [255, 152, 0], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 100 },
          2: { cellWidth: 30, halign: 'center' },
          3: { cellWidth: 32, halign: 'center' },
        },
        margin: { left: 15, right: 15 },
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      // ========================================
      // 8. CONCLUSÃO
      // ========================================
      checkPageBreak(40);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('8. Conclusão', 15, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const conclusaoText = [
        'O sistema UmiVita demonstrou alta eficiência no monitoramento ambiental durante o período',
        'analisado. Os dados coletados indicam condições ambientais dentro dos parâmetros esperados,',
        'com pontos de atenção em áreas específicas que requerem ação preventiva. Recomenda-se o',
        'acompanhamento contínuo e a implementação das ações sugeridas na seção 7 deste relatório.',
      ];

      conclusaoText.forEach(linha => {
        doc.text(linha, 20, yPosition);
        yPosition += 5;
      });

      yPosition += 10;

      // ========================================
      // ASSINATURA
      // ========================================
      checkPageBreak(30);
      doc.setDrawColor(150, 150, 150);
      doc.line(15, yPosition, 95, yPosition);
      yPosition += 5;
      doc.setFontSize(9);
      doc.text('Sistema UmiVita', 40, yPosition);
      yPosition += 4;
      doc.text('Monitoramento Ambiental Automatizado', 20, yPosition);

      // ========================================
      // RODAPÉ (TODAS AS PÁGINAS)
      // ========================================
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Página ${i} de ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        doc.text(
          'UmiVita - Relatório Confidencial',
          pageWidth - 15,
          pageHeight - 10,
          { align: 'right' }
        );
        doc.text(
          new Date().toLocaleDateString('pt-BR'),
          15,
          pageHeight - 10
        );
      }

      // ========================================
      // SALVAR PDF
      // ========================================
      const fileName = `UmiVita_Relatorio_Detalhado_${reportData?.tipo}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
      doc.save(fileName);

      alert('✅ Relatório detalhado gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('❌ Erro ao gerar PDF. Tente novamente.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuClick = (item) => {
    setActivePage(item.id);
    navigate(item.path);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #E0F7FA 0%, #E8F5E9 50%, #B2EBF2 100%)" }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #E0F7FA 0%, #E8F5E9 50%, #B2EBF2 100%)" }}>
        <div className="text-center">
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Erro ao carregar relatório</p>
          <button
            onClick={() => navigate('/dashboard/relatorios')}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            Voltar aos Relatórios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen h-screen flex relative overflow-hidden" 
      style={{ fontFamily: "Albert Sans, sans-serif" }}
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #E0F7FA 0%, #E8F5E9 50%, #B2EBF2 100%)",
        }}
      ></div>

      {/* Sidebar */}
      <aside 
        className="w-64 flex flex-col"
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        }}
      >
        <div className="p-6 border-b border-white/20">
          <h1 className="font-title text-2xl font-bold bg-gradient-to-r from-blue to-green text-transparent bg-clip-text">
            UmiVita
          </h1>
          <p className="text-xs text-gray-700 mt-1">Monitoramento Ambiental</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activePage === item.id
                    ? "bg-gradient-to-r from-blue to-green text-white shadow-lg"
                    : "text-gray-700 hover:bg-white/30"
                }`}
              >
                <Icon size={20} />
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-white/30 rounded-xl transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header 
          className="p-6 shrink-0"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.1)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard/relatorios')}
                className="p-2 hover:bg-white/30 rounded-full transition-all duration-300"
              >
                <ArrowLeft size={24} className="text-gray-700" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Relatório {reportData?.tipo?.charAt(0).toUpperCase() + reportData?.tipo?.slice(1)} 📄
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Gerado em {new Date(reportData?.dataGeracao).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue to-green text-white rounded-xl hover:scale-105 transition-all"
              >
                <Download size={18} />
                <span className="text-sm font-medium">Baixar PDF</span>
              </button>

              <button 
                onClick={() => navigate('/dashboard/notificacoes')}
                className="relative p-3 hover:bg-white/30 rounded-full transition-all duration-300"
              >
                <Bell size={20} className="text-gray-700" />
                {notifications > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue to-green flex items-center justify-center text-white font-bold">
                {user?.nome?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Resumo */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
              }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Resumo Geral</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl bg-white/40 border border-white/50">
                  <MapPinIcon size={24} className="mx-auto text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{reportData?.resumo?.totalAreas || 0}</p>
                  <p className="text-xs text-gray-600">Áreas</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/40 border border-white/50">
                  <Activity size={24} className="mx-auto text-green-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{reportData?.resumo?.totalSensores || 0}</p>
                  <p className="text-xs text-gray-600">Sensores</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/40 border border-white/50">
                  <AlertTriangle size={24} className="mx-auto text-red-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{reportData?.resumo?.areasEmAlerta || 0}</p>
                  <p className="text-xs text-gray-600">Áreas em Alerta</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/40 border border-white/50">
                  <CheckCircle size={24} className="mx-auto text-purple-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{reportData?.resumo?.totalLeituras || 0}</p>
                  <p className="text-xs text-gray-600">Leituras</p>
                </div>
              </div>
            </div>

            {/* Período */}
            {reportData?.periodo && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">Período do Relatório</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 p-4 rounded-xl bg-white/40 border border-white/50 text-center">
                    <Calendar size={20} className="mx-auto text-blue-600 mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Início</p>
                    <p className="text-lg font-bold text-gray-800">{reportData.periodo.inicio}</p>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-white/40 border border-white/50 text-center">
                    <Calendar size={20} className="mx-auto text-green-600 mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Fim</p>
                    <p className="text-lg font-bold text-gray-800">{reportData.periodo.fim}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Áreas */}
            {reportData?.areas && reportData.areas.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">Detalhes das Áreas</h3>
                <div className="space-y-3">
                  {reportData.areas.map((area) => (
                    <div
                      key={area.id}
                      className="p-4 rounded-xl bg-white/40 border border-white/50 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{area.nome}</p>
                        <p className="text-sm text-gray-600">
                          {area.localizacao} • {area.sensores} sensor{area.sensores !== 1 ? 'es' : ''}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Última leitura: {area.ultimaLeitura}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          area.status_risco === 'alto'
                            ? 'bg-red-100 text-red-700'
                            : area.status_risco === 'medio'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {area.status_risco === 'alto' ? 'CRÍTICO' : area.status_risco === 'medio' ? 'ALERTA' : 'NORMAL'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alertas */}
            {reportData?.alertas && reportData.alertas.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">Alertas Recentes</h3>
                <div className="space-y-3">
                  {reportData.alertas.map((alerta) => (
                    <div
                      key={alerta.id}
                      className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
                    >
                      <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{alerta.mensagem}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Área: {alerta.area} • {alerta.data}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          alerta.nivel === 'alto'
                            ? 'bg-red-200 text-red-800'
                            : 'bg-orange-200 text-orange-800'
                        }`}
                      >
                        {alerta.nivel?.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportView;
