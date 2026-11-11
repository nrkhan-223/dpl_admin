import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link,
  Code,
  Eye,
  Edit3,
  Sparkles,
  FileCode2,
  Undo2,
} from 'lucide-react';

interface HtmlEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  placeholder?: string;
}

export const HtmlEditor: React.FC<HtmlEditorProps> = ({
  value,
  onChange,
  label = 'Article Description (HTML Format)',
  placeholder = 'Type or paste HTML formatted text here...',
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert HTML tags around selected text or at cursor
  const insertTag = (openTag: string, closeTag: string, defaultText = 'sample text') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + `${openTag}${defaultText}${closeTag}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    const replacement = `${openTag}${selectedText}${closeTag}`;

    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);

    // Reposition cursor inside or right after
    setTimeout(() => {
      textarea.focus();
      const newCursor = start + openTag.length + selectedText.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 20);
  };

  const insertBlock = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + '\n' + snippet);
      return;
    }
    const start = textarea.selectionStart;
    const updated = value.substring(0, start) + snippet + value.substring(start);
    onChange(updated);
    setTimeout(() => {
      textarea.focus();
    }, 20);
  };

  const templates = [
    {
      label: 'Market Report Template',
      snippet: `<h2>Q1 2026 Metropolitan Luxury Market Report</h2>
<p>Recent transaction velocity across high-rise developments reflects sustained demand for multi-bedroom residences with private balconies.</p>
<blockquote>"Cap rates remain resilient in prime urban corridors, driven by premium corporate tenant relocations."</blockquote>
<h3>Core Takeaways</h3>
<ul>
  <li><strong>Average Yield:</strong> 6.8% annualized net operating income.</li>
  <li><strong>Occupancy:</strong> 96.4% across verified multi-unit buildings.</li>
</ul>
<p>Contact the DPL Advisory team for localized asset valuation reports.</p>`,
    },
    {
      label: 'Architecture Spotlight',
      snippet: `<h2>Design Spotlight: Modernist Façades & Private Loggias</h2>
<p>Every apartment unit in this residence is crafted with acoustic isolation and floor-to-ceiling double-glazed apertures.</p>
<h3>Architectural Highlights</h3>
<ul>
  <li><strong>Dual Balconies:</strong> Cross-ventilation reduces artificial HVAC dependency.</li>
  <li><strong>Custom Joinery:</strong> European oak millwork integrated throughout.</li>
</ul>`,
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <FileCode2 className="w-4 h-4 text-sky-700" />
          <span>{label}</span>
          <span className="text-xs text-sky-850 font-mono bg-sky-100/90 border border-sky-300 px-2 py-0.5 rounded-md">
            HTML Enabled
          </span>
        </label>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer min-h-[32px] ${
              activeTab === 'editor'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>HTML Code</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer min-h-[32px] ${
              activeTab === 'preview'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="border border-sky-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-600/20 transition-all">
        {/* Quick Toolbar (Active in Editor Mode) */}
        {activeTab === 'editor' && (
          <div className="bg-slate-50/90 border-b border-sky-100 p-2 flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => insertTag('<strong>', '</strong>', 'bold text')}
              title="Bold <strong>"
              className="p-1.5 hover:bg-white text-slate-700 hover:text-sky-800 rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<em>', '</em>', 'italic text')}
              title="Italic <em>"
              className="p-1.5 hover:bg-white text-slate-700 hover:text-sky-800 rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
            >
              <Italic className="w-4 h-4" />
            </button>

            <span className="w-px h-5 bg-slate-200 mx-1" />

            <button
              type="button"
              onClick={() => insertTag('<h2>', '</h2>\n', 'Section Heading')}
              title="Heading 2 <h2>"
              className="p-1.5 hover:bg-white text-slate-700 hover:text-sky-800 rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer flex items-center gap-0.5 text-xs font-bold"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<h3>', '</h3>\n', 'Subheading')}
              title="Heading 3 <h3>"
              className="p-1.5 hover:bg-white text-slate-700 hover:text-sky-800 rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer flex items-center gap-0.5 text-xs font-bold"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <span className="w-px h-5 bg-slate-200 mx-1" />

            <button
              type="button"
              onClick={() => insertTag('<p>', '</p>\n', 'Paragraph text goes here...')}
              title="Paragraph <p>"
              className="px-2 py-1 hover:bg-white text-slate-700 hover:text-sky-800 rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer text-xs font-bold"
            >
              &lt;p&gt;
            </button>

            <button
              type="button"
              onClick={() =>
                insertBlock(
                  '<ul>\n  <li>Key feature or point one</li>\n  <li>Key feature or point two</li>\n</ul>\n'
                )
              }
              title="Unordered List <ul>"
              className="p-1.5 hover:bg-white text-slate-700 hover:text-sky-800 rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                insertBlock(
                  '<ol>\n  <li>First step or milestone</li>\n  <li>Second step or milestone</li>\n</ol>\n'
                )
              }
              title="Ordered List <ol>"
              className="p-1.5 hover:bg-white text-slate-700 hover:text-sky-800 rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                insertTag(
                  '<blockquote>"',
                  '"</blockquote>\n',
                  'Notable quote or market insight...'
                )
              }
              title="Blockquote <blockquote>"
              className="p-1.5 hover:bg-white text-slate-700 hover:text-sky-800 rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
            >
              <Quote className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                insertTag(
                  '<a href="https://dpl.com" class="text-sky-800 underline font-semibold">',
                  '</a>',
                  'Link text'
                )
              }
              title="Anchor Link <a>"
              className="p-1.5 hover:bg-white text-slate-700 hover:text-sky-800 rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
            >
              <Link className="w-4 h-4" />
            </button>

            {/* Quick Templates menu */}
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-xs text-slate-400 hidden md:inline">Starters:</span>
              {templates.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChange(tpl.snippet)}
                  className="text-xs font-semibold text-sky-850 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  title="Replace with starter template"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Editor Body */}
        {activeTab === 'editor' ? (
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={10}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-4 font-mono text-xs sm:text-sm text-slate-800 bg-white focus:outline-hidden resize-y min-h-[220px] leading-relaxed"
              spellCheck={false}
            />
            <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Lines: {value.split('\n').length} · Length: {value.length} chars</span>
              <span>Raw HTML Source</span>
            </div>
          </div>
        ) : (
          /* Live Rendered HTML Preview */
          <div className="p-5 min-h-[220px] max-h-[380px] overflow-y-auto bg-slate-50/50">
            {value.trim() ? (
              <div
                className="prose prose-slate prose-sky max-w-none text-xs sm:text-sm leading-relaxed space-y-3 [&_h2]:text-base sm:[&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-2 [&_h2]:mb-1 [&_h3]:text-sm sm:[&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-2 [&_p]:text-slate-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-sky-950 [&_blockquote]:bg-sky-50/70 [&_blockquote]:p-2.5 [&_blockquote]:rounded-r-xl [&_strong]:text-slate-900 [&_strong]:font-bold"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            ) : (
              <div className="text-center py-10 text-slate-400">
                <FileCode2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-semibold text-xs text-slate-500">No HTML description entered</p>
                <p className="text-xs text-slate-400 mt-1">Switch to the HTML Code tab to add content</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
