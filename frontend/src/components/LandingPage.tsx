import React, { useState } from 'react';
import { Brain, FileText, MessageSquare, Zap, Mic, Sparkles, ChevronDown, Check, ArrowRight, Shield, Globe } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onEnterAuth: () => void;
}

export default function LandingPage({ onEnterApp, onEnterAuth }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-brand-cyan" />,
      title: "RAG Semantic Search",
      desc: "Instant vector-based search pulls specific context chunks from multiple long documents in milliseconds."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-brand-purple" />,
      title: "OCR Scan Extraction",
      desc: "Our high-fidelity OCR pipeline automatically detects and processes scanned or image-heavy PDFs."
    },
    {
      icon: <Mic className="w-6 h-6 text-brand-cyan" />,
      title: "Voice Assistant & TTS",
      desc: "Speak naturally to your documents and listen to high-fidelity AI audio responses on the fly."
    },
    {
      icon: <Zap className="w-6 h-6 text-brand-purple" />,
      title: "Multimodal AI Reading",
      desc: "Understand complex diagrams, infographics, tables, and financial charts embedded in your PDFs."
    },
    {
      icon: <FileText className="w-6 h-6 text-brand-cyan" />,
      title: "Summary Generator",
      desc: "Generate bullet notes, detailed reports, flashcards, or interview prep questions in one click."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-brand-purple" />,
      title: "Chat Memory Sessions",
      desc: "Persistent histories enable switching between research papers, legal documents, and textbooks."
    }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "$0",
      desc: "Perfect for students and casual researchers.",
      features: [
        "Up to 3 PDFs simultaneously",
        "Max 15MB file size limit",
        "Basic Chat Interface",
        "Standard RAG Semantic Search",
        "100 Questions per month"
      ],
      cta: "Start for Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mo",
      desc: "Designed for professionals and power users.",
      features: [
        "Unlimited simultaneous PDFs",
        "Up to 150MB per file",
        "Multimodal Chart & Image explanation",
        "Advanced AI Summary Generation",
        "Voice Assistant & Audio replies",
        "OCR Scanned PDF Support",
        "API Key integration option"
      ],
      cta: "Get DocuMind Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For universities, legal departments, and corporations.",
      features: [
        "Private dedicated vector databases",
        "SSO, SAML & Active Directory Auth",
        "99.9% uptime SLA guarantee",
        "Custom model fine-tuning support",
        "Unlimited questions & storage",
        "Dedicated account manager"
      ],
      cta: "Contact Enterprise Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      q: "How does the PDF retrieval system work?",
      a: "When you upload a PDF, DocuMind AI splits it into semantic chunks, encodes them into high-dimensional vector embeddings, and builds a local FAISS index. When you ask a question, we retrieve the top relevant text chunks and pass them to the selected LLM to construct a precise, citation-linked answer."
    },
    {
      q: "Can DocuMind read scanned documents or tables?",
      a: "Yes! If a document has no copyable text, our integrated OCR module automatically activates, converting images of text into readable characters. We also utilize multimodal LLMs (like Gemini Pro Vision) to analyze diagrams, flowcharts, and financial spreadsheets."
    },
    {
      q: "Is my data secure?",
      a: "Security is our highest priority. All uploaded documents are encrypted at rest and in transit. Your files are only used to build your local retrieval database and are never used to train public foundation models."
    },
    {
      q: "Which AI models are supported?",
      a: "DocuMind supports leading large language models, including Gemini 1.5 Pro, Claude 3.5 Sonnet, GPT-4o, and Llama 3.3. You can toggle between models on the fly in the settings menu."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Corporate Counsel, Axiom Legal",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      quote: "DocuMind AI transformed how we analyze legal filings. We can review 200-page mergers and acquisitions disclosures in minutes, querying key liability terms seamlessly."
    },
    {
      name: "David Chen",
      role: "Research Scientist, BioTech Labs",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      quote: "Retrieving references across dozens of biotech papers used to take days. The multimodal support is amazing—it actually explains cellular pathway diagrams and DNA sequencing charts."
    }
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Floating particles background container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-blue-500/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-purple-500/10 blur-[120px] animate-pulse-slow" />
      </div>

      {/* Header */}
      <header className="relative w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-purple flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-wide bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">DocuMind AI</h1>
            <span className="text-[10px] text-brand-cyan font-semibold uppercase tracking-wider block">Enterprise Grade RAG</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-brand-cyan transition-colors">Features</a>
          <a href="#pricing" className="hover:text-brand-cyan transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-brand-cyan transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={onEnterAuth}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button 
            onClick={onEnterApp}
            className="relative group px-5 py-2.5 rounded-xl overflow-hidden font-medium text-sm text-black bg-white transition-all hover:scale-105 active:scale-95 shadow-md shadow-white/5 hover:shadow-cyan-500/20 cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-1.5 font-semibold">
              Launch App <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/20 backdrop-blur-md mb-8 animate-float">
          <Sparkles className="w-4 h-4 text-brand-cyan" />
          <span className="text-xs font-semibold text-brand-cyan tracking-wide uppercase">AI SaaS Platform of 2026</span>
        </div>

        <h2 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight max-w-5xl mx-auto mb-6">
          Transform Documents into <span className="gradient-text">Conversations</span>
        </h2>

        <p className="text-slate-400 text-base sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-light">
          Upload research papers, legal contracts, or textbooks. Chat with multiple PDFs, extract text from scans using OCR, view dynamic chart explanations, and generate beautiful summaries in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button 
            onClick={onEnterApp}
            className="w-full sm:w-auto relative group px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-brand-cyan to-brand-purple hover:opacity-90 transition-all hover:scale-105 hover:shadow-cyan-500/25 active:scale-95 cursor-pointer shadow-lg"
          >
            Start Chatting Free
          </button>
          <button 
            onClick={() => {
              const el = document.getElementById('demo');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Watch Demo
          </button>
        </div>

        {/* Demo Video Mock / Interactive Visualization */}
        <div id="demo" className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden glass-panel gradient-border p-3 shadow-2xl">
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950/80 flex flex-col">
            {/* Mock Chat UI Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/40">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/50" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <span className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-xs text-slate-500 font-mono select-none">demo_session_financial_report.pdf</span>
              <span className="w-4" />
            </div>

            {/* Inner Content Demo Screen */}
            <div className="flex-1 grid grid-cols-3 text-left divide-x divide-white/5 overflow-hidden">
              <div className="p-4 bg-slate-950/40 hidden md:block">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mb-3">Documents</span>
                <div className="p-2.5 rounded-lg border border-cyan-500/30 bg-cyan-950/10 flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-brand-cyan" />
                  <span className="text-xs font-medium text-slate-200 truncate">Q4_Report_2026.pdf</span>
                </div>
                <div className="p-2.5 rounded-lg border border-white/5 bg-white/5 flex items-center gap-2 opacity-50">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-300 truncate">NDA_Draft_Signed.pdf</span>
                </div>
              </div>

              <div className="col-span-3 md:col-span-2 p-6 flex flex-col justify-between bg-gradient-to-b from-[#060410] to-[#010103]">
                <div className="space-y-4 max-y-64 overflow-y-auto">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0">U</div>
                    <div className="p-3 rounded-xl border border-white/5 bg-white/5 text-xs text-slate-300 max-w-[80%]">
                      Can you explain the operating expenses in Q4 2026?
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded bg-gradient-to-tr from-brand-cyan to-brand-purple flex items-center justify-center text-[10px] text-white font-bold shrink-0">AI</div>
                    <div className="p-3 rounded-xl border border-white/5 bg-slate-900/60 text-xs text-slate-300 space-y-2 max-w-[85%]">
                      <p>According to the <strong>Q4 Financial Summary on Page 14</strong>, operating expenses increased by 12% to <strong>$4.2M</strong>, primarily driven by:</p>
                      <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px] text-slate-400">
                        <li>R&amp;D investments for core generative models ($2.1M)</li>
                        <li>Sales scaling &amp; customer success team expansion ($1.4M)</li>
                      </ul>
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mr-1">RAG Sources:</span>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] text-brand-cyan font-mono font-semibold">page 14 · chunk #32</span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] text-brand-purple font-mono font-semibold">confidence 97%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 flex gap-2">
                  <div className="flex-1 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-xs text-slate-500 font-mono">
                    Ask a question about your PDF...
                  </div>
                  <div className="p-2 rounded-lg bg-brand-cyan text-black flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 z-10 relative">
        <div className="text-center mb-16">
          <h3 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Powered by Advanced <span className="gradient-text">Document AI</span>
          </h3>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Experience next-generation vector search coupled with advanced visual and speech pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => (
            <div key={index} className="p-8 rounded-2xl glass-card glass-card-hover group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-cyan/2 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-3 w-fit rounded-xl bg-white/5 mb-6 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h4 className="font-display font-semibold text-lg text-slate-100 mb-2">{feat.title}</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 z-10 relative bg-black/10 backdrop-blur-sm">
        <div className="text-center mb-16">
          <h3 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Loved by researchers, lawyers, and students
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((test, idx) => (
            <div key={idx} className="p-8 rounded-2xl border border-white/5 bg-slate-950/40 space-y-4">
              <p className="text-slate-300 italic text-sm leading-relaxed">
                "{test.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h5 className="text-xs sm:text-sm font-semibold text-white">{test.name}</h5>
                  <p className="text-[11px] text-slate-500">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 z-10 relative">
        <div className="text-center mb-16">
          <h3 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h3>
          <p className="text-slate-400 text-sm sm:text-base">
            Choose the plan that fits your productivity requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricing.map((tier, idx) => (
            <div 
              key={idx} 
              className={`p-8 rounded-2xl glass-card flex flex-col justify-between relative ${tier.popular ? 'border-brand-cyan/50 shadow-cyan-500/5 neon-glow-cyan' : 'border-white/5'}`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-black bg-brand-cyan">
                  Most Popular
                </span>
              )}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-slate-200">{tier.name}</h4>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                    {tier.period && <span className="text-slate-500 text-sm">{tier.period}</span>}
                  </div>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">{tier.desc}</p>
                </div>

                <ul className="space-y-3.5 border-t border-white/5 pt-6 text-xs text-slate-300">
                  {tier.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand-cyan shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={onEnterApp}
                className={`mt-8 w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                  tier.popular 
                    ? 'bg-gradient-to-r from-brand-cyan to-brand-purple text-white hover:opacity-90 shadow-lg' 
                    : 'bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5 z-10 relative">
        <h3 className="font-display font-bold text-3xl text-center mb-12">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h3>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="rounded-xl border border-white/5 bg-slate-950/20 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-medium text-sm sm:text-base text-slate-200 hover:text-white transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-brand-cyan' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-white/5 bg-slate-950/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 z-10 relative mb-16">
        <div className="p-12 rounded-3xl bg-gradient-to-r from-[#0d0722] via-[#050616] to-[#040921] border border-brand-purple/20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[20vw] h-[20vw] bg-purple-500/10 blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-[20vw] h-[20vw] bg-cyan-500/10 blur-[80px]" />

          <h3 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Ready to unlock your documents?
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto mb-8">
            Join thousands of professionals, lawyers, and students who use DocuMind AI to read research, review agreements, and study smarter.
          </p>
          <button
            onClick={onEnterApp}
            className="px-8 py-4 rounded-xl font-bold text-black bg-white hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5 hover:shadow-cyan-500/20 cursor-pointer"
          >
            Get Started Instantly
          </button>

          <div className="flex justify-center items-center gap-6 mt-12 text-slate-500 text-xs">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-brand-purple" /> GDPR Compliant</span>
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-brand-cyan" /> 256-bit Encryption</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full border-t border-white/5 bg-black/40 py-10 text-center text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 DocuMind AI. All rights reserved. Platform built for investor demonstration.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400">Terms</a>
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
