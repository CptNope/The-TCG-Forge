import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { openAI } from '../src/services/openai';

const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const currentKey = openAI.getApiKey();
    if (currentKey) {
      setApiKey(currentKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      openAI.setApiKey(apiKey.trim());
      alert('API key saved successfully!');
      setConnectionStatus('idle');
    }
  };

  const handleClearKey = () => {
    if (confirm('Are you sure you want to remove your API key?')) {
      openAI.clearApiKey();
      setApiKey('');
      setConnectionStatus('idle');
      alert('API key removed');
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      alert('Please enter an API key first');
      return;
    }

    setTestingConnection(true);
    setConnectionStatus('idle');

    try {
      // Save key first
      openAI.setApiKey(apiKey.trim());
      
      // Test with a simple generation
      await openAI.generateText({
        prompt: 'Say "Connection successful"',
        maxTokens: 10,
      });

      setConnectionStatus('success');
      alert('✅ Connection successful! OpenAI API is working.');
    } catch (error: any) {
      setConnectionStatus('error');
      alert(`❌ Connection failed: ${error.message}`);
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-black/5 dark:border-white/10 bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-bold">Settings</h1>
            <p className="text-xs text-slate-500">Configure AI generation</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* OpenAI Section */}
        <div className="bg-white dark:bg-white/5 rounded-xl p-6 border border-black/5 dark:border-white/10">
          <div className="flex items-start gap-3 mb-6">
            <span className="material-symbols-outlined text-4xl text-primary">psychology</span>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">OpenAI Integration</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Connect your OpenAI API key to unlock AI-powered card generation
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">What You Can Generate:</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• 🎨 <strong>Card Artwork</strong> - DALL-E 3 generates unique card images</li>
              <li>• ✨ <strong>Ability Text</strong> - GPT creates balanced, thematic abilities</li>
              <li>• 📜 <strong>Flavor Text</strong> - Atmospheric lore and descriptions</li>
              <li>• 🎲 <strong>Card Names</strong> - Creative, memorable names</li>
              <li>• 🚀 <strong>Bulk Ideas</strong> - Generate dozens of card concepts at once</li>
            </ul>
          </div>

          {/* API Key Input */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">OpenAI API Key</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none focus:border-primary font-mono text-sm"
                    placeholder="sk-..."
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded"
                  >
                    <span className="material-symbols-outlined text-slate-400">
                      {showKey ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.openai.com/api-keys</a>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSaveKey}
                disabled={!apiKey.trim()}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save API Key
              </button>
              <button
                onClick={handleTestConnection}
                disabled={!apiKey.trim() || testingConnection}
                className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testingConnection ? 'Testing...' : 'Test Connection'}
              </button>
              {openAI.hasApiKey() && (
                <button
                  onClick={handleClearKey}
                  className="px-4 py-3 border border-red-500 text-red-600 rounded-lg font-bold hover:bg-red-500/10 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Connection Status */}
            {connectionStatus !== 'idle' && (
              <div className={`p-3 rounded-lg ${
                connectionStatus === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                <p className={`text-sm font-medium ${
                  connectionStatus === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                }`}>
                  {connectionStatus === 'success' ? '✅ Connected successfully!' : '❌ Connection failed'}
                </p>
              </div>
            )}
          </div>

          {/* Security Warning */}
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">warning</span>
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Security Note:</strong> Your API key is stored locally in your browser. 
                It's never sent to our servers. However, be cautious when using shared computers. 
                OpenAI charges based on usage - monitor your usage at <a href="https://platform.openai.com/usage" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/usage</a>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="bg-white dark:bg-white/5 rounded-xl p-6 border border-black/5 dark:border-white/10">
          <h3 className="font-bold text-lg mb-3">Estimated Costs</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">DALL-E 3 (1024x1024, standard)</span>
              <span className="font-bold">$0.040 per image</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">DALL-E 3 (1024x1024, HD)</span>
              <span className="font-bold">$0.080 per image</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">GPT-3.5-turbo</span>
              <span className="font-bold">~$0.001 per generation</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">GPT-4</span>
              <span className="font-bold">~$0.03 per generation</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Prices as of Nov 2024. Check <a href="https://openai.com/pricing" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openai.com/pricing</a> for current rates.
          </p>
        </div>

        {/* Usage Tips */}
        <div className="bg-white dark:bg-white/5 rounded-xl p-6 border border-black/5 dark:border-white/10">
          <h3 className="font-bold text-lg mb-3">💡 Tips for Best Results</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>• Be specific in your card details for better AI generations</li>
            <li>• Use GPT-3.5 for ability text (faster, cheaper, good quality)</li>
            <li>• Use GPT-4 for complex card mechanics or lore</li>
            <li>• Generate artwork in standard quality first, then upgrade favorites to HD</li>
            <li>• Generate multiple options and pick the best one</li>
            <li>• Use bulk generation sparingly - it can get expensive quickly!</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default SettingsScreen;
