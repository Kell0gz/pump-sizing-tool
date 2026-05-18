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
    driveType: 'Direct Drive',
  });

  const [config, setConfig] = useState({
    series: '5000', flangeMount: '',
    coverType: '10', rotorHousing: '10',
    connectionType: 'P', connectionSize: '20', portOrientation: 'H',
    rotorCode: '81', materialGrade: 'Standard',
    drive: 'Direct Drive', shaft: '10', driveOrientation: 'T',
    seal: '11a', elastomer: 'V',
  });

  const [projectName, setProjectName] = useState('');
  const [sizing, setSizing] = useState(null);
  const [saved, setSaved] = useState(false);
  const [sizingId, setSizingId] = useState('');

  const handleConfigure = (result) => {
    const sizing = {
      ...result,
      _flow:     toUS(+sizingState.flow,            'flow',     sizingState.units),
      _pressure: toUS(+sizingState.pressure,         'pressure', sizingState.units),
      _visc:     +sizingState.viscosity,
      _temp:     toUS(+(sizingState.temp || 70),     'temp',     sizingState.units),
    };
    setSizing(sizing);

    // Map port size string to connection size code
    const portStr = result.pump.port.split('/').pop().trim();
    const portMap = {'0.5"':'05','0.75"':'07','1.0"':'10','1.5"':'15','2.0"':'20','2.5"':'25','3.0"':'30','4.0"':'40','6.0"':'60','8.0"':'80'};
    const connSize = portMap[portStr] || '20';

    // Smart defaults (Section 5)
    const dutyRPM = result.dutyRPM || 0;
    const seal = dutyRPM > 500 ? '10' : '11a';
    // Default to N60 SS Bi-Lobe for the sized class
    const clsToRotor = { A:'25', B:'26', C:'80', D:'81', E:'82', F:'83', G:'84' };
    const rotorCode = result.isGear ? '' : (clsToRotor[result.cls] || '81');

    setConfig(c => ({
      ...c,
      connectionSize: connSize,
      seal,
      rotorCode,
      drive: sizingState.driveType,
    }));
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
