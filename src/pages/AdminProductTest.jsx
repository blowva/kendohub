// src/pages/AdminProductTest.jsx
import { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check, AlertCircle, Hash, Plus, Trash2 } from 'lucide-react';
import { products } from '../data/products';
import {
  generateUniqueProductCode,
  extractCodes,
  formatProductCode,
} from '../utils/productCode';
import './AdminProductTest.css';

export default function AdminProductTest() {
  // Pretend these are products that already have codes assigned.
  // In real use this comes from your Supabase products table.
  const [assignedCodes, setAssignedCodes] = useState([]);
  const [currentCode, setCurrentCode] = useState('');
  const [productName, setProductName] = useState('');
  const [copied, setCopied] = useState(false);
  const [validateInput, setValidateInput] = useState('');
  const [validateResult, setValidateResult] = useState(null);

  const allTakenCodes = [...extractCodes(products), ...assignedCodes.map((a) => a.code)];

  const handleGenerate = () => {
    const code = generateUniqueProductCode(allTakenCodes);
    setCurrentCode(code);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!currentCode) return;
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleAssign = () => {
    if (!currentCode || !productName.trim()) return;
    setAssignedCodes((prev) => [
      { code: currentCode, name: productName.trim(), at: Date.now() },
      ...prev,
    ]);
    setCurrentCode('');
    setProductName('');
  };

  const handleRemove = (code) => {
    setAssignedCodes((prev) => prev.filter((a) => a.code !== code));
  };

  const handleValidate = () => {
    const cleaned = formatProductCode(validateInput);
    if (!cleaned) {
      setValidateResult({ ok: false, msg: 'Invalid format. Expected SHO-XXXXXX (6 digits).' });
      return;
    }
    if (allTakenCodes.includes(cleaned)) {
      setValidateResult({ ok: false, msg: `${cleaned} is already in use.` });
      return;
    }
    setValidateResult({ ok: true, msg: `${cleaned} is valid and available.` });
  };

  return (
    <div className="adm-test page-enter">
      <div className="adm-test-container">

        <header className="adm-test-head">
          <p className="adm-test-eyebrow">
            <Sparkles size={12} /> ADMIN · PRODUCT CODE GENERATOR
          </p>
          <h1>Generate unique product codes.</h1>
          <p className="adm-test-lede">
            Click generate. The system creates a SHO-XXXXXX code that doesn't exist anywhere
            in your catalogue. Same logic FortiSafe uses for tracking.
          </p>
        </header>

        {/* Generator card */}
        <section className="adm-test-card">
          <div className="adm-test-card-head">
            <Hash size={16} />
            <h2>New product code</h2>
          </div>

          <label className="adm-test-field">
            <span className="adm-test-label">Product name</span>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Mini Portable Projector"
              className="adm-test-input"
            />
          </label>

          <label className="adm-test-field">
            <span className="adm-test-label">Generated code</span>
            <div className="adm-test-code-row">
              <input
                type="text"
                value={currentCode}
                readOnly
                placeholder="Click 'Generate' to create one"
                className="adm-test-code-input"
              />
              {currentCode && (
                <button type="button" className="adm-test-icon-btn" onClick={handleCopy} aria-label="Copy code">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              )}
            </div>
          </label>

          <div className="adm-test-actions">
            {!currentCode ? (
              <button type="button" className="adm-test-btn adm-test-btn-primary" onClick={handleGenerate}>
                <Sparkles size={15} /> Generate code
              </button>
            ) : (
              <>
                <button type="button" className="adm-test-btn adm-test-btn-secondary" onClick={handleGenerate}>
                  <RefreshCw size={15} /> Regenerate
                </button>
                <button
                  type="button"
                  className="adm-test-btn adm-test-btn-primary"
                  onClick={handleAssign}
                  disabled={!productName.trim()}
                >
                  <Plus size={15} /> Assign to product
                </button>
              </>
            )}
          </div>

          <p className="adm-test-hint">
            Range: <strong>SHO-000000</strong> to <strong>SHO-999999</strong> · ~1,000,000 unique codes
          </p>
        </section>

        {/* Assigned list */}
        {assignedCodes.length > 0 && (
          <section className="adm-test-card">
            <div className="adm-test-card-head">
              <Check size={16} />
              <h2>Assigned codes ({assignedCodes.length})</h2>
            </div>
            <div className="adm-test-list">
              {assignedCodes.map((a) => (
                <div className="adm-test-list-item" key={a.code}>
                  <div>
                    <p className="adm-test-list-code">{a.code}</p>
                    <p className="adm-test-list-name">{a.name}</p>
                  </div>
                  <button
                    type="button"
                    className="adm-test-list-remove"
                    onClick={() => handleRemove(a.code)}
                    aria-label={`Remove ${a.code}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Validator */}
        <section className="adm-test-card">
          <div className="adm-test-card-head">
            <AlertCircle size={16} />
            <h2>Validate a code</h2>
          </div>

          <label className="adm-test-field">
            <span className="adm-test-label">Paste or type a code</span>
            <div className="adm-test-validate-row">
              <input
                type="text"
                value={validateInput}
                onChange={(e) => {
                  setValidateInput(e.target.value);
                  setValidateResult(null);
                }}
                placeholder="SHO-123456 or 123456"
                className="adm-test-input"
              />
              <button type="button" className="adm-test-btn adm-test-btn-secondary" onClick={handleValidate}>
                Check
              </button>
            </div>
          </label>

          {validateResult && (
            <div className={`adm-test-result ${validateResult.ok ? 'is-ok' : 'is-bad'}`}>
              {validateResult.ok ? <Check size={14} /> : <AlertCircle size={14} />}
              <span>{validateResult.msg}</span>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
