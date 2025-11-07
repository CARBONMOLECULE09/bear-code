import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { apiService } from '../services/api';
import { Search, FileCode, Loader2, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import type { SearchResult } from '../types';

export const SearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'index'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Index form
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [fileName, setFileName] = useState('');
  const [indexing, setIndexing] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await apiService.searchCode(searchQuery, 10);
      setSearchResults(response.data || []);
      if (response.data?.length === 0) {
        toast('No results found', { icon: '🔍' });
      } else {
        toast.success(`Found ${response.data?.length} results`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleIndex = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIndexing(true);
    try {
      await apiService.indexCode(code, language, { fileName });
      toast.success('Code indexed successfully!');
      setCode('');
      setFileName('');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Indexing failed');
    } finally {
      setIndexing(false);
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success('Code copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Code Search</h1>
          <p className="text-gray-600 mt-2">
            Search your indexed code or add new snippets
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-bear-600 border-b-2 border-bear-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Search className="w-5 h-5 inline mr-2" />
            Search Code
          </button>
          <button
            onClick={() => setActiveTab('index')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'index'
                ? 'text-bear-600 border-b-2 border-bear-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileCode className="w-5 h-5 inline mr-2" />
            Index Code
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="card">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Query
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input"
                    placeholder="e.g., function that sorts an array"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Use natural language to describe what you're looking for
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={searching}
                  className="btn btn-primary flex items-center"
                >
                  {searching ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Search (2 credits)
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Results ({searchResults.length})
                </h2>
                {searchResults.map((result) => (
                  <div key={result.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="badge badge-info">{result.language}</span>
                        <span className="ml-2 text-sm text-gray-600">
                          Score: {(result.score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <button
                        onClick={() => copyCode(result.code, result.id)}
                        className="btn btn-secondary btn-sm flex items-center"
                      >
                        {copiedId === result.id ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{result.code}</code>
                    </pre>
                    {result.metadata.fileName && (
                      <p className="text-sm text-gray-600 mt-2">
                        File: {result.metadata.fileName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Index Tab */}
        {activeTab === 'index' && (
          <div className="card">
            <form onSubmit={handleIndex} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code
                </label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="input font-mono text-sm"
                  rows={12}
                  placeholder="Paste your code here..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="cpp">C++</option>
                    <option value="csharp">C#</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="input"
                    placeholder="example.js"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={indexing}
                className="btn btn-primary flex items-center"
              >
                {indexing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Indexing...
                  </>
                ) : (
                  <>
                    <FileCode className="w-5 h-5 mr-2" />
                    Index Code (1 credit)
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};
