import { useState } from 'react';
import { S } from './styles.js';
import { toUS, generateSizingId } from './lib/calculations.js';
import Logo from './components/Logo.jsx';
import SizingPage from './components/SizingPage.jsx';
import ConfigurePage from './components/ConfigurePage.jsx';
import DatasheetPage from './components/DatasheetPage.jsx';
import KnowledgePage from './components/KnowledgePage.jsx';
import ApplicationsPage from './components/ApplicationsPage.jsx';

const PAGE_LABELS = {
  sizing: 'Sizing',
  configure: 'Configure',
  datasheet: 'Datasheet',
  knowledge: 'Knowledge Base',
  applications: 'Applications',
};

export default function App() {
  const [page, setPage] = useState('sizing');

  const [sizingState, setSizingState] = useState({
    units: 'US', flow: '', pressure: '', viscosity: '', temp: '70',
    pumpTypeFilter: 'All', manualMode: true, manualPump: 'PD450', manualCls: 'D',
    customerName: '', quoteNumber: '', advOpen: false,
    candidates: null, recResult: null, recCls: 'D', recPump: null,
  });

  const [config, setConfig] = useState({
    rotorStyle: 'Bi-Wing', rotorMaterial: '316SS', connection: '2.0" Tri-Clamp',
    housing: 'Standard Aluminum', seal: 'Single Mechanical', shaft: 'Standard',
    drive: 'Direct Drive', reliefValve: false,
  });

  const [projectName, setProjectName] = useState('');
  const [sizing, setSizing] = useState(null);
  const [saved, setSaved] = useState(false);
  const [sizingId, setSizingId] = useState('');

  const handleConfigure = (result) => {
    setSizing({
      ...result,
      _flow:     toUS(+sizingState.flow,            'flow',     sizingState.units),
      _pressure: toUS(+sizingState.pressure,         'pressure', sizingState.units),
      _visc:     +sizingState.viscosity,
      _temp:     toUS(+(sizingState.temp || 70),     'temp',     sizingState.units),
    });
    const conns = result.pump.port.split('/').map(p => `${p.trim()} Tri-Clamp`);
    setConfig(c => ({...c, connection: conns[0]}));
    setSaved(false);
    setPage('configure');
  };

  const handleConfirm = () => {
    setSizingId(generateSizingId());
    setSaved(true);
    setPage('datasheet');
  };

  return (
    <div style={S.page}>
      <div className="no-print" style={S.nav}>
        <div style={S.navLogo}>
          <Logo size={30}/>
          <div>
            <div style={S.navTitle}>UNIBLOC</div>
            <div style={S.navSub}>Hygienic Technologies · Pump Sizing Tool</div>
          </div>
        </div>
        <div style={S.navTabs}>
          {Object.entries(PAGE_LABELS).map(([key, label]) => (
            <button key={key} style={S.navTab(page === key)} onClick={()=>setPage(key)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={S.content}>
        {page === 'sizing' && (
          <SizingPage state={sizingState} setState={setSizingState} onConfigure={handleConfigure}/>
        )}
        {page === 'configure' && (
          <ConfigurePage sizing={sizing} config={config} setConfig={setConfig}
            projectName={projectName} setProjectName={setProjectName}
            onConfirm={handleConfirm} onBack={()=>setPage('sizing')}/>
        )}
        {page === 'datasheet' && (
          <DatasheetPage sizing={sizing} config={config} projectName={projectName}
            customerName={sizingState.customerName} quoteNumber={sizingState.quoteNumber}
            units={sizingState.units} saved={saved} sizingId={sizingId}
            onBack={()=>setPage('configure')}/>
        )}
        {page === 'knowledge' && <KnowledgePage/>}
        {page === 'applications' && <ApplicationsPage/>}
      </div>
    </div>
  );
}
