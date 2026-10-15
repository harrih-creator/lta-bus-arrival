import React, { useState } from 'react';
import { LtaApiConfig } from '../types/bus';
import { saveLtaConfig } from '../services/ltaApi';
import { X, Server, Key, Link as LinkIcon, CheckCircle2, AlertTriangle, Code, Play } from 'lucide-react';

interface BackendConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LtaApiConfig;
  onSaveConfig: (newConfig: LtaApiConfig) => void;
}

export const BackendConnectorModal: React.FC<BackendConnectorModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [backendUrl, setBackendUrl] = useState(config.backendUrl || '');
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [useBackend, setUseBackend] = useState(config.useBackend);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: LtaApiConfig = {
      backendUrl: backendUrl.trim(),
      apiKey: apiKey.trim(),
      useBackend
    };
    saveLtaConfig(updated);
    onSaveConfig(updated);
    onClose();
  };

  const handleTestBackend = async () => {
    if (!backendUrl.trim()) {
      setTestStatus('error');
      setTestMessage('Please specify a backend URL to test.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Connecting to backend endpoint...');

    try {
      const url = `${backendUrl.trim().replace(/\/$/, '')}/api/busarrival?BusStopCode=83139`;
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (apiKey.trim()) {
        headers['AccountKey'] = apiKey.trim();
      }

      const res = await fetch(url, { headers });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        setTestStatus('success');
        setTestMessage(`Successfully connected to LTA DataMall v3! Stop 83139 returned ${data?.Services?.length || 0} services.`);
      } else {
        setTestStatus('error');
        setTestMessage(`Status ${res.status}: ${data?.message || data?.error || res.statusText}`);
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(`Connection failed: ${err.message || 'Network error or CORS restriction'}`);
    }
  };

  const handleTestHealth = async () => {
    setTestStatus('testing');
    setTestMessage('Checking /api/health...');
    try {
      const url = `${backendUrl.trim().replace(/\/$/, '')}/api/health`;
      const res = await fetch(url);
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setTestStatus('success');
        setTestMessage(`Health check OK! Key configured: ${data?.ltaKeyConfigured ? 'Yes (Live LTA Active)' : 'No (Key required in LTA_ACCOUNT_KEY)'}`);
      } else {
        setTestStatus('error');
        setTestMessage(`Health check failed with status ${res.status}`);
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(`Health check error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <Server className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Backend & LTA DataMall Gateway</h3>
              <p className="text-xs text-slate-400">Configure your upcoming custom backend connection</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Active Mode Banner */}
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
            <div className="text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-white">Frontend Ready for Plug-and-Play Backend:</span>
              <p className="text-slate-400 leading-relaxed">
                The frontend currently operates on a full Singapore transit simulation engine. Whenever you're ready, toggle the custom backend switch below and plug in your server endpoint.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800">
            <div>
              <span className="text-sm font-semibold text-white block">Enable Custom Backend API</span>
              <span className="text-xs text-slate-400">
                Route queries to your backend instead of the local simulation engine
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useBackend}
                onChange={e => setUseBackend(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Backend Server URL
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={backendUrl}
                  onChange={e => setBackendUrl(e.target.value)}
                  placeholder="https://your-api-domain.com or http://localhost:3000"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Serverless endpoints: <code className="text-blue-400">/api/busarrival?BusStopCode=83139</code> and <code className="text-emerald-400">/api/health</code>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                LTA DataMall AccountKey (Optional override)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="Set LTA_ACCOUNT_KEY in .env or provide here"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Tip: If left blank, the server will read <code className="text-slate-400">process.env.LTA_ACCOUNT_KEY</code>.
              </span>
            </div>
          </div>

          {/* Test Buttons & Status */}
          <div className="pt-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleTestHealth}
                disabled={testStatus === 'testing'}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <span>Check /api/health</span>
              </button>

              <button
                onClick={handleTestBackend}
                disabled={testStatus === 'testing'}
                className="py-2.5 px-3 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm shadow-blue-500/20"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Test Stop 83139</span>
              </button>
            </div>

            {testStatus === 'success' && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{testMessage}</span>
              </div>
            )}

            {testStatus === 'error' && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{testMessage}</span>
              </div>
            )}
          </div>

          {/* Contract Schema Code Sample */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Code className="w-4 h-4 text-blue-400" />
              <span>Expected LTA DataMall v2 JSON Response:</span>
            </div>
            <pre className="text-[11px] font-mono text-slate-400 overflow-x-auto p-2 bg-slate-900/60 rounded-lg">
{`{
  "BusStopCode": "08057",
  "Services": [
    {
      "ServiceNo": "190",
      "Operator": "SMRT",
      "NextBus": {
        "EstimatedArrival": "2026-10-14T23:45:00+08:00",
        "Latitude": 1.3012,
        "Longitude": 103.8390,
        "Load": "SEA",
        "Feature": "WAB",
        "Type": "DD"
      }
    }
  ]
}`}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-md shadow-blue-500/20"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
